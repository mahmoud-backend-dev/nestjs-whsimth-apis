import { IsUserNotExist } from "../validation/user-not-exist.rule";
import { UpdateRoleId } from "src/roles/validation/update-role.rule";

export class AddRoleDto {
  @UpdateRoleId()
  role: string;

  @IsUserNotExist()
  user: string;
}