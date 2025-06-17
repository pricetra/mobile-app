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
  ListType,
  LocationInput,
  Product,
  ProductDocument,
  ProductList,
  RemoveFromListWithProductIdDocument,
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
  const loading = productLoading || stockLoading;

  const [addToList, { loading: addToListLoading }] = useMutation(AddToListDocument, {
    refetchQueries: [GetAllListsDocument],
  });
  const [removeFromList, { loading: removeFromListLoading }] = useMutation(
    RemoveFromListWithProductIdDocument,
    {
      refetchQueries: [GetAllListsDocument],
    }
  );
  const [favProductList, setFavProductList] = useState<ProductList>();
  const [watchProductList, setWatchProductList] = useState<ProductList>();

  useFocusEffect(
    useCallback(() => {
      getProduct({
        variables: {
          productId,
          viewerTrail: {
            stockId,
            // TODO: Add origin history is not supported so that will also need to be implemented
          },
        },
      }).then(({ data }) => {
        if (!data) return;

        const fav = data.product.productList.find((p) => p.type === ListType.Favorites);
        setFavProductList(fav);
        const watch = data.product.productList.find((p) => p.type === ListType.WatchList);
        setWatchProductList(watch);
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
        setFavProductList(undefined);
        setWatchProductList(undefined);
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
    return getProductStocks({
      variables: { productId, location: locationInput },
    });
  }

  function add(type: ListType.WatchList | ListType.Favorites, cb: (p: ProductList) => void) {
    const listId = type === ListType.Favorites ? lists.favorites.id : lists.watchList.id;
    addToList({
      variables: {
        listId,
        productId,
        stockId: type === ListType.WatchList ? stockId : undefined,
      },
    }).then(({ data, errors }) => {
      if (!data || errors) return;
      cb(data.addToList);
    });
  }

  function remove(type: ListType.WatchList | ListType.Favorites, cb: (p: ProductList) => void) {
    const listId = type === ListType.Favorites ? lists.favorites.id : lists.watchList.id;
    removeFromList({
      variables: {
        listId,
        productId,
      },
    }).then(({ data, errors }) => {
      if (!data || errors) return;
      cb(data.removeFromListWithProductId);
    });
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
                  onPress={() => {
                    if (watchProductList) {
                      return remove(ListType.WatchList, () => setWatchProductList(undefined));
                    }
                    add(ListType.WatchList, (p) => setWatchProductList(p));
                  }}
                  disabled={addToListLoading || removeFromListLoading}
                  className="flex flex-row items-center gap-2 p-2">
                  <AntDesign name={watchProductList ? 'eye' : 'eyeo'} size={25} color="#a855f7" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (favProductList) {
                    return remove(ListType.Favorites, () => setFavProductList(undefined));
                  }
                  add(ListType.Favorites, (p) => setFavProductList(p));
                }}
                disabled={addToListLoading || removeFromListLoading}
                className="flex flex-row items-center gap-2 p-2">
                <AntDesign name={favProductList ? 'heart' : 'hearto'} size={20} color="#e11d48" />
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
  }, [loading, favProductList, watchProductList, addToListLoading, removeFromListLoading]);

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
          product={productData.product as Product}
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
          product={productData.product as Product}
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
