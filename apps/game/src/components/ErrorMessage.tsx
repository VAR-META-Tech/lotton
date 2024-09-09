import { cn } from '@/lib/utils';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  message: string | React.ReactNode | undefined;
}

const ErrorMessage = React.forwardRef<HTMLSpanElement, Props>(({ message, className, ...props }, ref) => {
  if (!message) return null;

  return (
    <span className={cn('text-red-500 text-right text-xs', className)} ref={ref} {...props}>
      {message}
    </span>
  );
});

export default ErrorMessage;
