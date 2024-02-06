import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Permissions, Role } from '../schema/role.schema';
import { Model } from 'mongoose';
import {
  BadRequestException,
  NotFoundException
} from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class UpdateRoleConstraintIdParam
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) return false;
    if(!isMongoId(id)) throw new BadRequestException('role id is invalid');
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('role does not exist');
    if (role.permissions.includes(Permissions.OWNER) || role.permissions.includes(Permissions.ADMIN))
      throw new BadRequestException('you are not update this role');
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'id is required and must be valid role id';
  }
}

export function UpdateRoleId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UpdateRoleConstraintIdParam,
    });
  };
}


