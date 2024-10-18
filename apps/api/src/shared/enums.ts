export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PoolRoundStatusEnum {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  CLOSED = 'closed',
  DELETE = 'deleted',
}

export enum PoolStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum AdminStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export enum SocialAuthEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum BasicAuthEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum SwaggerOperationEnum {
  PUBLIC = 'Public',
  SUPER_ADMIN = 'Router for super admin',
  ADMIN = 'Router for admin',
  USER = 'Router for user',
}

export enum BinanceIntervalEnum {
  ONE_MINUTE = '1m',
  THREE_MINUTES = '3m',
  FIVE_MINUTES = '5m',
  FIFTY_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  ONE_HOUR = '1h',
  TWO_HOURS = '2h',
  FOUR_HOURS = '4h',
  SIX_HOURS = '6h',
  EIGHT_HOURS = '8h',
  TWELVE_HOURS = '12h',
  ONE_DAY = '1d',
  THREE_DAYS = '3d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
}

export enum EVENT_HEADER {
  CREATE_POOL_EVENT = 2095598070,
  BUY_TICKETS_EVENT = 3748203161,
  DRAW_WINNING_NUMBER = 3591482628,
  USER_CLAIM_PRIZE = 1449747896,
}

export enum TransactionType {
  BUY = 'buy',
  CLAIM = 'claim',
}

export enum UserTicketStatus {
  BOUGHT = 'bought',
  CONFIRMING_CLAIM = 'confirmingClaim',
  CONFIRMED_CLAIM = 'confirmedClaim',
}

export enum TelegramBotAction {
  COMMAND_FAQ = '/faq',
  COMMAND_START = '/start',
  COMMAND_HELP = '/help',
  CALLBACK_FAQ = 'faq',
  CALLBACK_HELP = 'help',
}
