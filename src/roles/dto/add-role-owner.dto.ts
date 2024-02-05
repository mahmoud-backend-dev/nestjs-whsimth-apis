
import { IsUserNotExist } from "src/users/validation/user-not-exist.rule";


export class CreateRoleOwnerDto {
  @IsUserNotExist()
  id: string;
}