import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import ProductForm from '@/components/product-form/ProductForm';

export default function CreateProductScreen() {
  const [upc, setUpc] = useState<string>();
  const query = useLocalSearchParams<{ upc?: string }>();

  useEffect(() => {
    setUpc(query.upc ?? '');
  }, [query.upc]);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior="padding">
        <View className="p-5">
          <ProductForm
            upc={upc}
            onCancel={({ resetForm }) => {
              resetForm();
              router.push('/(tabs)/');
            }}
            onSuccess={({ id }, { resetForm }) => {
              resetForm();
              router.push(`/(tabs)/(products)/${id}`);
            }}
            onError={(err) => Alert.alert(err.name, err.message)}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
