import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import { lastValueFrom } from 'rxjs';

import type { ICandlestick } from '@/shared/interfaces/candlestick.interface';
import { getFromCache } from '@/utils/cache';

import type { QueryBinanceTokenPriceDto } from '../token_price/dto/binance_token_price.query';

@Injectable()
export class BinanceService {
  constructor(private readonly httpService: HttpService) {}

  async predictNextPrice(
    query: QueryBinanceTokenPriceDto,
  ): Promise<{ price: number; time: string }> {
    try {
      const { symbol, interval } = query;
      const cacheKey = `${symbol}_${interval}`;

      const items = await getFromCache(
        cacheKey,
        async () => {
          const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toLocaleUpperCase()}&interval=${interval}`;
          const response = await lastValueFrom(this.httpService.get(url));
          return response.data;
        },
        60 * 5, // 5 minutes
      );

      const sequences = items.map((item: ICandlestick) => ({
        openTime: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
        closeTime: item[6],
        quoteAssetVolume: parseFloat(item[7]),
        numberOfTrades: item[8],
        takerBuyBaseAssetVolume: parseFloat(item[9]),
        takerBuyQuoteAssetVolume: parseFloat(item[10]),
      }));

      const normalizedData = this.normalizeSequences(sequences);
      const normalizedPrices = normalizedData.normalizedPrices;
      const times = sequences.map((seq) => seq.closeTime);

      const predictedNormalizedPrice = await this.modelPredict(
        normalizedPrices,
        times,
      );

      const predictedPrice = this.denormalizePrice(
        predictedNormalizedPrice,
        normalizedData.meanPrice,
        normalizedData.stdPrice,
      );

      // Add 1 week (3600000 milliseconds * 24 * 7) to the final time
      const lastTime = times[times.length - 1];
      if (isNaN(lastTime)) {
        throw new RangeError('Invalid time value');
      }
      const predictedTime = new Date(lastTime + 3600000 * 24 * 7);

      return { price: predictedPrice, time: predictedTime.toISOString() };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  normalizeSequences(sequences) {
    const prices = sequences.map((seq) => seq.close);
    const meanPrice =
      prices.reduce((acc: number, p: number) => acc + p, 0) / prices.length;
    const stdPrice = Math.sqrt(
      prices.reduce(
        (acc: number, p: number) => acc + Math.pow(p - meanPrice, 2),
        0,
      ) / prices.length,
    );
    const normalizedPrices = prices.map((p) => (p - meanPrice) / stdPrice);

    return {
      normalizedPrices,
      meanPrice,
      stdPrice,
      prices,
    };
  }

  denormalizePrice(
    normalizedPrice: number,
    meanPrice: number,
    stdPrice: number,
  ) {
    return normalizedPrice * stdPrice + meanPrice;
  }

  async modelPredict(normalizedPrices, times) {
    // Prepare data for the price prediction model after 1 week
    const xs = [];
    const ys = [];
    const timeStep = 3600000 * 24 * 7; // 1 week

    for (let i = 0; i < normalizedPrices.length - 1; i++) {
      if (times[i + 1] - times[i] >= timeStep) {
        xs.push([normalizedPrices[i]]);
        ys.push([normalizedPrices[i + 1]]);
      }
    }

    const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

    // Reshape data for LSTM
    const xsLSTM = xsTensor.reshape([xs.length, 1, 1]);

    const model = tf.sequential();
    model.add(
      tf.layers.lstm({ units: 50, returnSequences: false, inputShape: [1, 1] }),
    );
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(xsLSTM, ysTensor, { epochs: 100 });

    const input = tf
      .tensor2d([normalizedPrices[normalizedPrices.length - 1]], [1, 1])
      .reshape([1, 1, 1]);
    const output = model.predict(input) as tf.Tensor;
    const predictedNormalizedPrice = (await output.data())[0];

    return predictedNormalizedPrice;
  }
}
