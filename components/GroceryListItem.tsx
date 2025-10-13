import { Feather } from '@expo/vector-icons';
import { Pressable, View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { GroceryListItem as GqlGroceryListItem } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { cn } from '@/lib/utils';

export type GroceryListItemProps = {
  item: GqlGroceryListItem;
};

export default function GroceryListItem({ item }: GroceryListItemProps) {
  return (
    <View className="flex flex-row items-center gap-5 border-b-[1px] border-gray-50 px-5 py-3">
      <Pressable
        onPress={() => {}}
        className="flex items-start justify-center rounded-full border-2 border-gray-200 p-1">
        <Feather name="check" size={15} color="#999" style={{ opacity: item.completed ? 1 : 0 }} />
      </Pressable>

      <View className="flex flex-1 flex-row flex-wrap items-center justify-start gap-4">
        {item.product && item.productId && (
          <>
            <Image
              src={createCloudinaryUrl(item.product.code, 200)}
              className="rounded-xl"
              style={{ width: 40, height: 40 }}
            />

            <Text className={cn('flex-1', item.completed ? 'line-through' : '')} numberOfLines={1}>
              {item.product.name}
            </Text>
          </>
        )}
        {item.category && (
          <Text className={cn('flex-1', item.completed ? 'line-through' : '')} numberOfLines={1}>
            {item.category}
          </Text>
        )}
      </View>
    </View>
  );
}
