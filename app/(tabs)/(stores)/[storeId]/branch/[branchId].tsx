import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import Image from '@/components/ui/Image';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { AllProductsDocument, BranchDocument, Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedBranchScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { setLeftNav, setRightNav } = useHeader();
  const { storeId, branchId } = useLocalSearchParams<{ storeId: string; branchId: string }>();
  const [fetchBranch, { data: branchData }] = useLazyQuery(BranchDocument);
  const [favorite, setFavorite] = useState(false);
  const [
    getAllProducts,
    { data: productsData, loading: productsLoading, fetchMore: fetchMoreProducts },
  ] = useLazyQuery(AllProductsDocument);

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
      setLeftNav(<></>);
      setRightNav(<></>);
      setRefreshKey((prev) => prev + 1);
      return () => {
        setLeftNav(<></>);
        setRightNav(<></>);
      };
    }, [])
  );

  useEffect(() => {
    if (!storeId || !branchId) return router.back();

    fetchBranch({
      variables: {
        storeId,
        branchId,
      },
    });
    loadProducts(1);
  }, [storeId, branchId, branchData, refreshKey]);

  useEffect(() => {
    if (!branchData) return;
    setLeftNav(
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
    );
    setRightNav(
      <>
        <TouchableOpacity onPress={() => {}} className="flex flex-row items-center gap-2 p-2">
          <AntDesign name={favorite ? 'heart' : 'hearto'} size={20} color="#e11d48" />
        </TouchableOpacity>
      </>
    );
  }, [branchData, refreshKey]);

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
    <Fragment key={refreshKey}>
      <ProductFlatlist
        products={products}
        paginator={productsData?.allProducts.paginator}
        handleRefresh={async () => {
          return loadProducts(1, true);
        }}
        setPage={loadMore}
      />
    </Fragment>
  );
}
