import { Injectable } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { App } from '../interfaces/app.interface';
import { Exclusion, Recipient } from 'src/app.type';
import { SendMail } from 'src/interfaces/mailer.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private _service: MailerService, private _configService: ConfigService) {}
  
  adminMail = this._configService.get<string>('ADMIN_MAIL');
  appPassword = this._configService.get<string>('APP_PASSWORD');
  subject = this._configService.get<string>('MAIL_SUBJECT');
  
  async executeSecretSanta(app: App): Promise<void> {
    const { recipients: senders, exclusions } = app;

    let receivers = [ ...senders ];

    do {
      receivers = this._shuffle(...receivers);
    } while (!this._checkPairs(senders, receivers, exclusions));

    const sends: SendMail[] = []
    for (let i = 0; i < senders.length; i++) {
      const send: SendMail = {
        to: senders[i],
        receiver: receivers[i].name
      }
      sends.push(send);
    }
    await this._service.sendMail(...sends);
    console.log('Done! Check your emails');
  }

  private _shuffle(...array: Recipient[]): Recipient[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  private _checkPairs(senders: Recipient[], receivers: Recipient[], exclusions: Exclusion[]): boolean {
    for (let i = 0; i < senders.length; i++) {
      if (senders[i].email === receivers[i].email) {
        return false
      }
    }

    for (let i = 0; i < senders.length; i++) {
      const { email: currenSender } = senders[i];
      const { email: currentReceiver } = receivers[i];

      if(exclusions.find(({ sender, receiver }) => currenSender === sender && currentReceiver === receiver)){
        return false
      }
    }

    return true;
  }
}
