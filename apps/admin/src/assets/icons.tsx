import { type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';
import { Loader2 } from 'lucide-react';


import telegram from './svg/telegram.svg';
import twitter from './svg/twitter.svg';
import ticket from './svg/ticket.svg';
import ticket2 from './svg/ticket2.svg';
import text from './svg/text.svg';
import userGroup from './svg/user-group.svg';

const IconList = {
  twitter,
  telegram,
  ticket,
  spinner: Loader2,
  text,
  ticket2,
  userGroup,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
