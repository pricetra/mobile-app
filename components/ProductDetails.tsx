import { useLazyQuery, useMutation } from '@apollo/client';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import convert from 'convert-units';
import { router } from 'expo-router';
import {
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  GetProductNutritionDataDocument,
  GetProductStocksDocument,
  Product,
  ProductNutrition,
  Stock,
  UpdateProductNutritionDataDocument,
} from 'graphql-utils';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { InView } from 'react-native-intersection-observer';

import FullStockView from './FullStockView';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import LocationChangeForm from './LocationChangeForm';
import MoreFromBrand from './MoreFromBrandSection';
import MoreFromCategory from './MoreFromCategorySection';
import NutritionFacts from './NutritionFacts';
import ProductSpecs from './ProductSpecs';
import RelatedBranchProducts from './RelatedBranchProducts';
import StockItemMini from './StockItemMini';
import LocationChangeButton from './ui/LocationChangeButton';
import ModalFormFull from './ui/ModalFormFull';
import ModalFormMini from './ui/ModalFormMini';

import Btn from '@/components/ui/Btn';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/UserContext';
import { cn } from '@/lib/utils';

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

export type ProductDetailsProps = {
  product: Product;
  stock?: Stock;
};

function stockToApproxMap(data: BranchListWithPrices): StockWithApproximatePrice {
  return {
    id: data.stock?.id ?? 0,
    productId: data.stock?.productId,
    latestPriceId: data.stock?.latestPrice?.id ?? 0,
    latestPrice: { ...data.stock?.latestPrice },
    branchId: data.branchId,
    branch: data.branch,
    store: data.branch?.store,
    storeId: data.branch?.storeId,
    approximatePrice: data.approximatePrice,
  } as StockWithApproximatePrice;
}

export function ProductDetails({ product, stock }: ProductDetailsProps) {
  const { width } = useWindowDimensions();
  const { lists } = useAuth();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();

  const [getProductStocks, { data: stocksData }] = useLazyQuery(GetProductStocksDocument, {
    fetchPolicy: 'no-cache',
  });
  const [getFavBranchesPrices, { data: favBranchesPriceData }] = useLazyQuery(
    FavoriteBranchesWithPricesDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [
    getProductNutritionData,
    { data: productNutritionData, loading: productNutritionLoading, error: productNutritionError },
  ] = useLazyQuery(GetProductNutritionDataDocument, { fetchPolicy: 'network-only' });

  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock>();
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [updateProductNutrition, { loading: updatingProductNutrition }] = useMutation(
    UpdateProductNutritionDataDocument,
    {
      variables: {
        productId: product.id,
      },
      refetchQueries: [GetProductNutritionDataDocument],
    }
  );

  const availableFavoriteBranches = useMemo(
    () =>
      favBranchesPriceData?.getFavoriteBranchesWithPrices?.filter(
        (d) => d.approximatePrice || d.stock?.latestPriceId
      ) as BranchListWithPrices[] | undefined,
    [favBranchesPriceData]
  );

  useEffect(() => {
    getFavBranchesPrices({
      variables: {
        productId: product.id,
      },
    });
  }, [product.id]);

  useEffect(() => {
    getProductStocks({
      variables: {
        paginator: {
          page: 1,
          limit: 10,
        },
        productId: product.id,
        location: currentLocation.locationInput,
      },
    });
  }, [product.id, currentLocation.locationInput]);

  useEffect(() => {
    if (!availableFavoriteBranches || availableFavoriteBranches.length === 0) return;
    setActiveSections((prev) => [...prev, 0]);
  }, [availableFavoriteBranches]);

  useEffect(() => {
    if (stocksData?.getProductStocks && stocksData.getProductStocks.paginator.total === 0) return;
    setActiveSections((prev) => [...prev, 1]);
  }, [stocksData]);

  useEffect(() => {
    if (!product.category) return;
    if (!product.category.path.includes('462')) return;
    setActiveSections((prev) => [...prev, 2]);
  }, [product.category]);

  return (
    <>
      <ModalFormFull
        visible={selectedStock !== undefined}
        onRequestClose={() => setSelectedStock(undefined)}
        title="Stock">
        {selectedStock && (
          <FullStockView stock={selectedStock} closeModal={() => setSelectedStock(undefined)} />
        )}
      </ModalFormFull>

      <ModalFormMini
        title="Change Location"
        visible={openFiltersModal}
        onRequestClose={() => setOpenFiltersModal(false)}>
        <LocationChangeForm
          addressInit={currentLocation.fullAddress}
          radiusInit={Math.round(
            convert(currentLocation.locationInput.radiusMeters ?? DEFAULT_SEARCH_RADIUS)
              .from('m')
              .to('mi')
          ).toString()}
          onSubmit={({ address, location, radius }) => {
            if (!location || !address) return;
            setCurrentLocation({
              locationInput: {
                latitude: location.latitude,
                longitude: location.longitude,
                radiusMeters: radius
                  ? Math.round(convert(radius).from('mi').to('m'))
                  : DEFAULT_SEARCH_RADIUS,
              },
              fullAddress: address,
            });
            setOpenFiltersModal(false);
          }}
          onCloseModal={() => setOpenFiltersModal(false)}
        />
      </ModalFormMini>

      <Accordion
        activeSections={activeSections}
        onChange={setActiveSections}
        expandMultiple
        sections={[
          {
            title: 'Favorite Stores',
            badge: availableFavoriteBranches?.length?.toString(),
            noHorizontalPadding: true,
            content: (
              <View>
                <View className="flex flex-row flex-wrap justify-between gap-x-5 gap-y-8 px-5">
                  {favBranchesPriceData ? (
                    <>
                      {favBranchesPriceData.getFavoriteBranchesWithPrices.map((favBranch, i) => {
                        const { approximatePrice, ...stock } = stockToApproxMap(
                          favBranch as BranchListWithPrices
                        );
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (approximatePrice) {
                                Alert.alert(
                                  'This is a stock approximation',
                                  'Stock approximations are calculated algorithmically and do not necessarily show the exact price at the location.'
                                );
                                return;
                              }
                              setSelectedStock(stock);
                            }}
                            disabled={stock.id === 0}
                            style={{
                              opacity: !approximatePrice && stock.id === 0 ? 0.35 : 1,
                              width: width / 2.5,
                            }}
                            key={`fav-stock-${stock.branchId}-${stock.id}-${i}`}>
                            <StockItemMini
                              stock={stock}
                              approximatePrice={approximatePrice}
                              quantityValue={product.quantityValue}
                              quantityType={product.quantityType}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  ) : (
                    <View className="flex items-center justify-center px-5 py-5">
                      <ActivityIndicator />
                    </View>
                  )}
                </View>

                <View className="mb-5 mt-2 flex flex-row px-5">
                  <Btn
                    text="Manage Favorites"
                    size="xs"
                    rounded="full"
                    className="bg-gray-200"
                    color="black"
                    icon={
                      <MaterialCommunityIcons name="star-cog-outline" size={15} color="black" />
                    }
                    onPress={() =>
                      router.push(`/(tabs)/(profile)/list/${lists.favorites.id}?tab=branches`, {
                        relativeToDirectory: false,
                      })
                    }
                  />

                  <View className="flex-1" />
                </View>
              </View>
            ),
          },
          {
            title: 'Available at',
            badge: stocksData?.getProductStocks?.paginator?.total,
            noHorizontalPadding: true,
            content: (
              <View>
                <View className="mb-5 flex flex-row items-center justify-between gap-5 px-5">
                  <LocationChangeButton onPress={() => setOpenFiltersModal(true)} />
                </View>

                {stocksData ? (
                  <>
                    {stocksData.getProductStocks.paginator.total !== 0 ? (
                      <>
                        <View className="flex flex-row flex-wrap justify-between gap-x-5 gap-y-8 px-5">
                          {stocksData.getProductStocks.stocks.map((s, i) => (
                            <TouchableOpacity
                              onPress={() => setSelectedStock(s as Stock)}
                              key={`stock-${s.id}-${i}`}
                              style={{
                                width: width / 2.5,
                              }}>
                              <StockItemMini
                                stock={s as Stock}
                                quantityValue={product.quantityValue}
                                quantityType={product.quantityType}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>

                        {stocksData.getProductStocks.paginator.next && (
                          <HorizontalShowMoreButton onPress={() => {}} heightDiv={1} />
                        )}
                      </>
                    ) : (
                      <Text className="py-5 text-center">
                        No stocks and prices found for this product.
                      </Text>
                    )}
                  </>
                ) : (
                  <View className="flex items-center justify-center px-5 py-5">
                    <ActivityIndicator />
                  </View>
                )}
              </View>
            ),
          },
          {
            title: 'Nutrition Facts',
            content: (
              <InView
                triggerOnce
                onChange={(inView) => {
                  console.log(inView);
                  if (!inView) return;

                  getProductNutritionData({
                    variables: {
                      productId: product.id,
                    },
                  });
                }}>
                <View className="mb-10 flex flex-row items-center justify-end gap-2">
                  <Btn
                    text="Edit"
                    size="sm"
                    rounded="full"
                    className="bg-gray-700"
                    icon={<Feather name="edit" size={15} color="white" />}
                    onPress={() => {
                      Linking.openURL(
                        `https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${product.code}`
                      );
                    }}
                  />

                  <Btn
                    text="Refetch"
                    size="sm"
                    rounded="full"
                    icon={<Ionicons name="refresh" size={17} color="white" />}
                    onPress={() => updateProductNutrition()}
                    loading={updatingProductNutrition}
                  />
                </View>

                {productNutritionData ? (
                  <>
                    {productNutritionData.getProductNutritionData.nutriments && (
                      <NutritionFacts
                        {...(productNutritionData.getProductNutritionData as ProductNutrition)}
                      />
                    )}

                    {productNutritionData.getProductNutritionData.ingredientList &&
                      productNutritionData.getProductNutritionData.ingredientList.length > 0 && (
                        <View className="mt-7">
                          <Text className="mb-1.5 text-lg font-bold">Ingredients</Text>
                          <Text className="text-sm">
                            {productNutritionData.getProductNutritionData.ingredientList
                              .map((i) => i.toUpperCase())
                              .join(', ')}
                          </Text>
                        </View>
                      )}
                  </>
                ) : (
                  <>
                    {productNutritionLoading ? (
                      <View className="flex items-center justify-center px-5 py-5">
                        <ActivityIndicator />
                      </View>
                    ) : (
                      <>
                        {productNutritionError && (
                          <Text className="py-5 text-center">
                            No nutrition information found for this product.{' '}
                            {productNutritionError.message}
                          </Text>
                        )}
                      </>
                    )}
                  </>
                )}
              </InView>
            ),
          },
          product.description?.length > 0
            ? {
                title: 'Description',
                content: <Text style={{ lineHeight: 19 }}>{product.description}</Text>,
              }
            : undefined,
          {
            title: 'Specifications',
            content: <ProductSpecs product={product} />,
          },
        ].filter((x) => x !== undefined)}
        renderHeader={(section, _i, isActive) =>
          section ? (
            <View className="flex flex-row items-center justify-between gap-5 px-5 py-3">
              <View className="flex flex-1 flex-row items-center justify-between gap-3">
                <Text className="text-lg font-semibold">{section.title}</Text>

                {section.badge && (
                  <Text className="size-6 rounded-full bg-pricetraGreenHeavyDark py-1 text-center text-xs font-bold color-white">
                    {section.badge}
                  </Text>
                )}
              </View>

              {isActive ? (
                <Feather name="chevron-up" size={24} color="black" />
              ) : (
                <Feather name="chevron-down" size={24} color="black" />
              )}
            </View>
          ) : (
            <></>
          )
        }
        renderContent={(section) => (
          <View className={cn('py-3', section && section.noHorizontalPadding ? 'px-0' : 'px-5')}>
            {section ? section.content : <></>}
          </View>
        )}
        keyExtractor={(_props, i) => i}
        sectionContainerStyle={{ marginBottom: 20, width: '100%', height: 'auto' }}
        containerStyle={{ marginTop: 20 }}
        underlayColor="transparent"
      />

      <View style={{ marginTop: 30 }} />

      <RelatedBranchProducts product={product} stock={stock} />

      <MoreFromBrand brand={product.brand} />
      {product.category && <MoreFromCategory category={product.category} />}
    </>
  );
}
