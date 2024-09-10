import { HStack, VStack } from '@/components/ui/Utilities';
import { prettyNumber } from '@/lib/common';
import Image from 'next/image';
import ChangeAmountButton from './ChangeAmountButton';
import { Icons } from '@/assets/icons';
import ErrorMessage from '@/components/ErrorMessage';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { FC } from 'react';
import { BuyTicketType } from '@/modules/LandingPage/types/schema';
import { MAX_TICKET } from '@/modules/LandingPage/utils/const';

interface Props {
  ticketPrice: number;
  tokenSymbol: string;
  amount: number;
  isMin: boolean;
  isMax: boolean;
  // eslint-disable-next-line no-unused-vars
  onAmountChange: (isAdd: boolean) => void;
  errors: FieldErrors<{
    amount: number;
    balance: number;
  }>;
}

const TicketPriceSection: FC<Props> = ({ ticketPrice, tokenSymbol, amount, isMin, isMax, onAmountChange, errors }) => {
  const { setValue } = useFormContext<BuyTicketType>();

  const handleChangeMaxAmount = () => {
    setValue('amount', MAX_TICKET);
  };

  return (
    <VStack spacing={20} className="text-white border-b-[1px] border-b-gray-color pb-6">
      <VStack spacing={2}>
        <HStack pos="apart">
          <span className="text-base font-medium">Amount</span>
          <HStack spacing={8}>
            <ChangeAmountButton isDisabled={isMin} onClick={() => onAmountChange(false)} icon={Icons.minus} />
            <span className="text-2xl font-semibold w-8 text-center">{amount}</span>
            <ChangeAmountButton isDisabled={isMax} onClick={() => onAmountChange(true)} icon={Icons.plus} />

            <ChangeAmountButton isDisabled={false} className="w-16" onClick={handleChangeMaxAmount}>
              <span className="text-primary">MAX</span>
            </ChangeAmountButton>
          </HStack>
        </HStack>
        <ErrorMessage message={errors?.amount?.message} />
      </VStack>

      <HStack pos="apart">
        <span className="text-base font-medium">Ticket Price:</span>
        <HStack spacing={8}>
          <Image src="/images/tokens/ton_symbol.webp" width={24} height={24} alt="ton" />
          <span className="text-2xl">{`${prettyNumber(ticketPrice)} ${tokenSymbol}`}</span>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default TicketPriceSection;
