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
    return `<html><head></head><body><div style="text-align: center;"><h1>¡Hola ${senderName}!</h1><p>Este año eres el amigo invisible deeee...</p><br><br><br> <p><b style="color: blueviolet; font-size: x-large;">${receiverName}</b></p><img src="https://w7.pngwing.com/pngs/895/752/png-transparent-internet-meme-pol-the-hunt-meme-purple-child-face-thumbnail.png" alt="foto de meme"><p style="font-size: smaller;">POV - Tú pensando: "¿Y qué mieeerda le regalo yo a esta?"</p><p>Pero no te pases de original, <b style="font-size: larger;"> CHULA </b></p><br><br><br><p>Atentamente, <b>Astor Invisible</b></p></div></body></head></html>`
  }
}
