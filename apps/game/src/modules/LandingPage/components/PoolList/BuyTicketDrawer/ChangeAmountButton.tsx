import { cn } from '@/lib/utils';
import { FCC } from '@/types';
import { FC, HTMLAttributes } from 'react';

interface ChangeAmountButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isDisabled: boolean;
  icon: FC<HTMLAttributes<SVGElement>>;
}

const ChangeAmountButton: FCC<ChangeAmountButtonProps> = ({ isDisabled, icon: Icon, ...props }) => (
  <button
    disabled={isDisabled}
    type="button"
    className={cn(
      'bg-white border border-primary rounded-[0.3125rem] w-[2.1875rem] h-[1.6875rem] flex justify-center items-center',
      { 'border-gray-color': isDisabled }
    )}
    {...props}
  >
    <Icon className={cn('text-primary', { 'text-gray-color': isDisabled })} />
  </button>
);

export default ChangeAmountButton;
