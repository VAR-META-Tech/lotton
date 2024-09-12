import ErrorMessage from '@/components/ErrorMessage';
import { HStack, VStack } from '@/components/ui/Utilities';
import { prettyNumber, roundNumber } from '@/lib/common';
import Image from 'next/image';
import { FC } from 'react';
import { FieldErrors } from 'react-hook-form';

interface Props {
  totalAmount: number;
  tokenSymbol: string;
  balance: number;
  price: number;
  errors: FieldErrors<{
    amount: number;
    balance: number;
  }>;
}

const PaymentSummary: FC<Props> = ({ totalAmount, tokenSymbol, balance, price, errors }) => (
  <VStack spacing={0}>
    <HStack pos="apart" align="center" className="text-white">
      <span className="text-base font-bold">You pay:</span>
      <HStack spacing={8} align="center">
        <span className="text-2xl">{prettyNumber(roundNumber(totalAmount))}</span>
        <Image src="/images/tokens/ton_symbol.webp" width={24} height={24} alt="ton" />
      </HStack>
    </HStack>
    <HStack pos="apart">
      <VStack spacing={0}>
        <span className="text-xs text-white">{`${tokenSymbol} balance: ${prettyNumber(roundNumber(balance))} ${tokenSymbol}`}</span>
        <ErrorMessage message={errors?.balance?.message} className="text-left" />
      </VStack>
      <span className="text-gray-color text-sm">{`~ ${prettyNumber(roundNumber(totalAmount * price))} USD`}</span>
    </HStack>
  </VStack>
);

export default PaymentSummary;
