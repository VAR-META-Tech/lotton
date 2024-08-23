import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, suffix, prefix, ...props }, ref) => {
  return (
    <div className="relative">
      {prefix && <label className={cn('absolute left-[10px] top-1/2 -translate-y-1/2')}>{prefix}</label>}

      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-sm bg-navigate-tab px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'pl-10': prefix,
            'pr-10': suffix,
          },
          className
        )}
        ref={ref}
        {...props}
      />
      {suffix && <label className={cn('absolute right-[10px] top-1/2 -translate-y-1/2 z-10')}>{suffix}</label>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
