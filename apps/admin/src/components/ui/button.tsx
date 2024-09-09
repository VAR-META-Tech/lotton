import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icons } from "@/assets/icons"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-base text-white hover:scale-105 transition-all rounded-[.3125rem]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const LoadingIcon = ({ className, size = '1rem' }: { className?: string; size?: string }) => {
  return <Icons.spinner size={size} className={cn('animate-spin ', className)} />;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, type = 'button', size, fullWidth, asChild = false, loading, children, ...props },
    ref
  ) => {
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
          <>
            {children}
            {loading && <LoadingIcon className="ml-4" />}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button"

export { Button, buttonVariants }
