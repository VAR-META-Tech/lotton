import { VStack } from '@/components/ui/Utilities';

export const FAQ_VALUE = {
  TICKET_VALUE_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  UNCLAIMED_PRIZE: `What happens if I didn't claim my prize?`,
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: `My ticket matches several numbers but I can't claim a prize`,
  SWAP_TICKETS: 'Can I swap my tickets back to TON/NOT?',
  CLAIM_PRIZE_MANUALLY: 'If I win, do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const FAQ_LABEL = {
  TICKET_VALUE_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  UNCLAIMED_PRIZE: `What happens if I didn't claim my prize?`,
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: `My ticket matches several numbers but I can't claim a prize`,
  SWAP_TICKETS: 'Can I swap my tickets back to TON/NOT?',
  CLAIM_PRIZE_MANUALLY: 'If I win, do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const FAQ_DATA = [
  {
    title: FAQ_LABEL.TICKET_VALUE_SOURCE,
    value: FAQ_VALUE.TICKET_VALUE_SOURCE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          Your ticket consists of 4 characters, a combination of numbers and uppercase letters. After you complete the
          payment, the system will automatically generate these characters randomly on the blockchain (on-chain) to form
          a ticket.
        </span>
        <span className="text-justify">
          This ticket is then stored directly on the blockchain to ensure transparency and safety.
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.WINNING_TICKET_SOURCE,
    value: FAQ_VALUE.WINNING_TICKET_SOURCE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          After the ticket purchase period ends, the system will randomly generate a winning ticket directly on the TON
          blockchain. This process ensures fairness and transparency in determining winning tickets.
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.UNCLAIMED_PRIZE,
    value: FAQ_VALUE.UNCLAIMED_PRIZE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          The system will automatically calculate the prize amount for each winner. Winners can claim their rewards at
          any time they want. However, it should be noted that when receiving rewards, the system will deduct a 10% fee
          from the total prize value.
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.NO_WINNERS,
    value: FAQ_VALUE.NO_WINNERS,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          If the NOT or TON in the prize pool isn't won, it doesn't go to waste! Unclaimed NOT/TON rolls over to the
          next Lottery round.
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.MULTIPLE_MATCHES_NO_PRIZE,
    value: FAQ_VALUE.MULTIPLE_MATCHES_NO_PRIZE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          Tickets are only eligible to win if the numbers/letters match from left to right.
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.SWAP_TICKETS,
    value: FAQ_VALUE.SWAP_TICKETS,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          No, once purchased you will not be able to convert your tickets back into TON/NOT.{' '}
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.CLAIM_PRIZE_MANUALLY,
    value: FAQ_VALUE.CLAIM_PRIZE_MANUALLY,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          Yes, you will need to click the "Check Now" button under the "Are you a winner?" section of the Check tab. You
          can also view your tickets from previous rounds in the section below "Finished Rounds".
        </span>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.TICKET_LIMIT_PER_TRANSACTION,
    value: FAQ_VALUE.TICKET_LIMIT_PER_TRANSACTION,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          You can only buy a maximum of 16 tickets in one purchase, but you can make multiple purchases. There's nothing
          to stop you buying more tickets after your first 16.
        </span>
      </VStack>
    ),
  },
];
