import * as React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

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
            'flex items-center justify-center rounded-xl border-[1px] border-gray-200 bg-white px-5 py-4 text-lg color-black  placeholder:color-gray-600 focus:border-gray-300',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          style={{
            lineHeight: 19,
          }}
          {...props}
        />
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
