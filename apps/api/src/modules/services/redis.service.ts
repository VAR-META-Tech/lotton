import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import type { StellaConfig } from '@/configs';

const logger = new Logger('Redis');

@Injectable()
export class RedisService {
  private redis: Redis;
  private host: string;
  private port: number;
  private password?: string;

  constructor(private readonly configService: ConfigService<StellaConfig>) {
    this.host = this.configService.get('redis.host', { infer: true });
    this.port = this.configService.get('redis.port', { infer: true });
    this.password = this.configService.get('redis.password', { infer: true });

    this.redis = new Redis({
      host: this.host,
      port: this.port,
      password: this.password,
      lazyConnect: true,
      keepAlive: 1000,
    });

    logger.log(`Redis connected to ${this.host}:${this.port}`);
  }

  /**
   * This method retrieves data from Redis.
   * @param key - The key of the data to retrieve.
   * @returns The data associated with the key, or null if the key does not exist.
   */
  async get(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * This method stores data in Redis.
   * @param key - The key under which to store the data.
   * @param value - The data to store.
   * @param ttl - The time-to-live (in seconds) after which the data should be deleted.
   * @returns A promise that resolves when the data has been stored.
   */
  async set(key: string, value: any, ttl: number) {
    return await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
