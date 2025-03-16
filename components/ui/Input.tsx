import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Label } from './Label';

export type InputProps = ComponentPropsWithoutRef<typeof TextInput> & {
  label?: string;
};

const Input = forwardRef<ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <View className="flex-1">
        {props.label && <Label className="mb-1">{props.label}</Label>}

        <TextInput
          ref={ref}
          className={cn(
            'native:h-12 native:text-lg native:leading-[1.25] h-10 text-nowrap rounded-md border border-gray-300 bg-white px-3 text-base file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 lg:text-sm',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          {...props}
        />
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
