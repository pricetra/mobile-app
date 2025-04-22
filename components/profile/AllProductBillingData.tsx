import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { MyProductBillingDataDocument } from '@/graphql/types/graphql';
import { cn } from '@/lib/utils';

const MIN_COLUMN_WIDTHS = [70, 90, 160, 90, 65];
const LIMIT = 100;

export type AllProductBillingDataProps = object;

export default function AllProductBillingData({}: AllProductBillingDataProps) {
  const [getBillingData, { data, error }] = useLazyQuery(MyProductBillingDataDocument);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

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
      <Table aria-labelledby="invoice-table">
        <TableHeader>
          <TableRow className="pl-0 pr-5">
            <TableHead style={{ width: MIN_COLUMN_WIDTHS[0] }}>
              <Text className="font-bold">ID</Text>
            </TableHead>
            <TableHead style={{ width: MIN_COLUMN_WIDTHS[1] }}>
              <Text className="font-bold">Date</Text>
            </TableHead>
            <TableHead style={{ width: MIN_COLUMN_WIDTHS[2] }}>
              <Text className="font-bold">Product</Text>
            </TableHead>
            <TableHead style={{ width: MIN_COLUMN_WIDTHS[3] }}>
              <Text className="font-bold">Type</Text>
            </TableHead>
            <TableHead style={{ width: MIN_COLUMN_WIDTHS[4] }} className="items-end">
              <Text className="text-right font-bold">Rate</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <FlashList
            data={data.myProductBillingData.data}
            estimatedItemSize={1000}
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
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
            renderItem={({ item, index }) => {
              const d = dayjs(item.createdAt);
              return (
                <TableRow
                  key={item.id}
                  className={cn('active:bg-[#cfcfcf]', index % 2 && 'bg-[#ddd]', 'pl-0 pr-5')}>
                  <TableCell style={{ width: MIN_COLUMN_WIDTHS[0] }}>
                    <Text>{item.id}</Text>
                  </TableCell>
                  <TableCell style={{ width: MIN_COLUMN_WIDTHS[1] }}>
                    <Text>{d.format('MM/DD/YY')}</Text>
                    <Text>{d.format('hh:mm a')}</Text>
                  </TableCell>
                  <TableCell style={{ width: MIN_COLUMN_WIDTHS[2] }}>
                    <Text>{item.product?.name}</Text>
                  </TableCell>
                  <TableCell style={{ width: MIN_COLUMN_WIDTHS[3] }}>
                    <Text>{item.billingRateType}</Text>
                  </TableCell>
                  <TableCell style={{ width: MIN_COLUMN_WIDTHS[4] }} className="items-end">
                    <Text>${item.rate}</Text>
                  </TableCell>
                </TableRow>
              );
            }}
            ListFooterComponent={() => (
              <TableFooter>
                <TableRow>
                  <TableCell className="flex-1 justify-center">
                    <Text className="text-foreground">Total</Text>
                  </TableCell>
                  <TableCell className="items-end pr-8">
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => {
                        Alert.alert('Total Amount', `You pressed the total amount price button.`);
                      }}>
                      <Text>
                        $
                        {Math.fround(
                          data.myProductBillingData.data
                            .map(({ rate }) => rate)
                            .reduce((sum, cur) => sum + cur, 0.0)
                        )}
                      </Text>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          />
        </TableBody>
      </Table>
    </ScrollView>
  );
}
