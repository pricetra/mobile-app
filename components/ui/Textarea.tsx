import * as React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import Label from '@/components/ui/Label';
import { cn } from '@/lib/utils';

export type TextareaProps = TextInputProps & {
  label?: string;
};

const Textarea = React.forwardRef<React.ElementRef<typeof TextInput>, TextareaProps>(
  ({ className, multiline = true, numberOfLines = 4, placeholderClassName, ...props }, ref) => {
    return (
      <View>
        {props.label && <Label className="mb-1">{props.label}</Label>}

        <TextInput
          ref={ref}
          className={cn(
            'flex min-h-[80px] items-center justify-center rounded-xl border-[1px] border-gray-200 bg-white px-5 py-4 text-lg  color-black placeholder:color-gray-600 focus:border-gray-300',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          style={{
            lineHeight: 19,
          }}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          {...props}
        />
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
export { Textarea };
