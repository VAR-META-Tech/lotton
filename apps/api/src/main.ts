import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

// Set the timezone to UTC
process.env.TZ = 'Etc/Universal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const logger = new Logger('GameOnTon');

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('main.apiPrefix'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(helmet());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 1500,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        meta: {
          code: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later.',
        },
        data: {},
      },
    }),
  );

  if (!configService.get('main.isProduction')) {
    setupSwagger(app);
  }

  await app.listen(configService.get('main.port') ?? 1410);
  logger.log(
    `App is running on ${configService.get('main.port') ?? 1410} port!`,
  );
}
bootstrap();
