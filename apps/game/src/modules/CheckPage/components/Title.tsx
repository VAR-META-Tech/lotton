import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const Title = ({ title, className, ...props }: Props) => {
  return (
    <div className={cn('text-center w-full text-2xl', className)} {...props}>
      {title}
    </div>
  );
};
