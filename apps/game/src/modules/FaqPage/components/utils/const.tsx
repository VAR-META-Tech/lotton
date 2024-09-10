import { VStack } from '@/components/ui/Utilities';

export const FAQ_VALUE = {
  TICKET_VALUE_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  UNCLAIMED_PRIZE: `What happens if I didn't claim my prize?`,
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: `My ticket matches several numbers but I can't claim a prize`,
  SWAP_TICKETS: 'Can I swap my tickets back to VYFI?',
  CLAIM_PRIZE_MANUALLY: 'Do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const FAQ_LABEL = {
  TICKET_VALUE_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  UNCLAIMED_PRIZE: `What happens if I didn't claim my prize?`,
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: `My ticket matches several numbers but I can't claim a prize`,
  SWAP_TICKETS: 'Can I swap my tickets back to VYFI?',
  CLAIM_PRIZE_MANUALLY: 'Do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const FAQ_DATA = [
  {
    title: FAQ_LABEL.TICKET_VALUE_SOURCE,
    value: FAQ_VALUE.TICKET_VALUE_SOURCE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          To obtain the ticket values we take the transaction hash from the transaction the user purchased the tickets
          with. Starting from the right and working our way to the left we get the ticket values depending on how many
          tickets were purchased in that transaction.
        </span>

        <div className="space-y-2">
          <span className="text-justify">Here is an example:</span>
          <ul className="list-disc pl-4">
            <li>
              Ticket Price: 10 NOT User sent 40 NOT and produced this transaction hash:
              6771975b6b2671850bcd8de6bd48915b674d3d5990a5fc4fbf770298cb25d87a
            </li>
            <li>Ticket 1: d87a Ticket 2: cb25 Ticket 3: 0298 Ticket 4: bf77</li>
          </ul>
        </div>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.WINNING_TICKET_SOURCE,
    value: FAQ_VALUE.WINNING_TICKET_SOURCE,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          Every lottery round has a draw date. At that predefined draw date we take the tast tx of last block of
          epochfirst block produced on that date and get the winning ticket from the hash of that block.
        </span>

        <VStack spacing={8}>
          <span className="text-justify">For example, if that block was:</span>
          <span className="text-justify">6771975b6b2671850bcd8de6bd48915b674d3d5990a5fc4fbf770298cb25d87a</span>
          <span className="text-justify">the winning ticket would be: d87a</span>
        </VStack>
      </VStack>
    ),
  },
  {
    title: FAQ_LABEL.NO_WINNERS,
    value: FAQ_VALUE.NO_WINNERS,
    content: (
      <VStack spacing={20} className="text-xs text-gray-color">
        <span className="text-justify">
          If you don't claim your prize within the next two rounds, the prize will be distributed to all players in this
          round. Please note that players will need to pay a gas fee to claim their share.
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
          If the NOT or TON in the prize pool isn't won, it doesn't go to waste! Unclaimed NOT/TON rolls over to the
          next Lottery round.
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
          Tickets are only eligible to win if the numbers/letters match from left to right.
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
          No, once purchased you will not be able to convert your tickets back into TON/NOT.
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
