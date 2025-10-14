import { View, Text } from 'react-native';

import { cn } from '@/lib/utils';

export type ProductMetadataBadgeType = {
  type?: 'weight' | 'quantity';
  size?: 'sm' | 'md';
  text: string;
};

export default function ProductMetadataBadge({
  text,
  type,
  size = 'md',
}: ProductMetadataBadgeType) {
  return (
    <View
      className={cn(
        'rounded-full bg-gray-100 px-2 py-1',
        type === 'weight' ? 'bg-green-100' : '',
        type === 'quantity' ? 'bg-blue-100' : '',
        size === 'md' ? 'px-3 py-1' : '',
        size === 'sm' ? 'px-2 py-1' : ''
      )}>
      <Text
        className={cn(
          'color-black',
          size === 'md' ? 'text-sm' : '',
          size === 'sm' ? 'text-[9px]' : ''
        )}>
        {text}
      </Text>
    </View>
  );
}
