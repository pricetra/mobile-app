import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import SelectedStock from './SelectedStock';
import ModalFormMini from './ui/ModalFormMini';

import StockFull from '@/components/StockFull';
import { Product, Stock } from '@/graphql/types/graphql';

export type ProductDetailsProps = {
  product: Product;
  stocks: Stock[];
};

export function ProductDetails({ stocks, product }: ProductDetailsProps) {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock>();

  useEffect(() => {
    if (stocks.length === 0) return;
    setActiveSections([0]);
  }, [stocks]);

  return (
    <>
      <ModalFormMini
        visible={selectedStock !== undefined}
        onRequestClose={() => setSelectedStock(undefined)}
        title="Stock">
        {selectedStock && <SelectedStock stock={selectedStock} />}
      </ModalFormMini>

      <Accordion
        activeSections={activeSections}
        onChange={setActiveSections}
        expandMultiple
        sections={[
          {
            title: 'Available at',
            content: (
              <>
                {stocks.length > 0 ? (
                  stocks.map((s) => (
                    <TouchableOpacity
                      onPress={() => setSelectedStock(s)}
                      className="mb-5"
                      key={s.id}>
                      <StockFull stock={s as Stock} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="py-5 text-center">
                    No stocks and prices found for this product.
                  </Text>
                )}
              </>
            ),
          },
          {
            title: 'Description',
            content: (
              <>
                {product.description?.length > 0 ? (
                  <Text style={{ lineHeight: 19 }}>{product.description}</Text>
                ) : (
                  <Text className="py-5 text-center">No product description</Text>
                )}
              </>
            ),
          },
        ]}
        renderHeader={(section, _i, isActive) => (
          <View className="flex flex-row items-center justify-between px-5 py-3">
            <Text className="flex-1 text-xl font-extrabold">{section.title}</Text>
            {isActive ? (
              <Feather name="chevron-up" size={24} color="black" />
            ) : (
              <Feather name="chevron-down" size={24} color="black" />
            )}
          </View>
        )}
        renderContent={(section, i) => <View className="px-5 py-3">{section.content}</View>}
        keyExtractor={(_props, i) => i}
        sectionContainerStyle={{ marginBottom: 20, width: '100%', height: 'auto' }}
        containerStyle={{ marginTop: 20 }}
        underlayColor="transparent"
      />
    </>
  );
}
