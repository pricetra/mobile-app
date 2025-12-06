import dayjs from 'dayjs';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PaginationSimple from './PaginationSimple';
import { Skeleton } from './Skeleton';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Paginator, ProductBilling } from 'graphql-utils';
import { cn } from '@/lib/utils';

const dataLoading = Array(50).fill({} as ProductBilling);
const MIN_COLUMN_WIDTHS = [70, 90, 160, 90, 65];

export type ProductBillingDataTableProps = {
  loading: boolean;
  data?: ProductBilling[];
  onRefresh?: () => void;
  refreshing?: boolean;
  paginator?: Paginator;
  curPage?: number;
  onPageChange?: (page: number) => void;
};

export default function ProductBillingDataTable({
  loading,
  data,
  onRefresh,
  refreshing,
  paginator,
  curPage,
  onPageChange,
}: ProductBillingDataTableProps) {
  const insets = useSafeAreaInsets();

  return (
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

      {data?.length === 0 && (
        <View className="w-screen px-5 py-10">
          <Text className="text-center">No product billing data found.</Text>
        </View>
      )}

      <TableBody>
        <FlatList
          data={loading ? dataLoading : data}
          // estimatedItemSize={1000}
          contentContainerStyle={{
            paddingBottom: insets.bottom,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item, index }) => {
            const d = dayjs(item.createdAt);
            return (
              <TableRow
                key={item.id}
                className={cn('active:bg-gray-100', index % 2 && 'bg-gray-50', 'pl-0 pr-5')}>
                <TableCell style={{ width: MIN_COLUMN_WIDTHS[0] }}>
                  {loading ? <Skeleton className="h-[20px] w-[50px]" /> : <Text>{item.id}</Text>}
                </TableCell>
                <TableCell style={{ width: MIN_COLUMN_WIDTHS[1] }}>
                  {loading ? (
                    <Skeleton className="mb-2 h-[10px] w-[50px]" />
                  ) : (
                    <Text>{d.format('MM/DD/YY')}</Text>
                  )}
                  {loading ? (
                    <Skeleton className="h-[10px] w-[50px]" />
                  ) : (
                    <Text>{d.format('hh:mm a')}</Text>
                  )}
                </TableCell>
                <TableCell style={{ width: MIN_COLUMN_WIDTHS[2] }}>
                  {loading ? (
                    <Skeleton className="h-[20px] w-full" />
                  ) : (
                    <Text>{item.product?.name}</Text>
                  )}
                </TableCell>
                <TableCell style={{ width: MIN_COLUMN_WIDTHS[3] }}>
                  {loading ? (
                    <Skeleton className="h-[20px] w-[50px]" />
                  ) : (
                    <Text>{item.billingRateType}</Text>
                  )}
                </TableCell>
                <TableCell style={{ width: MIN_COLUMN_WIDTHS[4] }} className="items-end">
                  {loading ? <Skeleton className="h-[10px] w-[50px]" /> : <Text>${item.rate}</Text>}
                </TableCell>
              </TableRow>
            );
          }}
          ListFooterComponent={() => (
            <TableFooter className="mb-[150px] w-screen p-5">
              {paginator && curPage && onPageChange && (
                <PaginationSimple paginator={paginator} onPageChange={onPageChange} />
              )}
            </TableFooter>
          )}
        />
      </TableBody>
    </Table>
  );
}
