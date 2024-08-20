import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramConfig {
  @IsNotEmpty()
  @IsString()
  botToken: string;

  @IsNotEmpty()
  @IsString()
  appUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || undefined;
    this.appUrl = process.env.TELEGRAM_APP_URL || undefined;
  }
}

export default registerAs<TelegramConfig>(
  'telegram',
  () => new TelegramConfig(),
);
