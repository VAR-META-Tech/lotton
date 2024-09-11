import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FCC } from '@/types';
import { FC, HTMLAttributes } from 'react';

interface ChangeAmountButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isDisabled: boolean;
  icon?: FC<HTMLAttributes<SVGElement>>;
}

const ChangeAmountButton: FCC<ChangeAmountButtonProps> = ({
  isDisabled,
  icon: Icon,
  children,
  className,
  ...props
}) => (
  <Button
    disabled={isDisabled}
    type="button"
    className={cn(
      'rounded-[0.3125rem] w-[2.1875rem] h-[1.6875rem] flex justify-center items-center',
      { '!bg-gray-color': isDisabled },
      className
    )}
    {...props}
  >
    {Icon && <Icon className={cn('text-white', { 'opacity-50': isDisabled })} />}
    {children}
  </Button>
);

export default ChangeAmountButton;
