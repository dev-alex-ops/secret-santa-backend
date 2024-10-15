import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMail } from '../interfaces/mailer.interface';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import * as Nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailerService {
  private _transporter: Nodemailer.Transporter

  adminMail = this._configService.get<string>('ADMIN_MAIL');
  appPassword = this._configService.get<string>('APP_PASSWORD');
  subject = this._configService.get<string>('MAIL_SUBJECT');
  limitPrice = this._configService.get<number>('LIMIT_PRICE');

  constructor(private _configService: ConfigService) {
    this._transporter = Nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.adminMail,
        pass: this.appPassword,
      },
    })
  }

  async sendMail(...sendMails: SendMail[]): Promise<void> {
    let apiResponse: any

    for (const send of sendMails){
      const html = this._buildContent(send.to.name, send.receiver);

      const options: MailOptions = {
        from: send.from,
        to: send.to.email,
        subject: this.subject,
        html,
        bcc: this.adminMail,
      }

      try {
        apiResponse = await this._transporter.sendMail(options)
      } catch (error) {
        console.log('mailerService sendMail:', error)
        throw new InternalServerErrorException({ message: error })
      }
    }
  }

  private _buildContent(senderName: string, receiverName: string): string {
    return `<html><head></head><body><h1>¡Hola ${senderName}!</h1><p>Este año eres el amigo invisible de <b>${receiverName}</b>.</p><p>Regala una mierda o algo, socio</p><h3><b><u>Precio máximo:</u> ${this.limitPrice}</b></h3></body></html>`
  }
}
