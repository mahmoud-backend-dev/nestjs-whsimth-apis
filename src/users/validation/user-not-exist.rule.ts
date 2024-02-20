import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { User } from '../schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserNotExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) return false;
    if (!isMongoId(id)) throw new ForbiddenException('Invalid user id');
    const user = await this.userModel.findById(id).populate('role');
    if (!user) throw new NotFoundException('user does not exist');
    if (args.targetName === 'DeleteUserParamIdDto') {
      await user.populate({ path: 'role', select: 'name permissions' });
      if (user?.role?.name === 'owner') {
        throw new ForbiddenException('owner cannot be deleted');
      }
      if (user?.role?.name === 'admin') {
        throw new ForbiddenException('admin cannot be deleted');
      }
    }
    if (args.targetName === 'RemoveRoleDto') {
      if (user?.role?.name === 'owner') {
        throw new ForbiddenException('owner cannot be removed role');
      }
      if (user?.role?.name === 'admin') {
        throw new ForbiddenException('admin cannot be removed role');
      }
      if (user.role === null)
        throw new ForbiddenException('user does not have role');
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'id is required and must be valid user id';
  }
}

export function IsUserNotExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNotExistConstraint,
    });
  };
}
