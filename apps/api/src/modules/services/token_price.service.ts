import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import type { IMarketData } from '@/shared/interfaces/market_data.interface';
import { getLogger } from '@/utils/logger';

const logger = getLogger('TokenPriceService');

@Injectable()
export class TokenPriceService {
  BASE_GATE_IO_API = 'https://data.gateapi.io';

  constructor(private readonly httpService: HttpService) {}

  async getPrice(fromSymbol: string, toSymbol: string): Promise<IMarketData> {
    const pair = `${fromSymbol}_${toSymbol}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_GATE_IO_API}/api/1/ticker/${pair.toLocaleLowerCase()}`,
        ),
      );

      return response.data as IMarketData;
    } catch (error) {
      throw new Error('[GATE.IO] Error while getting price:' + error);
    }
  }
}
