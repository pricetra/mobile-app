import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { Platform, View } from 'react-native';

import Label from '@/components/ui/Label';
import { Check } from '@/lib/icons/Check';
import { cn } from '@/lib/utils';

export type CheckboxProps = CheckboxPrimitive.RootProps & {
  label?: string;
  bold?: boolean;
};

const Checkbox = React.forwardRef<CheckboxPrimitive.RootRef, CheckboxProps>(
  ({ className, bold = true, ...props }, ref) => {
    return (
      <View className="flex flex-row items-center gap-2">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            'web:peer native:h-[20] native:w-[20] native:rounded h-4 w-4 shrink-0 rounded-sm border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
            className
          )}
          {...props}>
          <CheckboxPrimitive.Indicator className={cn('h-full w-full items-center justify-center')}>
            <Check
              size={12}
              strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
              className="text-primary-foreground"
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {props.label && (
          <Label
            onPress={() => props.onCheckedChange(!props.checked)}
            className={cn(bold ? 'font-bold' : 'font-normal')}>
            {props.label}
          </Label>
        )}
      </View>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
