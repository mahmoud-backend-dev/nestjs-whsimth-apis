import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permissions, Role } from './schema/role.schema';
import { Model, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { User } from 'src/users/schema/users.schema';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { Store } from 'src/stores/schema/store.schema';
import { paginate } from 'src/utils/pagination';
import { Query } from 'express-serve-static-core';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Store.name)
    private storeModel: Model<Store>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<object> {
    const role = await this.roleModel.create(createRoleDto);
    return {
      status: 'success',
      message: 'role created successfully',
      role,
    };
  }

  async updateRole(
    id: string,
    updateRoleBodyDto: UpdateRoleBodyDto,
  ): Promise<object> {
    const { name, permissions, store } = updateRoleBodyDto;
    if (store && !permissions) {
      const role = await this.roleModel.findById(id);
      if (!role.store)
        throw new BadRequestException(
          'role does not have a store, cannot update store',
        );
      const storeExist = await this.storeModel.findById(store);
      if (!storeExist) throw new NotFoundException('store does not exist');
    }
    const role = await this.roleModel.findByIdAndUpdate(
      id,
      { name, permissions, store },
      { new: true, runValidators: true },
    );
    return {
      status: 'success',
      message: 'role updated successfully',
      role,
    };
  }

  async removeRole(id: string): Promise<object> {
    await this.roleModel.findByIdAndDelete(id);
    await this.userModel.updateMany(
      { role: new Types.ObjectId(id) },
      { role: null },
    );
    return {
      status: 'success',
      message: 'role removed successfully',
    };
  }

  async createRoleAdmin(id: string): Promise<object> {
    const role = await this.roleModel.create({
      name: 'admin',
      permissions: ['admin'],
    });
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { role: role._id },
        { new: true, runValidators: true },
      )
      .select('-password');

    return {
      status: 'Success',
      message: 'Add admin role far a user successfully',
      user,
    };
  }

  async removeAdminRole(id: string): Promise<object> {
    const user = await this.userModel.findById(id).populate({
      path: 'role',
      select: 'name permissions',
    });
    if (user.role === null || !user.role['permissions'].includes(Permissions.ADMIN))
      throw new BadRequestException('This user not admin');
    await this.userModel.findByIdAndUpdate(
      id,
      { role: null },
      { new: true, runValidators: true },
    );
    await this.roleModel.findByIdAndDelete(user.role._id);
    return {
      status: 'Success',
      message: 'Remove admin role far a user successfully',
    };
  }

  async createRoleOwner(id: string): Promise<object> {
    const role = await this.roleModel.create({
      name: 'owner',
      permissions: ['owner'],
    });
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { role: role._id },
        { new: true, runValidators: true },
      )
      .select('-password');

    return {
      status: 'Success',
      message: 'Add owner role far a user successfully',
      user,
    };
  }

  async removeOwnerRole(id: string): Promise<object> {
    const user = await this.userModel.findById(id).populate({
      path: 'role',
      select: 'name permissions',
    });
    if (user.role === null || !user.role['permissions'].includes(Permissions.OWNER))
      throw new BadRequestException('This user not owner');
    await this.userModel.findByIdAndUpdate(
      id,
      { role: null },
      { new: true, runValidators: true },
    );
    await this.roleModel.findByIdAndDelete(user.role._id);
    return {
      status: 'Success',
      message: 'Remove owner role far a user successfully',
    };
  }

  async getAllRoles(query: Query): Promise<object> {
    const { limit, pagination, skip } = await paginate(this.roleModel, query);
    const roles = await this.roleModel.find().skip(skip).limit(limit);
    return {
      status: 'Success',
      message: 'Get all roles successfully',
      count: roles.length,
      pagination,
      roles,
    };
  }
}
