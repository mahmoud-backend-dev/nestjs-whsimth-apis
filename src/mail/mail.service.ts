import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { };

  async sendUserConfirmation(email: string, name: string, url: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `" WhSmith " <${process.env.MAIL_FROM}>`,
        subject: 'Confirm your email',
        template: 'confirm-mail',
        context: {
          name,
          url,
        },
      });
    } catch (error) {
      await this.userModel.findOneAndDelete({ email });
      throw new InternalServerErrorException(
        'Something went wrong please try again',
      );
    }
  }

  async sendResetPasswordConfirmation(email: string, name: string, url: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `" WhSmith " <${process.env.MAIL_FROM}>`,
        subject: 'Reset your password confirmation',
        template: 'reset-password',
        context: {
          name,
          url,
          email
        },
      });
    }
    catch (error) { 
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong please try again',
      );
    }
  }
}
