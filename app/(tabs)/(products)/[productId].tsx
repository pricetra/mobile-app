import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';

import { ProductDetails } from '@/components/ProductDetails';
import ProductFull, { ProductFullLoading } from '@/components/ProductFull';
import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import ProductForm from '@/components/product-form/ProductForm';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import {
  GetProductStocksDocument,
  LocationInput,
  ProductDocument,
  Stock,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

export default function ProductScreen() {
  const navigation = useNavigation();
  const { productId } = useLocalSearchParams();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument);
  const [getProductStocks, { data: stocksData, loading: stocksLoading, error: stocksError }] =
    useLazyQuery(GetProductStocksDocument, { fetchPolicy: 'network-only' });
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!productError) return;
    Alert.alert('Error fetching product', productError.message);
    try {
      router.back();
    } catch {
      router.dismissAll();
    }
  }, [productError]);

  function fetchProductStocksWithLocation(productId: string) {
    let locationInput: LocationInput | undefined = undefined;
    if (location) {
      locationInput = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: 32187, // ~20 miles
      };
    }
    return getProductStocks({
      variables: { productId, location: locationInput },
    });
  }

  useEffect(() => {
    if (!productId || typeof productId !== 'string') return router.back();
    getProduct({
      variables: { productId },
    }).then(({ data }) => {
      if (!data) return;
      navigation.setOptions({ title: data.product.name });
    });
    fetchProductStocksWithLocation(productId);
  }, [productId]);

  if (productLoading || !productData) {
    return (
      <SafeAreaView>
        <ProductFullLoading />
      </SafeAreaView>
    );
  }

  return (
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

      <ModalFormFull
        title="Edit Product"
        visible={openEditModal}
        onRequestClose={() => setOpenEditModal(false)}>
        <ProductForm
          product={productData.product}
          onCancel={() => setOpenEditModal(false)}
          onSuccess={(product) => {
            setOpenEditModal(false);
          }}
          onError={(e) => alert(e.message)}
        />
      </ModalFormFull>

      <ScrollView
        className="h-full w-full"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                fetchProductStocksWithLocation(productId as string).finally(() =>
                  setRefreshing(false)
                );
              }, 2000);
            }}
            colors={Platform.OS === 'ios' ? ['black'] : ['white']}
            progressBackgroundColor="#111827"
          />
        }>
        <ProductFull
          product={productData.product}
          hideDescription
          onEditButtonPress={() => setOpenEditModal(true)}
        />

        <ProductDetails
          stocks={(stocksData?.getProductStocks ?? []) as Stock[]}
          product={productData.product}
        />

        <View className="h-[100px]" />
      </ScrollView>
    </>
  );
}
