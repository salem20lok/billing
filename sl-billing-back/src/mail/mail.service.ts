import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async forgetPassword(
    email: string,
    name: string,
    link: string,
  ): Promise<boolean> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'change password',
        template: './forgetPassword',
        context: {
          name: name,
          link: link,
        },
      })
      .then(() => {
        console.log(`mail is send a : ${email}`);
      })
      .catch(() => {
        throw new NotFoundException(`this email : ${email} not Exist`);
      });
    return true;
  }

  async createBillingAccount(email: string, password: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'billing compte',
      template: './createBillingAccount',
      context: {
        email: email,
        password: password,
      },
    });
  }
}
