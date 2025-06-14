import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
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
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { UserAuthContext } from '@/context/UserContext';
import {
  AddToListDocument,
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  GetAllListsDocument,
  GetProductStocksDocument,
  LocationInput,
  ProductDocument,
  RemoveFromListDocument,
  Stock,
  StockDocument,
  UserRole,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { isRoleAuthorized } from '@/lib/roles';
import { incompleteProductFields } from '@/lib/utils';

const DEFAULT_SEARCH_RADIUS = 32187; // ~20 miles

export default function ProductScreen() {
  const navigation = useNavigation();
  const { lists, user } = useContext(UserAuthContext);
  const { productId, stockId } = useLocalSearchParams<{ productId: string; stockId?: string }>();
  const { location } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument, {
      fetchPolicy: 'network-only',
    });
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(StockDocument, {
    fetchPolicy: 'network-only',
  });
  const [getProductStocks, { data: stocksData }] = useLazyQuery(GetProductStocksDocument, {
    fetchPolicy: 'network-only',
  });
  const [getFavBranchesPrices, { data: favBranchesPriceData }] = useLazyQuery(
    FavoriteBranchesWithPricesDocument,
    { fetchPolicy: 'network-only' }
  );
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [watching, setWatching] = useState(false);
  const loading = productLoading || stockLoading;

  const [addToList] = useMutation(AddToListDocument, { refetchQueries: [GetAllListsDocument] });
  const [removeFromList] = useMutation(RemoveFromListDocument, {
    refetchQueries: [GetAllListsDocument],
  });

  useFocusEffect(
    useCallback(() => {
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
      getFavBranchesPrices({
        variables: {
          productId,
        },
      });
      return () => {
        setWatching(false);
        setFavorite(false);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [productId])
  );

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
    let locationInput: LocationInput = {
      latitude: user.address!.latitude,
      longitude: user.address!.longitude,
      radiusMeters: DEFAULT_SEARCH_RADIUS,
    };
    if (location) {
      locationInput = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: DEFAULT_SEARCH_RADIUS,
      };
    }
    console.log(locationInput);
    return getProductStocks({
      variables: { productId, location: locationInput },
    });
  }

  function toggleFavoriteList() {
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
  }

  function toggleWatchList() {
    if (!stockData) return;

    if (!watching) {
      setWatching(true);
      addToList({
        variables: {
          listId: lists.watchList.id,
          productId,
          stockId,
        },
      }).catch(() => setWatching(false));
      return;
    }
    setWatching(false);
    removeFromList({
      variables: {
        listId: lists.watchList.id,
        productListId: lists.watchList.productList?.find(
          (p) => p.productId.toString() === productId
        )?.id!,
      },
    }).catch(() => setWatching(true));
  }

  useEffect(() => {
    if (loading) return;
    navigation.setOptions({
      header: (props: BottomTabHeaderProps) => (
        <TabHeaderItem
          {...props}
          rightNav={
            <>
              {stockId && (
                <TouchableOpacity
                  onPress={toggleWatchList}
                  className="flex flex-row items-center gap-2 p-2">
                  <AntDesign name={watching ? 'eye' : 'eyeo'} size={25} color="#a855f7" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={toggleFavoriteList}
                className="flex flex-row items-center gap-2 p-2">
                <AntDesign name={favorite ? 'heart' : 'hearto'} size={20} color="#e11d48" />
              </TouchableOpacity>

              {isRoleAuthorized(UserRole.Contributor, user.role) && (
                <TouchableOpacity
                  onPress={() => setOpenEditModal(true)}
                  className="flex flex-row items-center gap-2 p-2">
                  <Feather name="edit" size={20} color="#3b82f6" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setOpenPriceModal(true)}
                className="flex flex-row items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                <Feather name="plus" size={20} color="#396a12" />
                <Text className="text-sm font-bold color-pricetraGreenHeavyDark">Price</Text>
              </TouchableOpacity>
            </>
          }
        />
      ),
    });
  }, [loading, favorite, watching]);

  useEffect(() => {
    if (!productData) return;
    const fields = incompleteProductFields(productData.product);
    if (fields.length === 0) return;
    setOpenEditModal(true);
  }, [productData]);

  if (loading || !productData) {
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
          onSuccess={(_product) => {
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

        {stockId && stockData && (
          <View className="mb-5 p-5">
            <View className="rounded-xl bg-gray-50 p-5">
              <SelectedStock stock={stockData.stock as Stock} />
            </View>
          </View>
        )}

        <ProductDetails
          stocks={(stocksData?.getProductStocks ?? []) as Stock[]}
          favBranchesPriceData={
            (favBranchesPriceData?.getFavoriteBranchesWithPrices ?? []) as BranchListWithPrices[]
          }
          product={productData.product}
        />

        <View className="h-[100px]" />
      </ScrollView>
    </>
  );
}
