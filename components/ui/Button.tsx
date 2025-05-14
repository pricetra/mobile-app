import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import Text, { TextClassContext } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
        outline:
          'border border-secondary bg-transparent web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        outlineLight:
          'border border-gray-100 bg-transparent active:bg-gray-500 active:border-gray-500',
        secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 native:h-12 native:px-7 native:py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 native:h-14',
        icon: 'h-10 w-10 !px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-secondary group-active:text-accent-foreground',
        outlineLight: 'text-gray-700 group-active:text-white',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    children?: ReactNode;
  };

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, disabled, loading, children, ...props }, ref) => {
    return (
      <TextClassContext.Provider
        value={buttonTextVariants({ variant, size, className: 'web:pointer-events-none' })}>
        <Pressable
          className={cn(
            (loading || disabled) && 'opacity-50 web:pointer-events-none',
            buttonVariants({ variant, size }),
            className
          )}
          ref={ref}
          role="button"
          disabled={loading || disabled}
          {...props}>
          {loading ? (
            <View className="size-5 animate-ping rounded-full bg-white opacity-75" />
          ) : (
            <Text className="font-bold">{children}</Text>
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export default Button;
export { buttonTextVariants, buttonVariants };
export type { ButtonProps };
