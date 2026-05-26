import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-[#94A3B8] focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default: 'bg-[#0F172A] text-white hover:bg-[#1E293B]',
        destructive: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
        outline: 'border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]',
        secondary: 'bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F8FAFC]',
        ghost: 'hover:bg-[#F1F5F9] text-[#334155]',
        link: 'text-[#0F172A] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-[8px] gap-1.5 px-3 has-[>svg]:px-2.5 text-[13px]',
        lg: 'h-11 rounded-[10px] px-5 has-[>svg]:px-4 text-sm font-medium',
        icon: 'size-10 rounded-[10px]',
        'icon-sm': 'size-8 rounded-[8px]',
        'icon-lg': 'size-11 rounded-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export { buttonVariants };

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
