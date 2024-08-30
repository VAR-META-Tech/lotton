import {
  Admin,
  AdminSession,
  LatestBlock,
  Network,
  NetworkToken,
  Pool,
  PoolPrize,
  PoolRound,
  Prizes,
  Token,
  TokenPrice,
  Transaction,
  User,
  UserSession,
  UserTicket,
} from './entities';

const entities = [
  Network,
  Token,
  LatestBlock,
  NetworkToken,
  Transaction,
  Admin,
  AdminSession,
  UserSession,
  User,
  TokenPrice,
  Pool,
  PoolPrize,
  PoolRound,
  UserTicket,
  Prizes,
];

export default entities;
