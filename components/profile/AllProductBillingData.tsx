import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import ProductBillingDataTable from '@/components/ui/ProductBillingDataTable';
import { MyProductBillingDataDocument, ProductBilling } from '@/graphql/types/graphql';

const LIMIT = 50;

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

  if (error) {
    return (
      <View className="py-10">
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <ProductBillingDataTable
        loading={loading}
        data={data?.myProductBillingData?.data as ProductBilling[]}
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
        paginator={data?.myProductBillingData?.paginator}
        curPage={page}
        onPageChange={setPage}
      />
    </ScrollView>
  );
}
