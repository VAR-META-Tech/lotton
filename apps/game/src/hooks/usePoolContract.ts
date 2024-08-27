import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, beginCell, OpenedContract } from '@ton/core';
import Pool from '@/contracts/pool';
import { useEffect, useMemo, useState } from 'react';
import { env } from '@/lib/const';
import { useTonWallet } from '@tonconnect/ui-react';
import { WalletContractV4 } from '@ton/ton';

interface IBuyTicket {
  poolId: number;
  roundId: number;
  quantity: number;
}

export function usePoolContract() {
  const client = useTonClient();
  const wallet = useTonWallet();
  const { sender } = useTonConnect();
  const [currentRound, setCurrentRound] = useState<null | number>();

  const provider = useMemo(() => {
    if (!client) return;

    return client.provider(Address.parse(env.CONTRACT_ADDRESS));
  }, [client])

  const poolContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Pool(
      Address.parse(env.CONTRACT_ADDRESS)
    );

    return client.open(contract) as OpenedContract<Pool>;
  }, [client]);

  useEffect(() => {
    async function getCurrentRound() {
      if (!poolContract) return;
      setCurrentRound(null);
      const val = await poolContract.getCurrentRound();
      setCurrentRound(Number(val));
    }

    getCurrentRound();
  }, [poolContract]);

  return {
    address: poolContract?.address.toString(),
    currentRound,
    buyTicket: async (data: IBuyTicket) => {
      if (!provider || !wallet) return;

      // TODO: CHECK STATUS TRANSACTION
      // const publicKey = wallet?.account?.publicKey;

      // if (!publicKey) {
      //   throw new Error('Public key is not available');
      // }

      // const walletContractV4 = WalletContractV4.create({
      //   publicKey: Buffer.from(publicKey, 'hex'),
      //   workchain: 0
      // });

      // const walletContract = client?.open(walletContractV4);
      // const seqno = await walletContract?.getSeqno();
      // console.log("seqno:", seqno);

      const messageBody = beginCell()
        .storeUint(3748203161, 32)
        .storeInt(data?.poolId, 257) //poolId
        .storeInt(data?.roundId, 257) //roundId
        .storeInt(data?.quantity, 257) //quantity
        .endCell();

      return await poolContract?.buyTicket(provider, sender, messageBody);
    },
  };
}
