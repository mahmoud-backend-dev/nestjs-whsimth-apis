import { Exclude } from "class-transformer";


export class UserSanitizer {
  @Exclude()
  password: string;

  constructor(partial: Partial<UserSanitizer>) {
    Object.assign(this, partial);
  }
}