import { IsUserNotExist } from "../validation/user-not-exist.rule";

export class DeleteUserParamIdDto{
  @IsUserNotExist()
  id: string;
}