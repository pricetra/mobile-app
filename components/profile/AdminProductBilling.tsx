import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import ProductBillingDataTable from '@/components/ui/ProductBillingDataTable';
import { ProductBilling, ProductBillingDataByUserIdDocument, User } from '@/graphql/types/graphql';

const LIMIT = 100;

export type AdminProductBillingProps = {
  user: User;
};

export default function AdminProductBilling({ user }: AdminProductBillingProps) {
  const [getBillingData, { data, error }] = useLazyQuery(ProductBillingDataByUserIdDocument);
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
        userId: user.id,
      },
    }).finally(() => {
      setLoading(false);
    });
  }, [user, page]);

  // if (loading) {
  //   return (
  //     <View className="flex h-[200px] items-center justify-center p-10">
  //       <AntDesign
  //         name="loading1"
  //         className="size-[50px] animate-spin text-center"
  //         color="#374151"
  //         size={50}
  //       />
  //     </View>
  //   );
  // }

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
        data={data?.productBillingDataByUserId?.data as ProductBilling[]}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          getBillingData({
            variables: {
              paginator: {
                limit: 100,
                page: 1,
              },
              userId: user.id,
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
