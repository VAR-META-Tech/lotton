import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, beginCell, OpenedContract } from '@ton/core';
import Pool from '@/contracts/pool';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { env } from '@/lib/const';
import { useTonWallet } from '@tonconnect/ui-react';
import { roundNumber } from '@/lib/common';

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
  const [claimFee, setClaimFee] = useState(0);
  const client = useTonClient();
  const wallet = useTonWallet();
  const { sender } = useTonConnect();

  const provider = useMemo(() => {
    if (!client) return;

    return client.provider(Address.parse(env.CONTRACT_ADDRESS));
  }, [client]);

  const poolContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Pool(Address.parse(env.CONTRACT_ADDRESS));

    return client.open(contract) as OpenedContract<Pool>;
  }, [client]);

  const buyTicket = async (data: IBuyTicket) => {
    try {
      if (!provider || !wallet) return;

      const messageBody = beginCell()
        .storeUint(3748203161, 32)
        .storeInt(data?.poolId, 257) //poolId
        .storeInt(data?.roundId, 257) //roundId
        .storeInt(data?.quantity, 257) //quantity
        .endCell();

      return await poolContract?.buyTicket({
        provider,
        via: sender,
        messageBody,
        value: roundNumber(Number(data?.quantity) * Number(data?.ticketPrice)),
      });
    } catch (error) {
      throw new Error(error as string);
    }
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

      return await poolContract?.claimPrize(provider, sender, messageBody);
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const getLastTx = () => {
    return client?.getTransactions(Address.parse(wallet?.account?.address || ''), {
      limit: 1,
    });
  };

  const getClaimFee = useCallback(async () => {
    if (!poolContract) return;

    setClaimFee(0);

    const fee = await poolContract.getClaimFee();

    setClaimFee(Number(fee));
  }, [poolContract]);

  useEffect(() => {
    getClaimFee();
  }, [getClaimFee]);

  return {
    address: poolContract?.address.toString(),
    claimFee: Number(claimFee) / 1000,
    getLastTx,
    buyTicket,
    claimPrize,
  };
}
