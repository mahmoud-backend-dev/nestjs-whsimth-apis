import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  isMongoId,
  isArray,
} from 'class-validator';
import { Permissions } from '../schema/role.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Store } from 'src/stores/schema/store.schema';

@ValidatorConstraint({ async: true })
export class IsStoreAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<Store>,
  ) {}
  async validate(
    permissions: Permissions[],
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!permissions) return false;
    if (
      permissions.includes(Permissions.MANAGE_ORDER) &&
      args.targetName === 'CreateRoleDto'
    ) {
      const { store } = args.object as any;
      if (!store || !isMongoId(store))
        throw new BadRequestException(
          `store required and must valid for manage order permission`,
        );
      else {
        const storeExist = await this.storeModel.findById(store);
        if (!storeExist) throw new NotFoundException(`store does not exist`);
      }
    }
    if (args.object['store'] && !permissions.includes(Permissions.MANAGE_ORDER))
      delete args.object['store'];

    if (!isArray(permissions)) return false;

    if (
      permissions.filter((permission) =>
        Object.values(Permissions).includes(permission),
      ).length !== permissions.length
    )
      return false;
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `permissions required and permissions must be array of value: ${Object.values(
      Permissions,
    ).join(', ')}`;
  }
}

export function IsStoreForMangeOrder(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStoreAlreadyExistConstraint,
    });
  };
}
