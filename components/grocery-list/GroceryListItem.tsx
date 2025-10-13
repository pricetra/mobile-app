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
    <View className="flex flex-row items-center gap-6 border-b-[1px] border-gray-50 px-5 py-4">
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
        className="flex items-start justify-center rounded-full border-[1px] border-gray-300 p-1">
        <Feather name="check" size={15} color="#888" style={{ opacity: completed ? 1 : 0 }} />
      </Pressable>

      <View className="flex flex-1 flex-row flex-wrap items-center justify-start gap-4">
        {item.product && item.productId && (
          <>
            <Image
              src={createCloudinaryUrl(item.product.code, 200)}
              className="rounded-xl"
              style={{ width: 40, height: 40 }}
            />

            <Text className={cn('flex-1', completed ? 'line-through' : '')} numberOfLines={1}>
              {item.product.name}
            </Text>
          </>
        )}
        {item.category && (
          <Text className={cn('flex-1', completed ? 'line-through' : '')} numberOfLines={1}>
            {item.category}
          </Text>
        )}
      </View>
    </View>
  );
}
