import { Permissions } from '../schema/role.schema';
import { IsStoreForMangeOrder } from '../validation/is-store-already-for-manage-order.rule';
import { UpdateRoleId } from '../validation/update-role.rule';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateRoleIdDto {
  @UpdateRoleId()
  id: string;
}

export class UpdateRoleBodyDto {
  @IsOptional()
  @IsString({ message: 'name is required and must be a string' })
  name: string;

  @IsOptional()
  @IsStoreForMangeOrder()
  permissions: Permissions[];

  @IsOptional()
  @IsMongoId({ message: 'store must be a valid store mongo id' })
  store: string;
}
