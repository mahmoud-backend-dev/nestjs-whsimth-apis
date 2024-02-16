import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { UserSanitizer } from './interceptors/user-sanitize.interceptor';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    signUpDto: SignUpDto,
  ): Promise<object> {
    return await this.authService.signup(signUpDto);
  }

  @Post('verify-email')
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyConfirmEmail(
    @Body('token')
    token: string,
  ): Promise<object> {
    const data: object = await this.authService.verifyConfirmEmail(token);
    const { _id: id, ...result } = data['user'].toObject();
    return {
      status: 'success',
      message: 'User verified successfully',
      user: new UserSanitizer({ _id: id.toString(), ...result }),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ): Promise<object> {
    const data: object = await this.authService.login(loginDto);
    const { _id: id, role, ...result } = data['user'].toObject();
    let idRole: string, resultRole: object;
    if (role !== null) {
      idRole = role['_id'];
      resultRole = role;
      delete resultRole['_id'];
    }
    return {
      status: 'success',
      message: 'User logged in successfully',
      user: new UserSanitizer({
        _id: id.toString(),
        role: role === null ? null : {
          _id: idRole?.toString(),
          ...resultRole,
        },
        ...result,
      }),
      token: data['token'],
    };
  }

  @Post('forget-password')
  async forgotPassword(
    @Body('email')
    email: string,
  ): Promise<object> {
    return await this.authService.forgetPassword(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('verify-reset-password')
  async verifyResetPassword(
    @Body('token')
    token: string,
  ): Promise<object> {
    const data: object = await this.authService.verifyConfirmResetPassword(
      token,
    );
    const { _id: id, ...result } = data['user'].toObject();
    return {
      status: data['status'],
      message: 'User verified successfully',
      user: new UserSanitizer({ _id: id.toString(), ...result }),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('reset-password')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ): Promise<object> {
    const data: object = await this.authService.resetPassword(resetPasswordDto);
    const { _id: id, ...result } = data['user'].toObject();
    return {
      status: data['status'],
      message: 'Password reset successfully',
      user: new UserSanitizer({ _id: id.toString(), ...result }),
      token: data['token'],
    };
  }
}
