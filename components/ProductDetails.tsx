import { useMutation } from '@apollo/client';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import convert from 'convert-units';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import FullStockView from './FullStockView';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import NutritionFacts from './NutritionFacts';
import ProductSearchFilterModal from './ProductSearchFilterModal';
import ProductSpecs from './ProductSpecs';
import StockItemMini from './StockItemMini';
import LocationChangeButton from './ui/LocationChangeButton';
import ModalFormFull from './ui/ModalFormFull';
import ModalFormMini from './ui/ModalFormMini';

import Btn from '@/components/ui/Btn';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/UserContext';
import {
  BranchListWithPrices,
  GetProductNutritionDataDocument,
  PaginatedStocks,
  Product,
  ProductNutrition,
  Stock,
  UpdateProductNutritionDataDocument,
} from '@/graphql/types/graphql';
import { cn } from '@/lib/utils';

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

export type ProductDetailsProps = {
  favBranchesPriceData: BranchListWithPrices[];
  product: Product;
  paginatedStocks?: PaginatedStocks;
  productNutrition?: ProductNutrition;
};

export function ProductDetails({
  favBranchesPriceData,
  paginatedStocks,
  product,
  productNutrition,
}: ProductDetailsProps) {
  const { width } = useWindowDimensions();
  const { lists } = useAuth();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
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
    () => favBranchesPriceData.filter((d) => d.approximatePrice || d.stock?.latestPriceId),
    [favBranchesPriceData]
  );

  useEffect(() => {
    if (availableFavoriteBranches.length === 0) return;
    setActiveSections((prev) => [...prev, 0]);
  }, [availableFavoriteBranches]);

  useEffect(() => {
    if (paginatedStocks?.paginator.total === 0) return;
    setActiveSections((prev) => [...prev, 1]);
  }, [paginatedStocks]);

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
        <ProductSearchFilterModal
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
            title: 'Favorite Branches',
            badge: availableFavoriteBranches.length.toString(),
            content: (
              <View>
                <View className="mb-5 flex flex-row items-center justify-between gap-5">
                  <Btn
                    text="Favorites"
                    size="sm"
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

                <View className="flex flex-row flex-wrap gap-5">
                  {favBranchesPriceData
                    .map(
                      (data) =>
                        ({
                          id: data.stock?.id ?? 0,
                          productId: data.stock?.productId,
                          latestPriceId: data.stock?.latestPrice?.id ?? 0,
                          latestPrice: { ...data.stock?.latestPrice },
                          branchId: data.branchId,
                          branch: data.branch,
                          store: data.branch?.store,
                          storeId: data.branch?.storeId,
                          approximatePrice: data.approximatePrice,
                        }) as StockWithApproximatePrice
                    )
                    .map(({ approximatePrice, ...stock }, i) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (approximatePrice) {
                            Alert.alert(
                              'This is a stock approximation',
                              'Stock approximations are calculated algorithmically and do not necessarily show the exact price at the location.'
                            );
                            return;
                          }
                          if (stock.id === 0) {
                            alert('Stock not recorded for this branch');
                            return;
                          }
                          setSelectedStock(stock);
                        }}
                        className={cn(
                          'mb-2',
                          !approximatePrice && stock.id === 0 ? 'opacity-35' : 'opacity-100'
                        )}
                        style={{ width: width / 2.5 }}
                        key={`${stock.id}-${i}`}>
                        <StockItemMini
                          stock={stock}
                          approximatePrice={approximatePrice}
                          quantityValue={product.quantityValue}
                          quantityType={product.quantityType}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ),
          },
          {
            title: 'Available at',
            badge: paginatedStocks ? paginatedStocks.paginator.total.toString() : undefined,
            noHorizontalPadding: true,
            content: (
              <View>
                <View className="mb-5 flex flex-row items-center justify-between gap-5 px-5">
                  <LocationChangeButton onPress={() => setOpenFiltersModal(true)} />
                </View>

                {paginatedStocks && paginatedStocks.stocks.length > 0 ? (
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={paginatedStocks.stocks}
                    keyExtractor={({ id }, i) => `${id}-${i}`}
                    renderItem={({ item: s }) => (
                      <TouchableOpacity
                        onPress={() => setSelectedStock(s)}
                        className="px-2"
                        key={s.id}>
                        <StockItemMini
                          stock={s as Stock}
                          quantityValue={product.quantityValue}
                          quantityType={product.quantityType}
                          stackLogo
                        />
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    ListFooterComponent={() =>
                      paginatedStocks.paginator.next ? (
                        <HorizontalShowMoreButton onPress={() => {}} heightDiv={3} />
                      ) : undefined
                    }
                  />
                ) : (
                  <Text className="py-5 text-center">
                    No stocks and prices found for this product.
                  </Text>
                )}
              </View>
            ),
          },
          productNutrition &&
            (productNutrition.nutriments || productNutrition.ingredientList) && {
              title: 'Nutrition Facts',
              content: (
                <View>
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

                  {productNutrition.nutriments && <NutritionFacts {...productNutrition} />}

                  {productNutrition.ingredientList &&
                    productNutrition.ingredientList.length > 0 && (
                      <View className="mt-7">
                        <Text className="mb-1.5 text-xl font-bold">Ingredients</Text>
                        <Text>
                          {productNutrition.ingredientList.map((i) => i.toUpperCase()).join(', ')}
                        </Text>
                      </View>
                    )}
                </View>
              ),
            },
          {
            title: 'Description',
            content: (
              <>
                {product.description?.length > 0 ? (
                  <Text style={{ lineHeight: 19 }}>{product.description}</Text>
                ) : (
                  <Text className="py-5 text-center">No product description</Text>
                )}
              </>
            ),
          },
          {
            title: 'Specifications',
            content: <ProductSpecs product={product} />,
          },
        ].filter((x) => x !== undefined)}
        renderHeader={(section, _i, isActive) =>
          section ? (
            <View className="flex flex-row items-center justify-between gap-5 px-5 py-3">
              <View className="flex flex-1 flex-row items-center justify-between gap-3">
                <Text className="text-xl font-extrabold">{section.title}</Text>

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
        renderContent={(section, i) => (
          <View className={cn('py-3', section?.noHorizontalPadding ? 'px-0' : 'px-5')}>
            {section?.content}
          </View>
        )}
        keyExtractor={(_props, i) => i}
        sectionContainerStyle={{ marginBottom: 20, width: '100%', height: 'auto' }}
        containerStyle={{ marginTop: 20 }}
        underlayColor="transparent"
      />
    </>
  );
}
