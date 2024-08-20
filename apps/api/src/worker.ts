import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppWorkerModule } from './app_worker.module';

// Set the timezone to UTC
process.env.TZ = 'Etc/Universal';

async function bootstrap() {
  const app = await NestFactory.create(AppWorkerModule);
  const logger = new Logger('Worker');

  const configService = app.get(ConfigService);

  await app.listen(configService.get('main.workerPort') ?? 1411);
  logger.log(
    `Worker is running on ${
      configService.get('main.workerPort') ?? 1411
    } port!`,
  );
}
bootstrap();
