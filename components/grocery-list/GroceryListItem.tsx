import { useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import {
  GroceryListItem as GqlGroceryListItem,
  MarkGroceryListItemDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { cn } from '@/lib/utils';

export type GroceryListItemProps = {
  item: GqlGroceryListItem;
};

export default function GroceryListItem({ item }: GroceryListItemProps) {
  const [completed, setCompleted] = useState(item.completed);
  const [markGroceryListItem] = useMutation(MarkGroceryListItemDocument, {});

  return (
    <View className="flex flex-row items-center border-b-[1px] border-gray-50 py-2">
      <Pressable
        onPress={() => {
          setCompleted((prev) => {
            const completed = !prev;
            markGroceryListItem({
              variables: {
                groceryListItemId: item.id,
                completed,
              },
            });
            return completed;
          });
        }}
        className="px-5 py-2">
        <View className="flex items-start justify-center rounded-full border-[1px] border-gray-300 p-1">
          <Feather name="check" size={15} color="#888" style={{ opacity: completed ? 1 : 0 }} />
        </View>
      </Pressable>

      <View className="flex flex-1 flex-row flex-wrap gap-3 py-3">
        {item.product && item.productId && (
          <Image
            src={createCloudinaryUrl(item.product.code, 200)}
            className="rounded-xl"
            style={{ width: 40, height: 40 }}
          />
        )}
        <View className="flex flex-1 flex-col items-start justify-center gap-1 pr-5">
          <Text className={cn('flex-1', completed ? 'line-through' : '')} numberOfLines={2}>
            {item.product && item.productId ? item.product.name : item.category}
          </Text>

          <Text className="text-xs color-gray-500">qty: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );
}

export function GroceryListItemLoading() {
  return <></>;
}
