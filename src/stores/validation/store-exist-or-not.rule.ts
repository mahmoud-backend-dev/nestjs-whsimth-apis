import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Store } from '../schema/store.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class StoreExistOrNotConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Store.name)
    private readonly stoleModel: Model<Store>,
  ) {}

  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) return false;
    if (!isMongoId(id)) return false;
    if (!await this.stoleModel.findById(id))
      throw new NotFoundException(`No store found with id ${id}`);
    return true;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `store is required and must be valid mongoId`;
  }
}

export function StoreExistOrNot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StoreExistOrNotConstraint,
    });
  };
}
