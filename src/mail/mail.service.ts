import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RequestType } from 'src/common/interfaces/type-request.interface';

interface Mail {
  responsible_name: string;
  responsible_email: string;
  employee_name: string;
  requestType: RequestType;
  folio: string;
  url: string;
}

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(data: Mail) {
    const {
      responsible_name,
      responsible_email,
      employee_name,
      requestType,
      folio,
      url,
    } = data;

    await this.mailerService.sendMail({
      to: responsible_email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Request of ${requestType} - ${employee_name}`,
      template: './email-template',
      context: {
        responsible_name,
        employee_name,
        requestType,
        folio,
        url,
      },
    });
  }
}
