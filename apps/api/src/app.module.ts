import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ExceptionFilter } from './common/exceptions/exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { load } from './configs';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { HealthController } from './modules/default/health.controller';
import { NetworkModule } from './modules/network/network.module';
import { QuantTradingModule } from './modules/quant_trading/quant_trading.module';
import { ServicesModule } from './modules/services/services.module';
import { SessionModule } from './modules/session/session.module';
import { TokenModule } from './modules/token/token.module';
import { TokenPriceModule } from './modules/token_price/token_price.module';
import { UserModule } from './modules/user/user.module';
import { OrmModule } from './orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load,
    }),
    OrmModule,
    AuthModule,
    AdminModule,
    UserModule,
    SessionModule,
    NetworkModule,
    TokenModule,
    TokenPriceModule,
    QuantTradingModule,
    ServicesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
