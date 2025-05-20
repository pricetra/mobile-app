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
  TouchableOpacity,
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
import { useHeader } from '@/context/HeaderContext';
import Button from '@/components/ui/Button';

export default function ProductScreen() {
  const { setRightNav } = useHeader();
  const { productId } = useLocalSearchParams();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument);
  const [getProductStocks, { data: stocksData }] = useLazyQuery(GetProductStocksDocument, {
    fetchPolicy: 'network-only',
  });
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
    });
    fetchProductStocksWithLocation(productId);
  }, [productId]);

  useEffect(() => {
    if (productLoading || !productData) return;
    setRightNav(
      <>
        <TouchableOpacity
          onPress={() => setOpenPriceModal(true)}
          className="flex flex-row items-center gap-2 px-3 py-2">
          <Feather name="plus" size={23} color="#396a12" />
          <Text className="text-md font-bold color-pricetraGreenHeavyDark">Price</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOpenEditModal(true)}
          className="flex flex-row items-center gap-2 px-3 py-2">
          <Feather name="edit" size={20} color="#3b82f6" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} className="flex flex-row items-center gap-2 px-3 py-2">
          <Feather name="more-vertical" size={20} color="black" />
        </TouchableOpacity>
      </>
    );
  }, [productData, productLoading]);

  if (productLoading || !productData) {
    return (
      <SafeAreaView>
        <ProductFullLoading />
      </SafeAreaView>
    );
  }

  return (
    <>
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
          hideEditButton
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
