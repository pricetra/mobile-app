import { useLazyQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

import ProductItem from '@/components/ProductItem';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { GetProductStocksDocument, LocationInput, ProductDocument } from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

export default function ProductScreen() {
  const { productId } = useLocalSearchParams();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument);
  const [getProductStocks, { data: stocksData, loading: stocksLoading, error: stocksError }] =
    useLazyQuery(GetProductStocksDocument);

  useEffect(() => {
    if (!productId || typeof productId !== 'string') return router.back();
    getProduct({
      variables: { productId },
    });
    let locationInput: LocationInput | undefined = undefined;
    if (location) {
      locationInput = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: 32187, // ~20 miles
      };
    }
    getProductStocks({
      variables: { productId, location: locationInput },
    });
  }, [productId]);

  return (
    <SafeAreaView className="h-full">
      <FloatingActionButton onPress={() => {}}>
        <Feather name="plus" size={20} color="white" />
        <Text className="text-md font-bold color-white">Price</Text>
      </FloatingActionButton>

      <ScrollView className="mt-5 w-full">
        <View className="p-5">
          {productLoading && (
            <View className="flex h-40 w-full items-center justify-center px-10">
              <AntDesign
                name="loading1"
                className="size-[30px] animate-spin text-center"
                color="#555"
                size={30}
              />
            </View>
          )}
          {productData && <ProductItem product={productData.product} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
