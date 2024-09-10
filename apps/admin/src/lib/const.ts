import { Network } from '@orbs-network/ton-access';

const isProduction = process.env.NODE_ENV === 'production';
const signatureMessage =
  process.env.NEXT_PUBLIC_SIGNATURE_MESSAGE ??
  'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!';

export const contractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'EQDlsQl0LNXrX1zKaVYjBkgV0jEyQPKFYxa3J30XELEiTra6';

export const env = {
  isProduction,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  USE_TESTNET: process.env.NEXT_PUBLIC_USE_TESTNET ?? 'false',
  signatureMessage,
};

export const isServer = typeof window === 'undefined';
export const isUseTestnet = env.USE_TESTNET === 'true';
export const network = isUseTestnet ? 'testnet' : ('mainnet' as Network);

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  '146918779218-chupnj1tmp12vmhe0qfq273aaq93khd6.apps.googleusercontent.com';

export const USER_COOKIES = {
  user: 'user_ton',
  token: 'token_ton',
  isLoggedIn: 'account_status_ton',
  refreshToken: 'refresh_token_ton',
};

export const LOGGED_IN_KEY = 'active';

export const POOL_STATUS = {
  UP_COMING: 'upcoming',
  ON_GOING: 'ongoing',
  CLOSED: 'closed',
} as const;

export const BIG_NUMBER = 1000000;
