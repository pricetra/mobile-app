import { useLazyQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';

import ProductFull from '@/components/ProductFull';
import StockFull from '@/components/StockFull';
import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormMini from '@/components/ui/ModalFormMini';
import {
  GetProductStocksDocument,
  LocationInput,
  ProductDocument,
  Stock,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

export default function ProductScreen() {
  const { productId } = useLocalSearchParams();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument);
  const [getProductStocks, { data: stocksData, loading: stocksLoading, error: stocksError }] =
    useLazyQuery(GetProductStocksDocument);
  const [openPriceModal, setOpenPriceModal] = useState(false);

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
    <SafeAreaView className="h-full bg-white">
      {productData && (
        <>
          <FloatingActionButton onPress={() => setOpenPriceModal(true)}>
            <Feather name="plus" size={20} color="white" />
            <Text className="text-md font-bold color-white">Price</Text>
          </FloatingActionButton>

          <ModalFormMini
            title="Add Price"
            visible={openPriceModal}
            onRequestClose={() => setOpenPriceModal(false)}>
            <AddProductPriceForm
              product={productData.product}
              onCancel={() => setOpenPriceModal(false)}
              onSuccess={(p) => {
                setOpenPriceModal(false);
                Alert.alert(
                  'Price added',
                  `Price set to $${p.amount} at location ${p.branch?.address?.fullAddress}`
                );
              }}
              onError={(e) => alert(e.message)}
            />
          </ModalFormMini>
        </>
      )}

      <ScrollView className="w-full">
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

        {productData && <ProductFull product={productData.product} />}

        {stocksData && (
          <View className="mt-5 p-5">
            <Text className="mb-5 text-lg font-extrabold">Available at</Text>
            {stocksData.getProductStocks.map((s) => (
              <View className="mb-2" key={s.id}>
                <StockFull stock={s as Stock} />
              </View>
            ))}
          </View>
        )}

        <View className="h-[100px]" />
      </ScrollView>
    </SafeAreaView>
  );
}
