import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  private getTransporter = () => {
    try {
      if (!this.transporter) {
        const transporter = nodemailer.createTransport({
          // @ts-ignore
          host: this.configService.get<string>('SMTP_HOST'),
          port: this.configService.get<string>('SMTP_PORT'),
          secure: false,
          auth: {
            user: this.configService.get<string>('SMTP_USER'),
            pass: this.configService.get<string>('SMTP_PASS'),
          },
        });
        this.transporter = transporter;
        return transporter;
      }
      return this.transporter;
    } catch (err) {
      this.logger.error('Failed to connect to mail transporter', err);
    }
  };

  constructor(private configService: ConfigService) {}

  async sendActivationMail(to: string, link: string) {
    await this.getTransporter().sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject: 'Confirm your account activation',
      text: '',
      html: `
                <div>
                    <h1>Please, follow the link below to activate your account</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
    });
  }
}
