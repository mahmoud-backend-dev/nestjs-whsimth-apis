import { IsEmail, IsString, MinLength } from "class-validator";

export class SignUpDto{
  @IsString({ message: 'firstName must be a string' })
  readonly firstName: string;

  @IsString({ message: 'lastName must be a string' })
  readonly lastName: string;

  @IsEmail({}, { message: 'email must be a string and must valid email' })
  readonly email: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  readonly password: string;
}