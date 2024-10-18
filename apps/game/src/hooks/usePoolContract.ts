import Pool from '@/contracts/pool';
import { roundNumber } from '@/lib/common';
import { env } from '@/lib/const';
import { useQuery } from '@tanstack/react-query';
import { Address, beginCell, OpenedContract, toNano } from '@ton/core';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useMemo } from 'react';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';

interface IBuyTicket {
  poolId: number;
  roundId: number;
  quantity: number;
  ticketPrice: number;
}

interface IClaimPrize {
  poolId: number;
  roundId: number;
  amount: number;
  receiver: string;
  signature: string;
}

export function usePoolContract() {
  const client = useTonClient();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const provider = useMemo(() => {
    if (!client) return;

    return client.provider(Address.parse(env.CONTRACT_ADDRESS));
  }, [client]);

  const poolContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Pool(Address.parse(env.CONTRACT_ADDRESS));

    return client.open(contract) as OpenedContract<Pool>;
  }, [client]);

  const { data: claimFee = 0 } = useQuery({
    queryKey: ['claimFee'],
    queryFn: async () => {
      if (!poolContract) return;
      const fee = await poolContract.getClaimFee();
      return fee;
    },
    enabled: !!poolContract,
  });

  const buyTicket = async (data: IBuyTicket) => {
    if (!provider || !wallet) return;

    const messageBody = beginCell()
      .storeUint(3748203161, 32)
      .storeInt(data?.poolId, 257) //poolId
      .storeInt(data?.roundId, 257) //roundId
      .storeInt(data?.quantity, 257) //quantity
      .endCell();

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: env.CONTRACT_ADDRESS,
          amount: toNano(roundNumber(Number(data?.quantity) * Number(data?.ticketPrice) + 0.5)).toString(),
          payload: messageBody.toBoc().toString('base64'), // payload with comment in body
        },
      ],
    };
    return await tonConnectUI.sendTransaction(tx);
  };

  const claimPrize = async (data: IClaimPrize) => {
    try {
      if (!provider || !wallet) return;
      const encode = Buffer.from(data.signature, 'base64');
      const signatureCell = beginCell().storeBuffer(encode).endCell();

      const messageBody = beginCell()
        .storeUint(1449747896, 32)
        .storeInt(data.poolId, 257) //poolId
        .storeInt(data.roundId, 257) //roundId
        .storeCoins(data.amount) //amount
        .storeAddress(Address.parse(data.receiver)) //receiver
        .storeRef(signatureCell) //signature
        .endCell();

      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: env.CONTRACT_ADDRESS,
            amount: toNano('0.05').toString(),
            payload: messageBody.toBoc().toString('base64'), // payload with comment in body
          },
        ],
      };

      return await tonConnectUI.sendTransaction(tx);
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const getLastTx = () => {
    return client?.getTransactions(Address.parse(wallet?.account?.address || ''), {
      limit: 1,
    });
  };

  return {
    address: poolContract?.address.toString(),
    claimFee: Number(claimFee) / 1000,
    getLastTx,
    buyTicket,
    claimPrize,
  };
}
