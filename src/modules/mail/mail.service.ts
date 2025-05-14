import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailInterface } from './SendMail.interface';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async sendMailFunc({email, context, mailName, subject, tamplatePath = 'authentication/authentication'}: SendMailInterface) {
    // Send password to user with Email
    await this.mailerService.sendMail({
      to: email,
      from: `"${mailName}" <infohatsapp@gmail.com>`,
      subject: subject,
      template: tamplatePath,
      context: {
        password:  context.password,
      },
    });
  }
}