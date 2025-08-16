import * as Clipboard from 'expo-clipboard';
import { View, Text } from 'react-native';

import { Product } from '@/graphql/types/graphql';

export type ProductSpecsProps = {
  product: Product;
};

export default function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <>
      {[
        { name: 'ID', value: product.id.toString() },
        { name: 'UPC/PLU Code', value: product.code },
        { name: 'Product Name', value: product.name },
        { name: 'Brand', value: product.brand },
        {
          name: 'Weight',
          value:
            product.weightValue && product.weightType
              ? `${product.weightValue} ${product.weightType}`
              : 'N/A',
        },
        { name: 'Image URL', value: product.image },
        { name: 'Views', value: product.views.toString() },
        { name: 'Category', value: product.category?.name },
        { name: 'Category ID', value: product.categoryId.toString() },
      ].map(({ name, value }) => (
        <View
          className="flex flex-row flex-wrap gap-3 border-b border-gray-100 py-5 last:border-0"
          key={name}>
          <Text className="font-bold">{name}:</Text>
          <Text
            onLongPress={async () => {
              const copied = await Clipboard.setStringAsync(value ?? '');
              if (!copied) return;
              alert(`${name} copied!`);
            }}>
            {value}
          </Text>
        </View>
      ))}
    </>
  );
}
