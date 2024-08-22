import React from 'react';

import { VStack } from '@/components/ui/Utilities';

const BuyTicketNote = () => {
  return (
    <VStack spacing={32}>
      <span className="text-center text-xs italic text-white">Limit of 16 tickets per transaction</span>
      <span className="w-full h-[1px] bg-gray-color" />
      <span className="text-center text-xs italic text-white">
        It may take a minute or so for the transaction to go through. The loading indicator in the button will stop
        spinning and your new tickets will be viewable!
      </span>
    </VStack>
  );
};

export default BuyTicketNote;
