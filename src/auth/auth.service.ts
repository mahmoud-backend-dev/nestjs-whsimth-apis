import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/users.schema';
import { SignUpDto } from './dtos/sign-up.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailService: MailService,
    private jwtService: JwtService
  ) { }
  
  async signup(signUpDto: SignUpDto): Promise<object>{
    const user = await this.userModel.findOne({ email: signUpDto.email });
    if (!user) {
      const newUser = await this.userModel.create(signUpDto);
      const token = newUser.createJWTForConfirmEmail();
      const url = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
      await this.mailService.sendUserConfirmation(newUser.email, newUser.firstName, url);
      newUser.resetCodeExpiredForSignup = new Date(Date.now() + 60 * 60 * 1000);
      await newUser.hashedPassword();
      await newUser.save();
      return {
        status:'success',
        message: 'Please check your email for verification'
      }
    }
    if (user && user.resetVerifyForSignup)
      throw new BadRequestException('User already exists');
    if (user && (user.resetCodeExpiredForSignup > new Date(Date.now())))
      throw new BadRequestException('We already sent you a verification code please check your email');
    if (user && user.banExpired > new Date(Date.now()))
      throw new BadRequestException('User is banned for some time');
    if (user && user.banForever)
      throw new BadRequestException('User is banned forever please contact admin');
    if (user && user.isBanned) user.isBanned = false && user.banExpired == null;
    const token = user.createJWTForConfirmEmail();
    const url = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    await this.mailService.sendUserConfirmation(
      user.email,
      user.firstName,
      url,
    );
    user.firstName = signUpDto.firstName;
    user.lastName = signUpDto.lastName;
    user.email = signUpDto.email;
    user.password = signUpDto.password;
    user.resetCodeExpiredForSignup = new Date(Date.now() + 60 * 60 * 1000);
    await user.hashedPassword();
    await user.save();
    return {
      message: 'Please check your email for verification',
    };
  }

  async verifyConfirmEmail(token: string): Promise<object> {
    if (!token)
      throw new BadRequestException('Token is required');
    const payload = this.jwtService.verify(token);
    if (!payload || !payload['userIdForSignup'])
      throw new UnauthorizedException('Invalid token');
    const user = await this.userModel.findById(payload['userId'])
      .populate({
        path: 'role',
      });
    if(!user)
      throw new NotFoundException('User not found');
    const accessToken = user.createJWTForAuthorizedUser();
    user.resetVerifyForSignup = true;
    user.resetCodeExpiredForSignup = null;
    await user.save();
    return {
      user,
      token:accessToken,
    }
  }

  async login(loginDto: LoginDto): Promise<object> {
    const user = await this.userModel.findOne({ email: loginDto.email })
      .populate({
        path: 'role',
      });
    if (user && !user.resetVerifyForSignup)
      throw new BadRequestException('Please verify your email first');
    if (!user || !await user.comparePassword(loginDto.password))
      throw new UnauthorizedException('Invalid credentials');
    const token = user.createJWTForAuthorizedUser();
    return {
      user,
      token,
    }
  }

  async forgetPassword(email: string): Promise<object> {
    if (!email)
      throw new BadRequestException('Email is required');
    const user = await this.userModel.findOne({ email });
    if (!user || !user.resetVerifyForSignup)
      throw new NotFoundException('User not found');
    if (user.resetCodeExpiredForResetPassword > new Date(Date.now()))
      throw new BadRequestException('We already sent you a verification code please check your email');
    if (user.banExpired > new Date(Date.now()))
      throw new BadRequestException('User is banned for some time');
    if (user.banForever)
      throw new BadRequestException('User is banned forever please contact admin');
    if (user.isBanned) user.isBanned = false && user.banExpired == null;
    const token = user.createJWTForConfirmResetPassword();
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailService.sendResetPasswordConfirmation(user.email, user.firstName, url);
    user.resetCodeExpiredForResetPassword = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    return {
      message: 'Please check your email for reset password verification',
    };
  }

  async verifyConfirmResetPassword(token: string): Promise<object> {
    if (!token)
      throw new BadRequestException('Token is required');
    const payload = this.jwtService.verify(token);
    if (!payload || !payload['userIdForResetPassword'])
      throw new UnauthorizedException('Invalid token');
    const user = await this.userModel.findById(payload['userId'])
      .populate({
        path: 'role',
      });
    if (!user)
      throw new NotFoundException('User not found');
    user.resetVerifyForResetPassword = true;
    user.resetCodeExpiredForResetPassword = null;
    await user.save();
    return {
      status: 'success',
      user
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<object> {
    const user = await this.userModel.findOne({ email: resetPasswordDto.email });
    if (!user || !user.resetCodeExpiredForSignup)
      throw new NotFoundException('User not found');
    if (!user.resetVerifyForResetPassword)
      throw new BadRequestException('Please verify your email first');
    if (user.banExpired > new Date(Date.now()))
      throw new BadRequestException('User is banned for some time');
    if (user.banForever)
      throw new BadRequestException('User is banned forever please contact admin');
    if (user.isBanned) user.isBanned = false && user.banExpired == null;
    user.password = resetPasswordDto.password;
    user.resetVerifyForResetPassword = false;
    await user.hashedPassword();
    await user.save();
    const token = user.createJWTForAuthorizedUser();
    return {
      status: 'success',
      message: 'Password reset successfully',
      user,
      token,
    }
  }
}
