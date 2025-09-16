import { useMutation } from '@apollo/client';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import convert from 'convert-units';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import FullStockView from './FullStockView';
import NutritionFacts from './NutritionFacts';
import ProductSearchFilterModal from './ProductSearchFilterModal';
import ProductSpecs from './ProductSpecs';
import ModalFormFull from './ui/ModalFormFull';
import ModalFormMini from './ui/ModalFormMini';

import StockFull from '@/components/StockFull';
import Btn from '@/components/ui/Btn';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/UserContext';
import {
  BranchListWithPrices,
  GetProductNutritionDataDocument,
  Product,
  ProductNutrition,
  Stock,
  UpdateProductNutritionDataDocument,
} from '@/graphql/types/graphql';
import { metersToMiles } from '@/lib/utils';

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

export type ProductDetailsProps = {
  favBranchesPriceData: BranchListWithPrices[];
  product: Product;
  stocks: Stock[];
  productNutrition?: ProductNutrition;
};

export function ProductDetails({
  favBranchesPriceData,
  stocks,
  product,
  productNutrition,
}: ProductDetailsProps) {
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

  useEffect(() => {
    if (stocks.length === 0) return;
    setActiveSections([0]);
  }, [stocks]);

  return (
    <>
      <ModalFormFull
        visible={selectedStock !== undefined}
        onRequestClose={() => setSelectedStock(undefined)}
        title="Stock">
        {selectedStock && <FullStockView stock={selectedStock} />}
      </ModalFormFull>

      <ModalFormMini
        title="Search Filters"
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
            badge: favBranchesPriceData
              .filter((d) => d.approximatePrice || d.stock?.latestPriceId)
              .length.toString(),
            content: (
              <View>
                <View className="mb-5 flex flex-row items-center justify-between gap-5">
                  <View className="flex-1" />

                  <Btn
                    text="Favorites"
                    size="sm"
                    rounded="full"
                    className="bg-black"
                    icon={
                      <MaterialCommunityIcons name="star-cog-outline" size={15} color="white" />
                    }
                    onPress={() =>
                      router.push(`/(tabs)/(profile)/list/${lists.favorites.id}?tab=branches`)
                    }
                  />
                </View>

                {favBranchesPriceData.length > 0 ? (
                  favBranchesPriceData
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
                        className="mb-5"
                        key={`${stock.id}-${i}`}>
                        <StockFull
                          stock={stock}
                          approximatePrice={approximatePrice}
                          quantityValue={product.quantityValue}
                          quantityType={product.quantityType}
                        />
                      </TouchableOpacity>
                    ))
                ) : (
                  <Text className="py-5 text-center">You have no branches in your favorites</Text>
                )}
              </View>
            ),
          },
          {
            title: 'Available at',
            badge: stocks.length.toString(),
            content: (
              <View>
                <View className="mb-5 flex flex-row items-center justify-between gap-5">
                  <View className="flex flex-1 flex-row items-center gap-2">
                    <AntDesign name="infocirlce" size={12} color="#6b7280" />

                    <Text className="flex-1 text-xs color-gray-500">
                      Showing results within{' '}
                      <Text className="font-bold italic">
                        {metersToMiles(currentLocation.locationInput.radiusMeters ?? 0)} miles
                      </Text>{' '}
                      of <Text className="font-bold italic">{currentLocation.fullAddress}</Text>
                    </Text>
                  </View>

                  <Btn
                    text="Filters"
                    size="sm"
                    rounded="full"
                    className="bg-black"
                    icon={<Ionicons name="filter" size={15} color="white" />}
                    onPress={() => setOpenFiltersModal(true)}
                  />
                </View>

                {stocks.length > 0 ? (
                  stocks.map((s) => (
                    <TouchableOpacity
                      onPress={() => setSelectedStock(s)}
                      className="mb-5"
                      key={s.id}>
                      <StockFull
                        stock={s as Stock}
                        quantityValue={product.quantityValue}
                        quantityType={product.quantityType}
                      />
                    </TouchableOpacity>
                  ))
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
        renderContent={(section, i) => <View className="px-5 py-3">{section?.content}</View>}
        keyExtractor={(_props, i) => i}
        sectionContainerStyle={{ marginBottom: 20, width: '100%', height: 'auto' }}
        containerStyle={{ marginTop: 20 }}
        underlayColor="transparent"
      />
    </>
  );
}
