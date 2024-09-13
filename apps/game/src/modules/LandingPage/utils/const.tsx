import { Icons } from '@/assets/icons';
import { TESTGIVER_TON_BOT_URL, TONKEEPER_DOC_URL } from '@/lib/const';
import Link from 'next/link';

export const ACCORDION_VALUE = {
  HOW_TO_PLAY: 'howToPlay',
  HOW_TO_WIN: 'howToWin',
  PRIZE_POOL: 'prizePool',
};

export const MAX_TICKET = 16;
export const MIN_TICKET = 1;

export const MIN_ROUND = 1;

export const slideAnimation = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.15 },
};

export const HOW_TO_PLAY_ITEMS = [
  {
    icon: <Icons.wallet className="stroke-primary" />,
    title: 'Receive TON testnet',
    description: (
      <ul className="text-gray-color text-xs">
        <li className="text-justify">
          1. Set up Tonkeeper wallet and add a testnet wallet by following the instructions:{' '}
          <Link href={TONKEEPER_DOC_URL} target="_blank" className="underline">
            link
          </Link>
        </li>
        <li className="text-justify">
          2. Access{' '}
          <Link href={TESTGIVER_TON_BOT_URL} target="_blank" className="underline">
            link
          </Link>{' '}
          and follow the instructions to receive TON Testnet.
        </li>
      </ul>
    ),
  },
  {
    icon: <Icons.ticket className="text-primary w-[1.375rem] h-[1.125rem]" />,
    title: 'Get your Tickets',
    description: 'Price and limit (per transaction) are set each round. Ticket sales close an hour before draw.',
  },
  {
    icon: <Icons.calendar className="stroke-primary" />,
    title: 'Watch the Time',
    description: 'Then the count down ends, the next block will be pulled and drawing will commence.',
  },
  {
    icon: <Icons.ticketStar className="stroke-primary" />,
    title: 'Become a Winner',
    description: (
      <ul className="list-disc pl-4 text-gray-color text-xs">
        <li>Once the round is over, come back to the page and check to see if you’ve won!</li>
        <li>If your ticket values match the winning ticket in sequential order, then you are a winner! </li>
      </ul>
    ),
  },
];
