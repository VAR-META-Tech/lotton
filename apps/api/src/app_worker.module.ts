import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { load } from './configs';
import { TelegramService } from './modules/services/telegram.service';
import { WorkerModule } from './modules/worker/worker.module';
import { OrmModule } from './orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load,
    }),
    OrmModule,
    WorkerModule,
  ],
  providers: [TelegramService],
})
export class AppWorkerModule {}
