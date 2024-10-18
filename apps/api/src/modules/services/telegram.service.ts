import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

import { TelegramBotAction } from '@/shared/enums';
import { getLogger } from '@/utils/logger';

const logger = getLogger('TelegramService');
const ROUTES = {
  FAQ: '/faq',
  LOGO_FILL: '/logo_fill.png',
  LOGO: '/logo.png',
  LOGO_WITH_TEXT: 'https://i.ibb.co/T1tyXKn/lotton-640x360.png',
};
@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(private readonly configService: ConfigService) {
    this.bot = new TelegramBot(this.configService.get('telegram.botToken'), {
      polling: true,
    });
    this.init();
    logger.info('TelegramService initialized');
  }

  async init() {
    this.bot.on('message', this.handleMessage);
    this.bot.on('callback_query', this.handleCallback);
  }

  handleMessage = (msg: TelegramBot.Message) => {
    const action = msg.text;
    switch (action) {
      case TelegramBotAction.COMMAND_START:
        this.handleStart(msg);
        break;
      case TelegramBotAction.COMMAND_FAQ:
        this.handleFaq(msg);
        break;
      case TelegramBotAction.COMMAND_HELP:
        this.handleHelp(msg);
        break;
      default:
        break;
    }
  };

  handleCallback = (callback: TelegramBot.CallbackQuery) => {
    const action = callback.data;

    switch (action) {
      case TelegramBotAction.CALLBACK_FAQ:
        this.handleFaq(callback.message);
        break;
      case TelegramBotAction.CALLBACK_HELP:
        this.handleHelp(callback.message);
        break;
      default:
        break;
    }
  };

  handleStart = (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const message = `Hello @${msg.chat.username}! Welcome to Lotton.\nDon't forget about your friends — bring them to the game and get even more coins together!`;

    this.bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch Lotton 💵',
              url: this.configService.get('telegram.appUrl', {
                infer: true,
              }),
            },
          ],
          [
            {
              text: 'Faq & Privacy 📃',
              callback_data: 'faq',
            },
            {
              text: 'Help ⭐',
              callback_data: 'help',
            },
          ],
        ],
      },
    });
  };

  handleFaq = (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    this.bot.sendMessage(
      chatId,
      "At lottery we expect at a day’s start is you, better and happier than yesterday.Your privacy is respected.\nWe don't care about your gender, age or nationality.No bullshit.\n\nMore details in the big white docs",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Faq & Privacy 📃',
                web_app: {
                  url:
                    this.configService.get('main.appUrl', { infer: true }) +
                    ROUTES.FAQ,
                },
              },
            ],
          ],
        },
      },
    );
  };

  handleHelp = (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const caption = `*We're here to help you with anything and everything* \n
*How to play*\n
\\- 🎫 *Get your Tickets*:\n\tPrice and limit \\(per transaction\\) are set each round\\. Ticket sales close an hour before draw\\.
\\- ⏰ *Watch the time*:\n\tThen the count down ends, the next block will be pulled and drawing will commence\\.
\\- 💸 *Become a Winner*:\n\tIf your ticket values match the winning ticket in sequential order, then you are a winner\\!\n
*How to win*\n
Each value must match in order to win\\.\nFor example:
\\- 👍The first three values match, and in order\\. The fourth doest not match, thus the user wins in the “Match First 3” prize bracket\\.
\\- 👎 Even though 3 of the digits match, the first does not\\. This is no prize\n
*Prize pool*\n
\\- *Funding Sources*\nThe Prize Pool itself is made up of both ticket purchases, and rollover prizes from prior rounds without winners\\.
\\- *Allocations*\nWhen multiple users have won in the same bracket their prizes are split evenly among that bracket\\.
`;
    this.bot.sendPhoto(chatId, ROUTES.LOGO_WITH_TEXT, {
      caption,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch Lotton 💵',
              url: this.configService.get('telegram.appUrl', {
                infer: true,
              }),
            },
          ],
        ],
      },
    });
  };
}
