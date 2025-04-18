import * as React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import Label from '@/components/ui/Label';
import { cn } from '@/lib/utils';

export type InputProps = TextInputProps & {
  label?: string;
};

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <View className={className}>
        {props.label && <Label className="mb-1">{props.label}</Label>}

        <TextInput
          ref={ref}
          className={cn(
            'native:h-12 native:text-lg native:leading-[1.25] h-10 rounded-md border border-gray-300 bg-white px-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm',
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

export default Input;
export { Input };
