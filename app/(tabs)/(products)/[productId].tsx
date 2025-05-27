import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
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
import SelectedStock from '@/components/SelectedStock';
import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import ProductForm from '@/components/product-form/ProductForm';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { useHeader } from '@/context/HeaderContext';
import { UserAuthContext } from '@/context/UserContext';
import {
  AddToListDocument,
  GetAllListsDocument,
  GetProductStocksDocument,
  LocationInput,
  ProductDocument,
  RemoveFromListDocument,
  Stock,
  StockDocument,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

export default function ProductScreen() {
  const { lists } = useContext(UserAuthContext);
  const { setRightNav } = useHeader();
  const { productId, stockId } = useLocalSearchParams<{ productId: string; stockId?: string }>();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument, {
      fetchPolicy: 'network-only',
    });
  const [getStock, { data: stockData, loading: stockLoading, error: stockError }] = useLazyQuery(
    StockDocument,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getProductStocks, { data: stocksData }] = useLazyQuery(GetProductStocksDocument, {
    fetchPolicy: 'network-only',
  });
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [watching, setWatching] = useState(false);

  const [addToList] = useMutation(AddToListDocument, { refetchQueries: [GetAllListsDocument] });
  const [removeFromList] = useMutation(RemoveFromListDocument, {
    refetchQueries: [GetAllListsDocument],
  });

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

    setFavorite(
      lists.favorites.productList?.some((p) => p.productId.toString() === productId) ?? false
    );
    setWatching(
      lists.watchList.productList?.some((p) => p.productId.toString() === productId) ?? false
    );

    getProduct({
      variables: { productId },
    });
    if (stockId) {
      getStock({ variables: { stockId } });
    }
    fetchProductStocksWithLocation(productId);
  }, [productId]);

  useEffect(() => {
    if (productLoading || !productData) return;
    setRightNav(
      <>
        <TouchableOpacity
          onPress={() => setOpenEditModal(true)}
          className="flex flex-row items-center gap-2 p-2">
          <Feather name="edit" size={20} color="#3b82f6" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!favorite) {
              setFavorite(true);
              addToList({
                variables: {
                  listId: lists.favorites.id,
                  productId,
                },
              }).catch(() => setFavorite(false));
              return;
            }
            setFavorite(false);
            removeFromList({
              variables: {
                listId: lists.favorites.id,
                productListId: lists.favorites.productList?.find(
                  (p) => p.productId.toString() === productId
                )?.id!,
              },
            }).catch(() => setFavorite(true));
          }}
          className="flex flex-row items-center gap-2 p-2">
          <AntDesign name={favorite ? 'heart' : 'hearto'} size={20} color="#e11d48" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!stocksData) return;

            if (!watching) {
              setWatching(true);
              addToList({
                variables: {
                  listId: lists.favorites.id,
                  productId,
                  // TODO: Add stock id
                },
              }).catch(() => setWatching(false));
              return;
            }
            setWatching(false);
            addToList({
              variables: {
                listId: lists.favorites.id,
                productId,
                // TODO: Add stock id
              },
            }).catch(() => setWatching(true));
          }}
          className="flex flex-row items-center gap-2 p-2">
          <AntDesign name={watching ? 'eye' : 'eyeo'} size={20} color="#a855f7" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOpenPriceModal(true)}
          className="flex flex-row items-center gap-2 rounded-full bg-green-100 px-4 py-2">
          <Feather name="plus" size={20} color="#396a12" />
          <Text className="text-sm font-bold color-pricetraGreenHeavyDark">Price</Text>
        </TouchableOpacity>
      </>
    );
  }, [productData, productLoading, favorite, productId]);

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

        {stockData && (
          <View className="mb-5 p-5">
            <SelectedStock stock={stockData.stock as Stock} />
          </View>
        )}

        <ProductDetails
          stocks={(stocksData?.getProductStocks ?? []) as Stock[]}
          product={productData.product}
        />

        <View className="h-[100px]" />
      </ScrollView>
    </>
  );
}
