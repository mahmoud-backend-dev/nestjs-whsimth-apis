import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Category } from '../schema/category.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class CategoryExistOrNotConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) return false;
    if (!isMongoId(id)) return false;
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('category not found');
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'category required or must be valid  mongo id';
  }
}

export function CategoryExistOrNot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CategoryExistOrNotConstraint,
    });
  };
}
