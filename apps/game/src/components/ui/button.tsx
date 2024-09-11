import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';
import { HStack } from './Utilities';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-40',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground text-white',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: '',
        link: 'text-primary underline-offset-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, type = 'button', size, fullWidth, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        disabled={props.disabled || loading}
        className={cn(fullWidth && 'w-full', buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <HStack spacing={4}>
            {loading && <Spinner />}

            {children}
          </HStack>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
