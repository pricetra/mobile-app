import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import ProductBillingDataTable from '@/components/ui/ProductBillingDataTable';
import { MyProductBillingDataDocument, ProductBilling } from '@/graphql/types/graphql';

const LIMIT = 100;

export type AllProductBillingDataProps = object;

export default function AllProductBillingData({}: AllProductBillingDataProps) {
  const [getBillingData, { data, error }] = useLazyQuery(MyProductBillingDataDocument);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getBillingData({
      variables: {
        paginator: {
          limit: LIMIT,
          page,
        },
      },
    }).finally(() => {
      setLoading(false);
    });
  }, [page]);

  if (loading) {
    return (
      <View className="flex h-[200px] items-center justify-center p-10">
        <AntDesign
          name="loading1"
          className="size-[50px] animate-spin text-center"
          color="#374151"
          size={50}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-10">
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="py-10">
        <Text>Could not load data</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <ProductBillingDataTable
        loading={loading}
        data={data.myProductBillingData.data as ProductBilling[]}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          getBillingData({
            variables: {
              paginator: {
                limit: 100,
                page: 1,
              },
            },
            fetchPolicy: 'network-only',
          }).finally(() => {
            setRefreshing(false);
          });
        }}
      />
    </ScrollView>
  );
}
