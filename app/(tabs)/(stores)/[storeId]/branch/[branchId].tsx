import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';

import ProductItem from '@/components/ProductItem';
import Image from '@/components/ui/Image';
import { useHeader } from '@/context/HeaderContext';
import { AllProductsDocument, BranchDocument, Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedBranchScreen() {
  const bottomTabBarHeight = 45;
  const [refreshKey, setRefreshKey] = useState(0);
  const { setLeftNav, setRightNav } = useHeader();
  const { storeId, branchId } = useLocalSearchParams<{ storeId: string; branchId: string }>();
  const [fetchBranch, { data: branchData, loading: branchLoading }] = useLazyQuery(BranchDocument);
  const [favorite, setFavorite] = useState(false);
  const [getAllProducts, { data: productsData, error: productsError }] =
    useLazyQuery(AllProductsDocument);

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
      variables: { storeId, branchId },
    }).then((data) => {
      if (!data) return;
      getAllProducts({
        variables: {
          search: {
            branchId,
          },
          paginator: {
            limit: 10,
            page: 1,
          },
        },
      });
    });
  }, [storeId, branchId, refreshKey]);

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
            <Text className="text-xs w-[80%]" numberOfLines={1}>
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

  return (
    <Fragment key={refreshKey}>
      {productsData && (
        <FlatList
          data={productsData.allProducts.products as Product[]}
          keyExtractor={({ id }, i) => `${id}-${i}`}
          indicatorStyle="black"
          renderItem={({ item }) => (
            <View className="mb-10">
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`)
                }>
                <ProductItem product={item} />
              </TouchableOpacity>
            </View>
          )}
          className="p-5"
        />
      )}
    </Fragment>
  );
}
