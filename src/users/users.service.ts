import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Query } from 'express-serve-static-core';
import { paginate } from 'src/utils/pagination';
import { BanUserBodyDto } from './dto/ban-user.dto';
import { AddRoleDto } from './dto/add-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<object> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'passwords do not match confirm password and new password',
      );
    }
    const loggedUser = await this.userModel.findById(user._id);
    if (
      !(await loggedUser.comparePassword(changePasswordDto.currentPassword))
    ) {
      throw new BadRequestException('current password is incorrect');
    }
    loggedUser.password = changePasswordDto.newPassword;
    loggedUser.passwordChangedAt = new Date(Date.now());
    await loggedUser.hashedPassword();
    await loggedUser.save();
    return {
      status: 'success',
      message: 'password changed successfully',
    };
  }

  async getAllUsers(query: Query, userQuery: string): Promise<object> {
    const { limit, pagination, skip } = await paginate(this.userModel, query);
    const regexPatternUser = userQuery ? new RegExp(userQuery, 'i') : /.*/;
    const users = await this.userModel
      .find({
        $or: [
          { firstName: { $regex: regexPatternUser } },
          { lastName: { $regex: regexPatternUser } },
        ],
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'role',
        select: 'name permissions',
      });
    return {
      status: 'Success',
      count: users.length,
      pagination,
      users,
    };
  }

  async getAllAdminsUser(query: Query, userQuery: string): Promise<object> {
    const { limit, pagination, skip } = await paginate(this.userModel, query);
    const regexPatternUser = userQuery ? new RegExp(userQuery, 'i') : /.*/;
    const users = await this.userModel
      .find({
        role: { $ne: null },
        $or: [
          { firstName: { $regex: regexPatternUser } },
          { lastName: { $regex: regexPatternUser } },
        ],
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'role',
        select: 'name permissions',
      });
    return {
      status: 'Success',
      count: users.length,
      pagination,
      users,
    };
  }

  async deleteUser(id: string): Promise<object> {
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 'success',
      message: 'user deleted successfully',
    };
  }

  async banUser(
    id: string,
    banUserBodyDto: BanUserBodyDto,
    user: User,
  ): Promise<object> {
    if (user._id.toString() === id) {
      throw new BadRequestException('you can not ban yourself');
    }
    await this.userModel.findByIdAndUpdate(id, {
      banExpired: new Date(banUserBodyDto.date),
      isBanned: true,
    });
    return {
      status: 'success',
      message: 'user banned successfully',
    };
  }

  async banForeverUser(id: string, user: User): Promise<object> {
    if (user._id.toString() === id) {
      throw new BadRequestException('you can not ban yourself');
    }
    await this.userModel.findByIdAndUpdate(id, {
      banForever: true,
      isBanned: true,
    });
    return {
      status: 'success',
      message: 'user banned forever successfully',
    };
  }

  async unBanUser(id: string, user: User): Promise<object> {
    if (user._id.toString() === id) {
      throw new BadRequestException('you can not unban yourself');
    }
    await this.userModel.findByIdAndUpdate(id, {
      banExpired: null,
      banForever: false,
      isBanned: false,
    });
    return {
      status: 'success',
      message: 'user unbanned successfully',
    };
  }

  async aboutMe(id: string): Promise<object> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'role',
        select: 'name permissions',
      })
      .select('-password');
    return {
      status: 'success',
      user,
    };
  }

  async addRole(addRoleDto: AddRoleDto): Promise<object> {
    const user = await this.userModel
      .findByIdAndUpdate(
        addRoleDto.user,
        {
          role: addRoleDto.role,
        },
        { new: true, runValidators: true },
      )
      .populate({
        path: 'role',
        select: 'name permissions',
      }).select('-password');
    return {
      status: 'success',
      user,
    };
  }

  async removeRole(id: string): Promise<object> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          role: null,
        },
        { new: true, runValidators: true },
      ).select('-password');
    return {
      status: 'success',
      user,
    };
  }
}
