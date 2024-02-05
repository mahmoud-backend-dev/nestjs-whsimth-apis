import {
  IsOptional,
  IsString
} from 'class-validator';
import { Permissions } from '../schema/role.schema';
import { IsStoreForMangeOrder } from '../validation/is-store-already-for-manage-order.rule';

export class CreateRoleDto {
  @IsString({ message: 'name is required and must be a string' })
  name: string;

  @IsOptional()
  store: string;

  // @IsEnum(Permissions, {
  //   each: true,
  //   message: `permissions must be a valid enum value of array: ${Object.values(
  //     Permissions,
  //   ).join(', ')}`,
  // })
  @IsStoreForMangeOrder()
  permissions: Permissions[];
}
