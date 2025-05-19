import { View, Text } from 'react-native';

import StockFull from '@/components/StockFull';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Product, Stock } from '@/graphql/types/graphql';

export type ProductDetailsProps = {
  product: Product;
  stocks: Stock[];
};

export function ProductDetails({ stocks, product }: ProductDetailsProps) {
  return (
    <Accordion type="multiple" collapsible defaultValue={['available-at']} className="mt-5 w-full">
      <AccordionItem value="available-at">
        <AccordionTrigger>
          <Text className="text-xl font-extrabold">Available at</Text>
        </AccordionTrigger>
        <AccordionContent>
          {stocks.length > 0 ? (
            stocks.map((s) => (
              <View className="mb-5" key={s.id}>
                <StockFull stock={s as Stock} />
              </View>
            ))
          ) : (
            <Text className="py-5 text-center">No stocks and prices found for this product.</Text>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="description">
        <AccordionTrigger>
          <Text className="text-xl font-extrabold">Description</Text>
        </AccordionTrigger>
        <AccordionContent>
          {product.description?.length > 0 && (
            <Text style={{ lineHeight: 19 }}>{product.description}</Text>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
