import { type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Minus, Plus, X } from 'lucide-react';

import ball from './svg/ball.svg';
import calendar from './svg/calendar.svg';
import document from './svg/document.svg';
import home from './svg/home.svg';
import telegram from './svg/telegram.svg';
import ticketStar from './svg/ticket-star.svg';
import ticket from './svg/ticket.svg';
import twitter from './svg/twitter.svg';
import wallet from './svg/wallet.svg';

const IconList = {
  twitter,
  telegram,
  document,
  home,
  ticketStar,
  wallet,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  chevronDown: ChevronDown,
  calendar,
  ticket,
  ball,
  x: X,
  minus: Minus,
  plus: Plus,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
