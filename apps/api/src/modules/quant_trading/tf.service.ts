import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';

import type { QueryTFTokenPriceDto } from '../token_price/dto/tf_token_price.query';
import { TokenPriceService } from '../token_price/token_price.service';

@Injectable()
export class TFService {
  constructor(private readonly tokenPriceService: TokenPriceService) {}

  async predictNextPrice(
    query: QueryTFTokenPriceDto,
  ): Promise<{ price: number; time: string }> {
    const items = await this.tokenPriceService.getItems(query);

    const sequences = items.map((item) => ({
      price: parseFloat(item.price),
      time: new Date(item.createdAt).getTime(),
    }));

    const normalizedData = this.normalizeSequences(sequences);
    const normalizedPrices = normalizedData.normalizedPrices;
    const times = sequences.map((seq) => seq.time);

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
    const predictedTime = new Date(times[times.length - 1] + 3600000 * 24 * 7);

    return { price: predictedPrice, time: predictedTime.toISOString() };
  }

  normalizeSequences(sequences) {
    const prices = sequences.map((seq) => seq.price);
    const meanPrice = prices.reduce((acc, p) => acc + p, 0) / prices.length;
    const stdPrice = Math.sqrt(
      prices.reduce((acc, p) => acc + Math.pow(p - meanPrice, 2), 0) /
        prices.length,
    );
    const normalizedPrices = prices.map((p) => (p - meanPrice) / stdPrice);

    return {
      normalizedPrices,
      meanPrice,
      stdPrice,
      prices,
    };
  }

  denormalizePrice(normalizedPrice, meanPrice, stdPrice) {
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

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 50, inputShape: [1], activation: 'relu' }),
    );
    model.add(tf.layers.dense({ units: 50, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(xsTensor, ysTensor, {
      epochs: 200,
      batchSize: 32,
      validationSplit: 0.2,
    });

    const input = tf.tensor2d(
      [normalizedPrices[normalizedPrices.length - 1]],
      [1, 1],
    );
    const output = model.predict(input) as tf.Tensor;
    const predictedNormalizedPrice = (await output.data())[0];

    return predictedNormalizedPrice;
  }
}
