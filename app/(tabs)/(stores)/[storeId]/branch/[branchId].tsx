import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  AddBranchToListDocument,
  AllProductsDocument,
  BranchDocument,
  GetAllBranchListsByListIdDocument,
  GetAllListsDocument,
  Product,
  RemoveBranchFromListDocument,
  CategoriesWithProductsDocument,
  CategoryWithProducts,
} from 'graphql-utils';
import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Share,
  ScrollView,
} from 'react-native';

import { SearchRouteParams } from '@/app/(tabs)/search';
import CategorizedProductItem, {
  CategorizedProductItemLoading,
} from '@/components/CategorizedProductItem';
import ProductFlatlist, { ProductFlatlistLoading } from '@/components/ProductFlatlist';
import Image from '@/components/ui/Image';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartPagination } from '@/components/ui/SmartPagination';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabHeaderItemSearchBar from '@/components/ui/TabHeaderItemSearchBar';
import TabSubHeaderProductFilter from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { useAuth } from '@/context/UserContext';
import { createCloudinaryUrl } from '@/lib/files';
import { extractUndefined, stringToNumber, toBoolean } from '@/lib/utils';

export type BranchQueryParams = SearchRouteParams & {
  storeId: string;
  branchId: string;
  page?: string;
};

export default function SelectedBranchScreen() {
  const navigation = useNavigation();
  const { lists } = useAuth();
  const params = useLocalSearchParams<BranchQueryParams>();
  const [fetchBranch, { data: branchData, loading: branchLoading }] = useLazyQuery(BranchDocument, {
    fetchPolicy: 'network-only',
  });
  const branchId = +params.branchId;
  const storeId = +params.storeId;
  const [filteredParamsSize, setFilteredParamsSize] = useState(0);
  const [favorite, setFavorite] = useState<boolean>();
  const [
    getCategorizedProducts,
    { data: categorizedProductsData, loading: categorizedProductsLoading },
  ] = useLazyQuery(CategoriesWithProductsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [getAllProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(
    AllProductsDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [addBranchToList] = useMutation(AddBranchToListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });
  const [removeBranchFromList] = useMutation(RemoveBranchFromListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });
  const { setSubHeader } = useHeader();

  function handleSearch(s?: string) {
    router.setParams({
      ...params,
      page: String(1),
      query: s ?? '',
    });
  }

  async function share() {
    if (!branchData) return;

    await Share.share({
      title: `${branchData.findBranch.name} on Pricetra`,
      url: `https://pricetra.com/stores/${branchData.findStore.slug}/${branchData.findBranch.slug}`,
    });
  }

  function fetchAllProducts(params: BranchQueryParams) {
    const page = +(params.page ?? 1);
    return getAllProducts({
      variables: {
        paginator: { limit: LIMIT, page },
        search: {
          query: extractUndefined(params.query),
          brand: params.brand,
          category: params.category,
          categoryId: stringToNumber(params.categoryId),
          branchId: +params.branchId,
          storeId: +params.storeId,
          sale: params.sale ? toBoolean(params.sale) : undefined,
          sortByPrice: params.sortByPrice,
        },
      },
    });
  }

  function fetchCategorizedProducts(params: BranchQueryParams) {
    const page = +(params.page ?? 1);
    getCategorizedProducts({
      variables: {
        paginator: {
          page,
          limit: 10,
        },
        productLimit: 20,
        filters: {
          branchId: +params.branchId,
          sortByPrice: params.sortByPrice,
          sale: params.sale ? toBoolean(params.sale) : undefined,
        },
      },
    });
  }

  useEffect(() => {
    const sp = { ...params } as any;
    delete sp.page;
    delete sp.sale;
    delete sp.sortByPrice;
    delete sp.branchId;
    delete sp.storeId;
    const filtersSize = Object.entries(sp).length;
    setFilteredParamsSize(filtersSize);

    if (filtersSize > 0) {
      fetchAllProducts(params);
    } else {
      fetchCategorizedProducts(params);
    }
  }, [
    params.page,
    params.storeId,
    params.branchId,
    params.query,
    params.brand,
    params.category,
    params.categoryId,
    params.sale,
    params.sortByPrice,
  ]);

  useFocusEffect(
    useCallback(() => {
      const { storeId, branchId } = params;
      if (!storeId || !branchId) return router.back();

      fetchBranch({
        variables: {
          branchId: +branchId,
          storeId: +storeId,
        },
      });

      setFavorite(
        lists.favorites.branchList?.some((b) => b.branchId.toString() === branchId) ?? false
      );
      return () => {
        setSubHeader(undefined);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [params.storeId, params.branchId, lists.favorites])
  );

  useEffect(() => {
    navigation.setOptions({
      header: (props: BottomTabHeaderProps) => (
        <TabHeaderItem
          {...props}
          showSearch={false}
          leftNav={
            <View className="flex flex-1 flex-row items-center gap-2">
              {branchLoading || !branchData ? (
                <Skeleton className="size-[30px] rounded-lg" />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(tabs)/(stores)/${branchData.findStore.id}`, {
                      relativeToDirectory: false,
                    })
                  }>
                  <Image
                    src={createCloudinaryUrl(branchData.findStore.logo, 100, 100)}
                    className="size-[30px] rounded-lg"
                  />
                </TouchableOpacity>
              )}

              {branchLoading || !branchData ? (
                <View className="flex flex-col justify-center gap-1">
                  <Skeleton className="h-[13px] w-[90px]" />
                  <Skeleton className="h-[10px] w-[120px]" />
                </View>
              ) : (
                <View className="flex flex-col justify-center gap-[1px]">
                  <Text
                    className="font-bold"
                    numberOfLines={1}
                    onPress={() =>
                      router.push(`/(tabs)/(stores)/${branchData.findStore.id}`, {
                        relativeToDirectory: false,
                      })
                    }>
                    {branchData.findStore.name}
                  </Text>
                  {branchData.findBranch.address && (
                    <Text
                      className="text-xs"
                      numberOfLines={1}
                      onPress={() => Linking.openURL(branchData.findBranch.address.mapsLink)}>
                      {branchData.findBranch.address.fullAddress}
                    </Text>
                  )}
                </View>
              )}
            </View>
          }
          rightNav={
            branchLoading || !branchData ? (
              <></>
            ) : (
              <View className="flex flex-row items-center justify-end gap-1">
                <TouchableOpacity
                  onPress={() => {
                    if (favorite === undefined) return;
                    if (!favorite) {
                      setFavorite(true);
                      addBranchToList({
                        variables: {
                          branchId: +branchId,
                          listId: lists.favorites.id,
                        },
                      }).catch(() => setFavorite(false));
                      return;
                    }
                    setFavorite(false);
                    removeBranchFromList({
                      variables: {
                        branchListId: lists.favorites.branchList?.find(
                          (b) => b.branchId === branchId
                        )?.id!,
                        listId: lists.favorites.id,
                      },
                    });
                  }}
                  className="flex flex-row items-center p-2">
                  {favorite !== undefined && (
                    <AntDesign name={favorite ? 'heart' : 'hearto'} size={15} color="#e11d48" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={share} className="flex flex-row items-center p-2">
                  <Feather name="share" size={15} color="#166534" />
                </TouchableOpacity>
              </View>
            )
          }
        />
      ),
    });

    setSubHeader(
      <View className="flex flex-col">
        <View className="flex flex-row gap-3 px-5 pt-1">
          <View className="flex-1">
            <TabHeaderItemSearchBar
              handleSearch={handleSearch}
              branchName={branchData ? branchData.findBranch.name : ''}
              query={params.query}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/(scan)', { relativeToDirectory: false })}
            className="p-2.5">
            <MaterialCommunityIcons name="barcode-scan" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <TabSubHeaderProductFilter
          onUpdateParams={(p) =>
            router.replace(`/(tabs)/(stores)/${storeId}/branch/${branchId}?${p.toString()}`, {
              relativeToDirectory: false,
            })
          }
        />
      </View>
    );
  }, [
    branchData,
    branchLoading,
    lists,
    favorite,
    params.query,
    params.brand,
    params.category,
    params.categoryId,
    params.sale,
    params.sortByPrice,
  ]);
  const products = (productsData?.allProducts.products as Product[]) || [];
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      {filteredParamsSize > 0 && productsData ? (
        <>
          {productsData.allProducts.products.length === 0 ? (
            <View className="flex items-center justify-center px-5 py-36">
              <Text className="text-center">No products found</Text>
            </View>
          ) : (
            <ProductFlatlist
              products={products}
              paginator={productsData?.allProducts.paginator}
              handleRefresh={async () => {
                return fetchAllProducts(params);
              }}
              setPage={(p) => {
                router.setParams({
                  ...params,
                  page: String(p),
                });
              }}
              style={{ paddingVertical: 10 }}
            />
          )}
        </>
      ) : (
        productsLoading && <ProductFlatlistLoading count={LIMIT} style={{ paddingVertical: 10 }} />
      )}

      {filteredParamsSize === 0 && categorizedProductsData ? (
        <>
          {categorizedProductsData.categoriesWithProducts.categories.length === 0 ? (
            <View className="flex items-center justify-center px-5 py-36">
              <Text className="text-center">No products found</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
              {categorizedProductsData.categoriesWithProducts.categories.map((category, i) => (
                <CategorizedProductItem
                  storeId={storeId}
                  branchId={branchId}
                  category={category as CategoryWithProducts}
                  key={`branch-${category.id}`}
                />
              ))}

              {categorizedProductsData.categoriesWithProducts.paginator.numPages > 1 && (
                <SmartPagination
                  paginator={categorizedProductsData.categoriesWithProducts.paginator}
                  onPageChange={(p) => {
                    router.setParams({
                      ...params,
                      page: String(p),
                    });
                  }}
                />
              )}

              <View className="h-[10vh]" />
            </ScrollView>
          )}
        </>
      ) : (
        categorizedProductsLoading && (
          <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <CategorizedProductItemLoading key={`product-loading-parent-${i}`} />
              ))}
          </ScrollView>
        )
      )}
    </KeyboardAvoidingView>
  );
}
