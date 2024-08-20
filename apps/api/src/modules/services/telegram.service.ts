import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  constructor(private readonly configService: ConfigService) {
    this.bot = new TelegramBot(this.configService.get('telegram.botToken'), {
      polling: true,
    });
    this.init();
  }

  async init() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        `Hello! Welcome to P2W You are now the director of a crypto exchange. We’ll definitely appreciate your efforts once the token is listed (the dates are coming soon). Don't forget about your friends bring them to the game and get even more coins together!` +
          this.configService.get('telegram.appUrl', { infer: true }),
      );
    });
  }
}
