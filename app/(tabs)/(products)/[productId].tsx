import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';

import ProductFull, { ProductFullLoading } from '@/components/ProductFull';
import StockFull from '@/components/StockFull';
import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import ProductForm from '@/components/product-form/ProductForm';
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
    useLazyQuery(GetProductStocksDocument, { fetchPolicy: 'network-only' });
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (!productError) return;
    Alert.alert('Error fetching product', productError.message);
    try {
      router.back();
    } catch {
      router.dismissAll();
    }
  }, [productError]);

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

  if (productLoading || !productData) {
    return (
      <SafeAreaView>
        <ProductFullLoading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
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
        <ProductFull
          product={productData.product}
          onEditButtonPress={() => setOpenEditModal(true)}
        />

        {stocksData && stocksData.getProductStocks.length > 0 && (
          <View className="mt-5 p-5">
            <Text className="mb-5 text-lg font-extrabold">Available at</Text>
            {stocksData.getProductStocks.map((s) => (
              <View className="mb-4" key={s.id}>
                <StockFull stock={s as Stock} />
              </View>
            ))}
          </View>
        )}

        <View className="h-[100px]" />
      </ScrollView>

      <ModalFormMini
        title="Edit Product"
        visible={openEditModal}
        onRequestClose={() => setOpenEditModal(false)}>
        <ProductForm
          product={productData?.product}
          onCancel={() => setOpenEditModal(false)}
          onSuccess={(product) => {
            setOpenEditModal(false);
          }}
          onError={(e) => alert(e.message)}
        />
      </ModalFormMini>
    </SafeAreaView>
  );
}
