import { type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';
import { Loader2 } from 'lucide-react';


import telegram from './svg/telegram.svg';
import twitter from './svg/twitter.svg';

const IconList = {
  twitter,
  telegram,
  spinner: Loader2,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
