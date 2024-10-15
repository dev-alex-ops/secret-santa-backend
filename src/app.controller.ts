import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppDto } from './app.dto';
import { App } from './interfaces/app.interface';

@Controller()
export class AppController {
  constructor(private _service: AppService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getHello(@Body() appDto: AppDto): Promise<void> {
    const app: App = { ...appDto }

    await this._service.executeSecretSanta(app);
  }
}
