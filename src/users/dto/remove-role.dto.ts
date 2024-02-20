import { IsUserNotExist } from "../validation/user-not-exist.rule";

export class RemoveRoleDto {
  @IsUserNotExist()
  id: string;
}