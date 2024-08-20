import type { ConfigFactory } from '@nestjs/config';

import type { AdminAuthConfig } from './admin_auth.config';
import adminAuth from './admin_auth.config';
import type { DatabaseConfig } from './database.config';
import database from './database.config';
import type { FileConfig } from './file.config';
import file from './file.config';
import type { MainConfig } from './main.config';
import main from './main.config';
import type { RedisConfig } from './redis.config';
import redis from './redis.config';
import type { TelegramConfig } from './telegram.config';
import telegram from './telegram.config';
import type { UserAuthConfig } from './user_auth.config';
import userAuth from './user_auth.config';

export const load: ConfigFactory[] = [
  main,
  database,
  redis,
  file,
  adminAuth,
  userAuth,
  telegram,
];

export type StellaConfig = {
  main: MainConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  file: FileConfig;
  adminAuth: AdminAuthConfig;
  userAuth: UserAuthConfig;
  telegram: TelegramConfig;
};
