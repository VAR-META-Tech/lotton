import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';

import { network } from '@/lib/const';

import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: network }),
      })
  );
}
