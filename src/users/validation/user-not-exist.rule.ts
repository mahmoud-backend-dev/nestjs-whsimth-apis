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
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class IsUserNotExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) return false;
    if(!isMongoId(id)) throw new ForbiddenException('Invalid user id');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user does not exist');
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
