import { TonClient } from '@ton/ton';

import { env } from '@/lib/const';

import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: env.END_POINT_TON_CLIENT,
      })
  );
}
