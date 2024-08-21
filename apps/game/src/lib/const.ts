import { Network } from '@orbs-network/ton-access';

const isProduction = process.env.NODE_ENV === 'production';
const signatureMessage =
  process.env.NEXT_PUBLIC_SIGNATURE_MESSAGE ??
  'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!';

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