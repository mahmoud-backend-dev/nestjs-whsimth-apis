import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { User } from '../schema/users.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    if (!email) return false;
    const user = await this.userModel.findOne({ email });
    if (user) throw new NotFoundException('user already exist');
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'email is required and must be valid email address';
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return async function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
