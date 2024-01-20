import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { };

  async sendUserConfirmation(email: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      from: `" WhSmith " <${process.env.MAIL_FROM}>`,
      template: 'confirm-mail',
      context: {
        name,
        url
      }
    });
  }

  async sendResetPasswordConfirmation(email: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      from: `" WhSmith " <${process.env.MAIL_FROM}>`,
      template: 'reset-password',
      context: {
        name,
        url
      }
    });
  }
}
