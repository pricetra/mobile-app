import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import Image from '@/components/ui/Image';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabHeaderItemSearchBar from '@/components/ui/TabHeaderItemSearchBar';
import TabSubHeaderProductFilter from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { useAuth } from '@/context/UserContext';
import {
  AddBranchToListDocument,
  AllProductsDocument,
  BranchDocument,
  GetAllBranchListsByListIdDocument,
  GetAllListsDocument,
  Product,
  ProductSearch,
  RemoveBranchFromListDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { extractUndefined, stringToNumber, toBoolean } from '@/lib/utils';

export type BranchQueryParams = {
  storeId: string;
  branchId: string;
  query?: string;
  categoryId?: string;
  category?: string;
  page?: string;
  sale?: string;
  sortByPrice?: string;
};

export default function SelectedBranchScreen() {
  const navigation = useNavigation();
  const { lists } = useAuth();
  const params = useLocalSearchParams<BranchQueryParams>();
  const {
    storeId,
    branchId,
    query,
    categoryId,
    category,
    page = String(1),
    sale,
    sortByPrice,
  } = params;
  const [fetchBranch, { data: branchData, loading: branchLoading }] = useLazyQuery(BranchDocument, {
    fetchPolicy: 'network-only',
  });
  const [favorite, setFavorite] = useState<boolean>();
  const [getAllProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(
    AllProductsDocument,
    { fetchPolicy: 'network-only' }
  );
  const [addBranchToList] = useMutation(AddBranchToListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });
  const [removeBranchFromList] = useMutation(RemoveBranchFromListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });
  const { setSubHeader } = useHeader();

  const searchVariables = useMemo(
    () =>
      ({
        query: extractUndefined(query),
        category,
        categoryId: stringToNumber(categoryId),
        branchId: +branchId,
        storeId: +storeId,
        sale: sale ? toBoolean(sale) : undefined,
        sortByPrice,
      }) as ProductSearch,
    [query, category, categoryId, branchId, storeId, sale, sortByPrice]
  );

  function handleSearch(s?: string) {
    router.setParams({
      ...params,
      query: s ?? undefined,
    });
  }

  useEffect(() => {
    getAllProducts({
      variables: {
        paginator: { limit: LIMIT, page: +page },
        search: { ...searchVariables },
      },
    });
  }, [searchVariables, page]);

  useFocusEffect(
    useCallback(() => {
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
    }, [storeId, branchId])
  );

  useFocusEffect(
    useCallback(() => {
      if (branchLoading || !branchData) return;

      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            showSearch={false}
            leftNav={
              <View className="flex flex-row items-center gap-2">
                <Image
                  src={createCloudinaryUrl(branchData.findStore.logo, 100, 100)}
                  className="size-[30px] rounded-lg"
                />
                <View className="flex flex-col justify-center gap-[1px]">
                  <Text className="font-bold" numberOfLines={1}>
                    {branchData.findStore.name}
                  </Text>
                  {branchData.findBranch.address && (
                    <Text className="w-[80%] text-xs" numberOfLines={1}>
                      {branchData.findBranch.address.fullAddress}
                    </Text>
                  )}
                </View>
              </View>
            }
            rightNav={
              <>
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
                          (b) => b.branchId.toString() === branchId
                        )?.id!,
                        listId: lists.favorites.id,
                      },
                    });
                  }}
                  className="flex flex-row items-center gap-2 p-2">
                  {favorite !== undefined && (
                    <AntDesign name={favorite ? 'heart' : 'hearto'} size={20} color="#e11d48" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/(scan)', { relativeToDirectory: false })}>
                  <MaterialCommunityIcons name="barcode-scan" size={20} color="black" />
                </TouchableOpacity>
              </>
            }
          />
        ),
      });

      setSubHeader(
        <View className="flex flex-col">
          <View className="px-5 pt-2">
            <TabHeaderItemSearchBar
              handleSearch={handleSearch}
              branchName={branchData.findBranch.name}
              query={query}
            />
          </View>

          <TabSubHeaderProductFilter
            selectedCategoryId={extractUndefined(categoryId)}
            onSelectCategory={(c) => {
              router.setParams({
                ...params,
                page: 1,
                categoryId: String(c.id ?? undefined),
              });
            }}
            onFiltersButtonPressed={() => {}}
            hideFiltersButton
          />
        </View>
      );
    }, [favorite, branchData, categoryId, query])
  );

  if (productsLoading) {
    return <RenderProductLoadingItems count={10} />;
  }

  if (productsData && productsData.allProducts.products.length === 0) {
    return (
      <View className="flex items-center justify-center px-5 py-36">
        <Text className="text-center">No products found</Text>
      </View>
    );
  }

  if (!productsData) return <></>;

  const products = (productsData?.allProducts.products as Product[]) || [];
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ProductFlatlist
        products={products}
        paginator={productsData?.allProducts.paginator}
        handleRefresh={async () => {
          return getAllProducts({
            variables: {
              paginator: { limit: LIMIT, page: +page },
              search: { ...searchVariables },
            },
          });
        }}
        setPage={(p) => {
          router.setParams({
            ...params,
            page: String(p),
          });
        }}
      />
    </KeyboardAvoidingView>
  );
}
