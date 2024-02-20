import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: 'currentPassword is required' })
  @MinLength(8, { message: 'currentPassword must be at least 8 characters' })
  currentPassword: string;

  @IsString({ message: 'newPassword is required' })
  @MinLength(8, { message: 'newPassword must be at least 8 characters' })
  newPassword: string;

  @IsString({ message: 'confirmPassword is required' })
  @MinLength(8, { message: 'confirmPassword must be at least 8 characters' })
  confirmPassword: string;
}