import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import Image from '@/components/ui/Image';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabSubHeaderProductFilter, {
  PartialCategory,
} from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
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

export default function SelectedBranchScreen() {
  const navigation = useNavigation();
  const { lists } = useAuth();
  const { search, handleSearch, setSearching } = useContext(SearchContext);
  const [categoryFilterInput, setCategoryFilterInput] = useState<PartialCategory>();
  const { storeId, branchId, searchQuery, categoryId } = useLocalSearchParams<{
    storeId: string;
    branchId: string;
    searchQuery?: string;
    categoryId?: string;
  }>();
  const [fetchBranch, { data: branchData, loading: branchLoading }] = useLazyQuery(BranchDocument, {
    fetchPolicy: 'network-only',
  });
  const [favorite, setFavorite] = useState<boolean>();
  const [
    getAllProducts,
    { data: productsData, loading: productsLoading, fetchMore: fetchMoreProducts },
  ] = useLazyQuery(AllProductsDocument, { fetchPolicy: 'network-only' });
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
        query: search,
        category: categoryFilterInput?.category,
        categoryId: categoryFilterInput?.categoryId,
        branchId: +branchId,
        storeId: +storeId,
      }) as ProductSearch,
    [search, categoryFilterInput, branchId, storeId]
  );

  useEffect(() => {
    if (!categoryId) return;
    setCategoryFilterInput((c) => ({
      ...c,
      categoryId,
    }));
  }, [categoryId]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return;
    handleSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!branchData || !searchVariables.branchId || !searchVariables.storeId) return;

    getAllProducts({
      variables: {
        paginator: { limit: LIMIT, page: 1 },
        search: { ...searchVariables },
      },
    });
  }, [branchData, searchVariables]);

  const loadMore = useCallback(() => {
    if (!productsData?.allProducts.paginator) return;

    const { next } = productsData.allProducts.paginator;
    if (!next) return;

    return fetchMoreProducts({
      variables: {
        paginator: { limit: LIMIT, page: next },
        search: { ...searchVariables },
      },
      updateQuery: (prev, { fetchMoreResult }) => ({
        ...prev,
        allProducts: {
          ...fetchMoreResult.allProducts,
          products: [...prev.allProducts.products, ...fetchMoreResult.allProducts.products],
        },
      }),
    });
  }, [productsData, fetchMoreProducts]);

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
        setSearching(false);
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
            showSearch
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
            }
          />
        ),
      });

      setSubHeader(
        <TabSubHeaderProductFilter
          selectedCategoryId={categoryFilterInput?.id}
          onSelectCategory={(c) => setCategoryFilterInput(c)}
          onFiltersButtonPressed={() => {}}
          hideFiltersButton
        />
      );
    }, [favorite, branchData, categoryFilterInput])
  );

  if (productsLoading || !productsData) {
    return <RenderProductLoadingItems count={10} />;
  }

  if (productsData.allProducts.products.length === 0) {
    return (
      <View className="flex items-center justify-center px-5 py-36">
        <Text className="text-center">No products found</Text>
      </View>
    );
  }

  const products = (productsData?.allProducts.products as Product[]) || [];
  return (
    <ProductFlatlist
      products={products}
      paginator={productsData?.allProducts.paginator}
      handleRefresh={async () => {
        return getAllProducts({
          variables: {
            paginator: { limit: LIMIT, page: 1 },
            search: { ...searchVariables },
          },
        });
      }}
      setPage={loadMore}
    />
  );
}
