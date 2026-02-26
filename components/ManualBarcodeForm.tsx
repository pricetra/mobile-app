import { useLazyQuery } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product, ProductSearchDocument } from 'graphql-utils';
import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { formatNumber } from 'react-native-currency-input';

import { HORIZONTAL_PRODUCT_WIDTH } from './BranchesWithProductsFlatlist';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';

import { Input } from '@/components/ui/Input';
import useAddProductPrompt from '@/hooks/useAddProductPrompt';

const LIMIT = 10;

export type ManualBarcodeFormProps = { onDismiss: () => void };

export default function ManualBarcodeForm({ onDismiss }: ManualBarcodeFormProps) {
  const [text, setText] = useState('');
  const [productSearch, { data: searchResults, loading }] = useLazyQuery(ProductSearchDocument, {
    fetchPolicy: 'no-cache',
  });
  const {
    handleBarcodeScan,
    handleExtractionImage,
    extractProductFromImagePrompt,
    processingBarcode,
    extractingProduct,
  } = useAddProductPrompt();

  function fetchProducts(page = 1) {
    productSearch({
      variables: {
        paginator: { page, limit: LIMIT },
        search: text.trim(),
      },
    });
  }

  return (
    <View className="mb-10 flex flex-col gap-10">
      <View className="px-5">
        <Input
          placeholder="Ex. Barcode, Product name, Category, etc."
          onChangeText={setText}
          value={text}
          autoFocus
          onEndEditing={() => fetchProducts()}
          inputMode="search"
          returnKeyType="search"
        />
      </View>

      {loading && (
        <FlatList
          horizontal
          data={Array(LIMIT)
            .fill(0)
            .map((_, i) => i)}
          keyExtractor={(i) => `product-loading-${i}`}
          renderItem={() => (
            <View className="mr-4" style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
              <ProductLoadingItemHorizontal />
            </View>
          )}
          style={{ paddingHorizontal: 15 }}
        />
      )}

      {searchResults && (
        <>
          {searchResults.productSearch.products.length > 0 ? (
            <View>
              <View className="mb-5 flex flex-row items-center justify-between gap-4 px-5">
                <Text className="text-sm color-gray-500">
                  {formatNumber(searchResults.productSearch.paginator.total, { delimiter: ',' })}{' '}
                  results
                </Text>

                <View className="flex flex-row gap-2">
                  <TouchableOpacity
                    disabled={!searchResults.productSearch.paginator.prev}
                    onPress={() => fetchProducts(searchResults.productSearch.paginator.prev ?? 1)}
                    className="px-2 pt-2"
                    style={{ opacity: !searchResults.productSearch.paginator.prev ? 0.3 : 1 }}>
                    <MaterialIcons name="navigate-before" size={24} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!searchResults.productSearch.paginator.next}
                    onPress={() => fetchProducts(searchResults.productSearch.paginator.next ?? 1)}
                    className="px-2 pt-2"
                    style={{ opacity: !searchResults.productSearch.paginator.next ? 0.3 : 1 }}>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={searchResults.productSearch.products}
                keyExtractor={({ id }) => `product-${id}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="mr-4"
                    onPress={() => {
                      router.push(`/(tabs)/(products)/${item.id}`, {
                        relativeToDirectory: false,
                      });
                      onDismiss();
                    }}
                    style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
                    <ProductItemHorizontal product={item as Product} />
                  </TouchableOpacity>
                )}
                style={{ paddingHorizontal: 15 }}
              />
            </View>
          ) : (
            <Text className="text-center">
              No results found.{' '}
              <Text
                onPress={() => {
                  if (extractingProduct || processingBarcode) return;
                  if (text.length < 4) return;

                  handleBarcodeScan(text, {
                    onSuccess: (data) => {
                      const params = new URLSearchParams();
                      if (data.barcodeScan.stock) {
                        params.set('stockId', String(data.barcodeScan.stock.id));
                      }
                      router.push(
                        `/(tabs)/(products)/${data.barcodeScan.id}${params.size > 0 ? `?${params.toString()}` : ''}`,
                        { relativeToDirectory: false }
                      );
                    },
                    onError: () => {
                      Alert.alert(
                        `${text} does not exist in our database`,
                        'You can help us record and track prices for this product by taking a picture',
                        extractProductFromImagePrompt({
                          onTakePicture: () => {
                            handleExtractionImage(text, {
                              onSuccess: (data) =>
                                router.push(
                                  `/(tabs)/(products)/${data.extractAndCreateProduct.id}`
                                ),
                              onError: () => {
                                Alert.alert(
                                  'Error extracting product data',
                                  'Please try again or add the product manually'
                                );
                              },
                            });
                          },
                          onAddManually: () => {},
                          onCancel: () => {},
                        })
                      );
                    },
                  });
                }}
                className="text-blue-500">
                {processingBarcode || extractingProduct ? (
                  <>
                    <ActivityIndicator /> Adding product
                  </>
                ) : (
                  <>Add product</>
                )}
              </Text>
            </Text>
          )}
        </>
      )}
    </View>
  );
}
