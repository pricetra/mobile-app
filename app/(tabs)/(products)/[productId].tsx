import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  RefreshControl,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Share,
} from 'react-native';

import FullStockView from '@/components/FullStockView';
import { ProductDetails } from '@/components/ProductDetails';
import ProductFull, { ProductFullLoading } from '@/components/ProductFull';
import SelectedStock, { SelectedStockLoading } from '@/components/SelectedStock';
import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import ProductForm from '@/components/product-form/ProductForm';
import AddToGroceryListFab from '@/components/ui/AddToGroceryListFab';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useCurrentLocation } from '@/context/LocationContext';
import { UserAuthContext } from '@/context/UserContext';
import {
  AddToListDocument,
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  GetAllListsDocument,
  GetAllProductListsByListIdDocument,
  GetProductNutritionDataDocument,
  GetProductStocksDocument,
  ListType,
  PaginatedStocks,
  Product,
  ProductDocument,
  ProductList,
  ProductNutrition,
  RemoveFromListDocument,
  Stock,
  StockDocument,
  UserRole,
} from '@/graphql/types/graphql';
import { isRoleAuthorized } from '@/lib/roles';
import { incompleteProductFields } from '@/lib/utils';

export default function ProductScreen() {
  const navigation = useNavigation();
  const { lists, user } = useContext(UserAuthContext);
  const { productId, stockId } = useLocalSearchParams<{ productId: string; stockId?: string }>();
  const { currentLocation } = useCurrentLocation();
  const [getProduct, { data: productData, loading: productLoading, error: productError }] =
    useLazyQuery(ProductDocument, {
      fetchPolicy: 'network-only',
    });
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(StockDocument, {
    fetchPolicy: 'no-cache',
  });
  const [getProductStocks, { data: stocksData }] = useLazyQuery(GetProductStocksDocument, {
    fetchPolicy: 'no-cache',
  });
  const [getFavBranchesPrices, { data: favBranchesPriceData }] = useLazyQuery(
    FavoriteBranchesWithPricesDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [getProductNutritionData, { data: productNutritionData }] = useLazyQuery(
    GetProductNutritionDataDocument,
    { fetchPolicy: 'network-only' }
  );
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [addToList, { loading: addToListLoading }] = useMutation(AddToListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllProductListsByListIdDocument],
  });
  const [removeFromList, { loading: removeFromListLoading }] = useMutation(RemoveFromListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllProductListsByListIdDocument],
  });
  const [favProductList, setFavProductList] = useState<ProductList>();
  const [watchProductList, setWatchProductList] = useState<ProductList>();
  const [openWatchModal, setOpenWatchModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock>();

  useFocusEffect(
    useCallback(() => {
      const parsedProductId = parseInt(productId, 10);
      if (isNaN(parsedProductId)) {
        return router.back();
      }
      const parsedStockId = parseInt(stockId ?? '', 10);

      getProduct({
        variables: {
          productId: parsedProductId,
          viewerTrail: {
            stockId: !isNaN(parsedStockId) ? parsedStockId : undefined,
            // TODO: Add origin history is not supported so that will also need to be implemented
          },
        },
      }).then(({ data }) => {
        if (!data) return;

        const fav = data.product.productList.find((p) => p.type === ListType.Favorites);
        setFavProductList(fav);
        const watch = data.product.productList.find(
          (p) => p.type === ListType.WatchList && p.stockId?.toString() === stockId
        );
        setWatchProductList(watch);
      });

      if (!isNaN(parsedStockId)) {
        getStock({ variables: { stockId: parsedStockId } });
      }

      fetchProductStocksWithLocation(parsedProductId);
      getFavBranchesPrices({
        variables: {
          productId: parsedProductId,
        },
      });

      getProductNutritionData({ variables: { productId: parsedProductId } });
      return () => {
        setFavProductList(undefined);
        setWatchProductList(undefined);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [productId, stockId, currentLocation])
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

  function fetchProductStocksWithLocation(productId: number) {
    return getProductStocks({
      variables: {
        paginator: {
          page: 1,
          limit: 10,
        },
        productId,
        location: currentLocation.locationInput,
      },
    });
  }

  async function share() {
    if (!productData) return;

    const urlBuilder = new URLSearchParams();
    if (stockData) {
      urlBuilder.append('stockId', String(stockData.stock.id));
    }
    urlBuilder.append('sharedBy', String(user.id));
    urlBuilder.append('sharedFrom', String(user.authDevice));

    try {
      await Share.share({
        title: `${productData.product.name}`,
        message: 'Find similar prices on groceries and products on Pricetra (https://pricetra.com)',
        url: `https://pricetra.com/products/${productData.product.id}?${urlBuilder.toString()}`,
      });
    } catch (error: any) {
      Alert.alert('Could not share', error.message);
    }
  }

  async function add(type: ListType.WatchList | ListType.Favorites): Promise<ProductList> {
    // Check notification permissions
    if (type === ListType.WatchList) {
      const { granted, ios } = await Notifications.getPermissionsAsync();
      if (
        !granted ||
        ios?.status === Notifications.IosAuthorizationStatus.DENIED ||
        ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED
      ) {
        const permissionReq = await Notifications.requestPermissionsAsync();
        if (!permissionReq.granted) throw new Error('Notification permission was not granted');
      }
    }

    const listId = type === ListType.Favorites ? lists.favorites.id : lists.watchList.id;
    const { data, errors } = await addToList({
      variables: {
        listId,
        productId: +productId,
        stockId: type === ListType.WatchList && stockId ? +stockId : undefined,
      },
    });
    if (errors || !data) throw errors;
    return data.addToList;
  }

  function remove(type: ListType.WatchList | ListType.Favorites, cb: (p: ProductList) => void) {
    const listId = type === ListType.Favorites ? lists.favorites.id : lists.watchList.id;
    const productListId = type === ListType.Favorites ? favProductList?.id : watchProductList?.id;
    if (!productListId) return;

    removeFromList({
      variables: {
        listId,
        productListId,
      },
    }).then(({ data, errors }) => {
      if (!data || errors) return;
      cb(data.removeFromList);
    });
  }

  useEffect(() => {
    if (productLoading) return;

    navigation.setOptions({
      header: (props: BottomTabHeaderProps) => (
        <TabHeaderItem
          {...props}
          rightNav={
            <>
              {stockData && (
                <TouchableOpacity
                  onPress={() => {
                    if (watchProductList) {
                      return remove(ListType.WatchList, () => setWatchProductList(undefined));
                    }
                    setOpenWatchModal(true);
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
                  add(ListType.Favorites).then((p) => setFavProductList(p));
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

              <TouchableOpacity onPress={share} className="flex flex-row items-center gap-2 p-2">
                <Feather name="share" size={20} color="#166534" />
              </TouchableOpacity>
            </>
          }
        />
      ),
    });
  }, [
    productLoading,
    favProductList,
    watchProductList,
    addToListLoading,
    removeFromListLoading,
    stockData,
  ]);

  useEffect(() => {
    if (!productData) return;
    const fields = incompleteProductFields(productData.product);
    if (fields.length === 0) return;
    setOpenEditModal(true);
  }, [productData]);

  return (
    <>
      {productData && (
        <ModalFormFull
          title="Add Price"
          visible={openPriceModal}
          onRequestClose={() => setOpenPriceModal(false)}>
          <AddProductPriceForm
            product={productData.product}
            onCancel={() => setOpenPriceModal(false)}
            onSuccess={(p) => {
              setOpenPriceModal(false);
              if (p.stockId) {
                router.setParams({ stockId: p.stockId?.toString() });
              }
            }}
            onError={(e) => alert(e.message)}
          />
        </ModalFormFull>
      )}

      <ModalFormMini
        title="Watch Stock"
        visible={openWatchModal}
        onRequestClose={() => setOpenWatchModal(false)}>
        <View>
          <Text>
            Watching this product will allow you to track changes on this product on the selected
            store. You will recieve push notifications, and/or emails when the price changes.
          </Text>

          <View className="mt-10 flex flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setOpenWatchModal(false)}
              className="rounded-full bg-slate-200 px-10 py-5">
              <Text className="font-bold color-black">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                add(ListType.WatchList)
                  .then((p) => {
                    setWatchProductList(p);
                    setOpenWatchModal(false);
                  })
                  .catch((_err) =>
                    Alert.alert(
                      'Enable Notifications',
                      'Please go to settings and allow Pricetra to send Push Notifications before watching a product'
                    )
                  )
              }
              className="flex flex-1 flex-row items-center justify-center gap-3 rounded-full bg-pricetraGreenHeavyDark px-10 py-5"
              disabled={addToListLoading}>
              {addToListLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <AntDesign name="eyeo" size={20} color="#fff" />
              )}
              <Text className="font-bold color-white">Watch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalFormMini>

      {productData && (
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
      )}

      <ModalFormFull
        visible={selectedStock !== undefined}
        onRequestClose={() => setSelectedStock(undefined)}
        title="Stock">
        {selectedStock && (
          <FullStockView stock={selectedStock} closeModal={() => setSelectedStock(undefined)} />
        )}
      </ModalFormFull>

      {productData && <AddToGroceryListFab productId={productData.product.id} />}

      <FlatList
        className="h-full w-full"
        nestedScrollEnabled
        data={[]}
        renderItem={undefined}
        ListHeaderComponent={
          <>
            <View className="mt-5">
              {productData && !productLoading ? (
                <ProductFull
                  product={productData.product as Product}
                  hideDescription
                  hideEditButton
                  onEditButtonPress={() => setOpenEditModal(true)}
                />
              ) : (
                <ProductFullLoading />
              )}
            </View>

            {stockId &&
              (stockData && !stockLoading && productData ? (
                <View className="mb-5 p-5">
                  <TouchableOpacity
                    className="rounded-xl bg-gray-50 p-5"
                    onPress={() => setSelectedStock(stockData.stock as Stock)}>
                    <SelectedStock
                      stock={stockData.stock as Stock}
                      quantityValue={productData.product.quantityValue}
                      quantityType={productData.product.quantityType}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="mb-5 p-5">
                  <View className="rounded-xl bg-gray-50 p-5">
                    <SelectedStockLoading />
                  </View>
                </View>
              ))}

            {productData && (
              <ProductDetails
                paginatedStocks={stocksData?.getProductStocks as PaginatedStocks | undefined}
                favBranchesPriceData={
                  (favBranchesPriceData?.getFavoriteBranchesWithPrices ??
                    []) as BranchListWithPrices[]
                }
                product={productData.product}
                productNutrition={
                  productNutritionData?.getProductNutritionData as ProductNutrition | undefined
                }
                stock={stockData?.stock as Stock}
              />
            )}
          </>
        }
        ListFooterComponent={<View className="h-[100px]" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                fetchProductStocksWithLocation(+productId).finally(() => setRefreshing(false));
              }, 2000);
            }}
            colors={Platform.OS === 'ios' ? ['black'] : ['white']}
            progressBackgroundColor="#111827"
          />
        }
      />
    </>
  );
}
