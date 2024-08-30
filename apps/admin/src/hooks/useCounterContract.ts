import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, beginCell, OpenedContract } from '@ton/core';
import { contractAddress } from '@/lib/const';
import { CreatePoolWithoutType, storeCreatePool } from '@/lib/utils';

export interface ICreatePool {
  ticketPrice: number;
  initialRounds: number;
  sequence: number;
  startTime: number;
  endTime: number;
  active: boolean;
}

export function useCounterContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse(contractAddress)
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  const provider = useAsyncInitialize(async () => {
    if (!client) return;

    return client.provider(Address.parse(contractAddress));
  }, [client])

  return {
    address: counterContract?.address.toString(),
    getLastTx: () => {
      return client?.getTransactions(Address.parse(contractAddress), {
        limit: 1,
      });
    },
    createPool: (data: CreatePoolWithoutType) => {
      if (!provider) return;

      const messageBody = beginCell()
        .store(
          storeCreatePool({
            $$type: 'CreatePool',
            jettonWallet: data.jettonWallet,
            ticketPrice: data.ticketPrice,
            initialRounds: data.initialRounds,
            startTime: data.startTime,
            endTime: data.endTime,
            sequence: data.sequence,
            active: data.active,
          }),
        )
        .endCell();

      return counterContract?.createPool(provider, sender, messageBody);}
  }
}
