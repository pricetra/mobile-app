import { useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import ProductMetadataBadge from '../ProductMetadataBadge';
import { Skeleton } from '../ui/Skeleton';

import Image from '@/components/ui/Image';
import {
  CountGroceryListItemsDocument,
  DefaultGroceryListItemsDocument,
  DeleteGroceryListItemDocument,
  GroceryListItem as GqlGroceryListItem,
  GroceryListItemsDocument,
  MarkGroceryListItemDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { cn } from '@/lib/utils';

export type GroceryListItemProps = {
  item: GqlGroceryListItem;
};

export default function GroceryListItem({ item }: GroceryListItemProps) {
  const [completed, setCompleted] = useState(item.completed);
  const [markGroceryListItem] = useMutation(MarkGroceryListItemDocument, {
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });

  return (
    <View className="flex flex-row items-center border-b-[1px] border-gray-50 bg-white py-2">
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
        <View className="flex flex-1 flex-col items-start justify-center gap-2 pr-5">
          <Text className={cn('flex-1', completed ? 'line-through' : '')} numberOfLines={2}>
            {item.product && item.productId ? item.product.name : item.category}
          </Text>

          <View className="flex flex-row gap-2">
            <ProductMetadataBadge size="sm" text={`quantity ${item.quantity}`} />

            {item.product && item.productId && item.product.weightValue && (
              <ProductMetadataBadge
                type="weight"
                size="sm"
                text={`${item.product.weightValue} ${item.product.weightType}`}
              />
            )}

            {item.product && item.productId && item.product.quantityValue && (
              <ProductMetadataBadge
                type="quantity"
                size="sm"
                text={`${item.product.quantityValue} ${item.product.quantityType}`}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export function GroceryListItemLoading() {
  return (
    <View className="flex flex-row items-center border-b-[1px] border-gray-50 py-2">
      <View className="px-5 py-2">
        <View className="flex items-start justify-center rounded-full border-[1px] border-gray-300 p-1">
          <Feather name="check" size={15} color="#888" style={{ opacity: 0 }} />
        </View>
      </View>

      <View className="flex flex-1 flex-row flex-wrap gap-3 py-3">
        <View className="flex flex-1 flex-col items-start justify-center gap-2 pr-5">
          <Skeleton className="h-4 w-[50px] rounded-lg" />

          <View className="flex flex-row gap-2">
            <Skeleton className="h-2 w-[20px] rounded-lg" />
          </View>
        </View>
      </View>
    </View>
  );
}

export function GroceryListItemDeleteAction(
  props: { groceryListItemId: number },
  prog: SharedValue<number>,
  drag: SharedValue<number>
) {
  const [deleting, setDeleting] = useState(false);
  const [deleteGroceryListItem] = useMutation(DeleteGroceryListItemDocument, {
    variables: { groceryListItemId: props.groceryListItemId },
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 75 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <TouchableOpacity
        onPress={() => {
          setDeleting(true);
          deleteGroceryListItem();
        }}
        className="flex h-full w-[75px] flex-col items-center justify-center gap-3 bg-red-700">
        {deleting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Feather name="trash-2" size={20} color="white" />
        )}
      </TouchableOpacity>
    </Reanimated.View>
  );
}
