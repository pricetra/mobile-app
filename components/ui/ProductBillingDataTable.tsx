import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ProductBilling } from '@/graphql/types/graphql';
import { cn } from '@/lib/utils';

const MIN_COLUMN_WIDTHS = [70, 90, 160, 90, 65];

export type ProductBillingDataTableProps = {
  data: ProductBilling[];
  onRefresh?: () => void;
  refreshing?: boolean;
};

export default function ProductBillingDataTable({
  data,
  onRefresh,
  refreshing,
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
      <TableBody>
        <FlashList
          data={data}
          estimatedItemSize={1000}
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
              {/* <TableRow>
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
              </TableRow> */}
            </TableFooter>
          )}
        />
      </TableBody>
    </Table>
  );
}
