import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import type { IMarketData } from '@/shared/interfaces/market_data.interface';
import { getLogger } from '@/utils/logger';

const logger = getLogger('TokenPriceService');

@Injectable()
export class TokenPriceService {
  BASE_TON_IO_API = 'https://tonapi.io';

  constructor(private readonly httpService: HttpService) {}

  async getPrice<F extends string, T extends string>(
    fromSymbol: F,
    toSymbol: T,
  ) {
    const pair = `?tokens=${fromSymbol}&currencies=${toSymbol}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_TON_IO_API}/v2/rates${pair.toLocaleLowerCase()}`,
        ),
      );
      return response.data as IMarketData<F, T>;
    } catch (error) {
      logger.error(error);
      throw new Error('[TONAPI.IO] Error while getting price:' + error);
    }
  }
}
