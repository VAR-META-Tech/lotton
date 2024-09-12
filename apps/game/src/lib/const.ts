/* eslint-disable turbo/no-undeclared-env-vars */
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
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
  CLAIM_FEE: process.env.NEXT_PUBLIC_CLAIM_FEE ?? '0',
  signatureMessage,
  END_POINT_TON_CLIENT: process.env.NEXT_PUBLIC_END_POINT_TON_CLIENT ?? '',
};

export const isServer = typeof window === 'undefined';
export const isUseTestnet = env.USE_TESTNET === 'true';
export const network = isUseTestnet ? 'testnet' : ('mainnet' as Network);

export const TON_API_URL = isUseTestnet ? 'https://testnet.toncenter.com/api/v2' : 'https://toncenter.com/api/v2';
export const TON_VIEWER_URL = isUseTestnet ? 'https://testnet.tonviewer.com/' : 'https://tonviewer.com/';

export const TESTGIVER_TON_BOT_URL = 'https://t.me/testgiver_ton_bot';
export const TONKEEPER_DOC_URL = 'https://tonkeeper.helpscoutdocs.com/article/100-how-switch-to-the-testnet';
