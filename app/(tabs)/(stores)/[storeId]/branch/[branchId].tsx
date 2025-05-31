import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import Image from '@/components/ui/Image';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { LIMIT } from '@/constants/constants';
import { useAuth } from '@/context/UserContext';
import {
  AddBranchToListDocument,
  AllProductsDocument,
  BranchDocument,
  GetAllListsDocument,
  Product,
  RemoveBranchFromListDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedBranchScreen() {
  const navigation = useNavigation();
  const { lists } = useAuth();
  const { storeId, branchId } = useLocalSearchParams<{ storeId: string; branchId: string }>();
  const [fetchBranch, { data: branchData }] = useLazyQuery(BranchDocument);
  const [favorite, setFavorite] = useState(false);
  const [
    getAllProducts,
    { data: productsData, loading: productsLoading, fetchMore: fetchMoreProducts },
  ] = useLazyQuery(AllProductsDocument);
  const [addBranchToList] = useMutation(AddBranchToListDocument, {
    refetchQueries: [GetAllListsDocument],
  });
  const [removeBranchFromList] = useMutation(RemoveBranchFromListDocument, {
    refetchQueries: [GetAllListsDocument],
  });

  const loadProducts = useCallback(
    async (page = 1, force = false) => {
      return getAllProducts({
        variables: {
          paginator: { limit: LIMIT, page },
          search: {
            branchId,
          },
        },
        fetchPolicy: force ? 'no-cache' : undefined,
      });
    },
    [storeId, branchId, getAllProducts]
  );

  const loadMore = useCallback(() => {
    if (!productsData?.allProducts.paginator) return;

    const { next } = productsData.allProducts.paginator;
    if (!next) return;

    return fetchMoreProducts({
      variables: {
        paginator: { limit: LIMIT, page: next },
        search: {
          branchId,
        },
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

      setFavorite(
        lists.favorites.branchList?.some((b) => b.branchId.toString() === branchId) ?? false
      );
      fetchBranch({
        variables: {
          storeId,
          branchId,
        },
      });
      loadProducts(1);
      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [storeId, branchId])
  );

  useEffect(() => {
    if (!branchData) return;

    navigation.setOptions({
      header: (props: BottomTabHeaderProps) => (
        <TabHeaderItem
          {...props}
          leftNav={
            <View className="flex flex-row items-center gap-2">
              <Image
                src={createCloudinaryUrl(branchData.findStore.logo, 100, 100)}
                className="size-[30px] rounded-lg"
              />
              <View className="flex flex-col justify-center gap-[1px]">
                <Text className="font-bold">{branchData.findStore.name}</Text>
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
                if (!favorite) {
                  setFavorite(true);
                  addBranchToList({
                    variables: {
                      branchId,
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
              <AntDesign name={favorite ? 'heart' : 'hearto'} size={20} color="#e11d48" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [favorite, branchData, branchId]);

  if (productsLoading) {
    return <RenderProductLoadingItems count={10} />;
  }

  const products = (productsData?.allProducts.products as Product[]) || [];

  if (products.length === 0) {
    return (
      <View className="flex items-center justify-center px-5 py-36">
        <Text className="text-center">No products found</Text>
      </View>
    );
  }

  return (
    <ProductFlatlist
      products={products}
      paginator={productsData?.allProducts.paginator}
      handleRefresh={async () => {
        return loadProducts(1, true);
      }}
      setPage={loadMore}
    />
  );
}
