import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RedisConfig {
  @IsNotEmpty()
  @IsString()
  host: string;

  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  constructor() {
    this.host = process.env.REDIS_HOST || 'localhost';
    this.port = Number(process.env.REDIS_PORT) || 6379;
    this.password = process.env.REDIS_PASSWORD || undefined;
    this.name = process.env.REDIS_NAME || undefined;
  }
}

export default registerAs<RedisConfig>('redis', () => new RedisConfig());
