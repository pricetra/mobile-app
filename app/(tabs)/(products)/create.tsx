import { router, useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import ProductForm from '@/components/product-form/ProductForm';

export default function CreateProductScreen() {
  const [upc, setUpc] = useState<string>();
  const query = useGlobalSearchParams();

  useEffect(() => {
    if (!query.upc) {
      router.back();
      return;
    }
    setUpc(query.upc as string);
  }, [query]);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View className="mt-5 p-5">
        <ProductForm
          upc={upc}
          onCancel={() => router.push('/(tabs)/')}
          onSuccess={({ id }) => router.push(`/(tabs)/(products)/${id}`)}
          onError={(err) => Alert.alert(err.name, err.message)}
        />
      </View>
    </ScrollView>
  );
}
