import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Label } from './Label';

export type TextareaProps = ComponentPropsWithoutRef<typeof TextInput> & {
  label?: string;
};

const Textarea = forwardRef<ElementRef<typeof TextInput>, TextareaProps>(
  ({ className, multiline = true, numberOfLines = 4, placeholderClassName, ...props }, ref) => {
    return (
      <View>
        {props.label && <Label className="mb-1">{props.label}</Label>}

        <TextInput
          ref={ref}
          className={cn(
            'native:text-lg native:leading-[1.25] min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-muted-foreground web:flex web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 lg:text-sm',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
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

export { Textarea };
