import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { User } from 'src/users/schema/users.schema';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { Store } from 'src/stores/schema/store.schema';


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


  async updateRole(id: string, updateRoleBodyDto: UpdateRoleBodyDto): Promise<object> {
    const { name, permissions, store } = updateRoleBodyDto;
    if (store && !permissions) {
      const role = await this.roleModel.findById(id);
      if (!role.store)
        throw new BadRequestException('role does not have a store, cannot update store');
      const storeExist = await this.storeModel.findById(store);
      if (!storeExist) throw new NotFoundException('store does not exist');
    }
    const role = await this.roleModel
      .findByIdAndUpdate(
        id,
        { name, permissions, store },
        { new: true, runValidators: true },
    )
    return {
      status: 'success',
      message: 'role updated successfully',
      role,
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
}
