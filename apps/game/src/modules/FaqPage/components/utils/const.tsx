import { VStack } from '@/components/ui/Utilities';

export const FAQ_VALUE = {
  TICKET_VALUES_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: "My ticket matches several numbers but I can't claim a prize",
  SWAP_TICKETS: 'Can I swap my tickets back to TON?',
  CLAIM_PRIZE_MANUALLY: 'If I win, do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const FAQ_LABEL = {
  TICKET_VALUES_SOURCE: 'Where do my ticket values come from?',
  WINNING_TICKET_SOURCE: 'Where does the winning ticket value come from?',
  NO_WINNERS: 'What if there are no winners?',
  MULTIPLE_MATCHES_NO_PRIZE: "My ticket matches several numbers but I can't claim a prize",
  SWAP_TICKETS: 'Can I swap my tickets back to TON?',
  CLAIM_PRIZE_MANUALLY: 'If I win, do I need to manually claim the prize?',
  TICKET_LIMIT_PER_TRANSACTION: 'Why can I only buy 16 tickets per transaction?',
};

export const defaultContent = () => {
  return (
    <VStack spacing={20} className="text-xs text-gray-color container">
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
  );
};

export const FAQ_DATA = [
  {
    title: FAQ_LABEL.TICKET_VALUES_SOURCE,
    value: FAQ_VALUE.TICKET_VALUES_SOURCE,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.WINNING_TICKET_SOURCE,
    value: FAQ_VALUE.WINNING_TICKET_SOURCE,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.NO_WINNERS,
    value: FAQ_VALUE.NO_WINNERS,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.MULTIPLE_MATCHES_NO_PRIZE,
    value: FAQ_VALUE.MULTIPLE_MATCHES_NO_PRIZE,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.SWAP_TICKETS,
    value: FAQ_VALUE.SWAP_TICKETS,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.CLAIM_PRIZE_MANUALLY,
    value: FAQ_VALUE.CLAIM_PRIZE_MANUALLY,
    content: defaultContent(),
  },
  {
    title: FAQ_LABEL.TICKET_LIMIT_PER_TRANSACTION,
    value: FAQ_VALUE.TICKET_LIMIT_PER_TRANSACTION,
    content: defaultContent(),
  },
];
