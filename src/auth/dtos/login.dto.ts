import { IsEmail, IsString } from "class-validator";

export class LoginDto{
  @IsEmail({}, { message: 'email must be a string and must valid email' })
  readonly email: string;

  @IsString({ message: 'password must be a string' })
  readonly password: string;
}