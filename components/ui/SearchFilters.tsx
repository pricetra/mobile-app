import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import FilterBrandsModal from './FilterBrandsModal';
import FilterCategoriesModal from './FilterCategoriesModal';
import ModalFormFull from './ModalFormFull';

import { SearchRouteParams } from '@/app/(tabs)/search';
import { cn } from '@/lib/utils';

export type SearchFiltersProps = {
  onUpdateParams: (p: URLSearchParams) => void;
  params: SearchRouteParams;
};

export default function SearchFilters({ params, onUpdateParams }: SearchFiltersProps) {
  const [brandSelectionModal, setBrandSelectionModal] = useState(false);
  const [categorySelectionModal, setCategorySelectionModal] = useState(false);

  return (
    <View className="flex flex-row flex-wrap items-center gap-3">
      <SearchFilterButton
        label="Sale"
        onPress={() => {
          if (params.sale) {
            const sp = new URLSearchParams(params);
            sp.delete('sale');
            onUpdateParams(sp);
            return;
          }
          const sp = new URLSearchParams(params);
          sp.set('sale', 'true');
          onUpdateParams(sp);
        }}
        active={!!params.sale}
      />

      <SearchFilterButton
        label="Category"
        value={params.category || params.categoryId ? params.category : undefined}
        dropDown
        onPress={() => setCategorySelectionModal(true)}
        onPressClear={
          params.category || params.categoryId
            ? () => {
                const sp = new URLSearchParams(params);
                sp.delete('category');
                sp.delete('categoryId');
                onUpdateParams(sp);
              }
            : undefined
        }
      />

      <ModalFormFull
        title="Filter Categories"
        onRequestClose={() => setCategorySelectionModal(false)}
        visible={categorySelectionModal}>
        <FilterCategoriesModal
          onSubmit={({ id, name }) => {
            const sp = new URLSearchParams(params);
            sp.set('categoryId', String(id));
            sp.set('category', name);
            onUpdateParams(sp);
            setCategorySelectionModal(false);
          }}
          onClose={() => setCategorySelectionModal(false)}
          value={params.category ?? undefined}
        />
      </ModalFormFull>

      <SearchFilterButton
        label="Brand"
        value={params.brand ?? undefined}
        dropDown
        onPress={() => setBrandSelectionModal(true)}
        onPressClear={
          params.brand
            ? () => {
                const sp = new URLSearchParams(params);
                sp.delete('brand');
                onUpdateParams(sp);
              }
            : undefined
        }
      />

      <ModalFormFull
        title="Filter Brands"
        onRequestClose={() => setBrandSelectionModal(false)}
        visible={brandSelectionModal}>
        <FilterBrandsModal
          onSubmit={(brand) => {
            const sp = new URLSearchParams(params);
            sp.set('brand', brand);
            onUpdateParams(sp);
            setBrandSelectionModal(false);
          }}
          onClose={() => setBrandSelectionModal(false)}
          value={params.brand ?? undefined}
        />
      </ModalFormFull>

      <SearchFilterButton
        label="Sort"
        value={
          params.sortByPrice ? (params.sortByPrice === 'asc' ? '↓ Price' : '↑ Price') : undefined
        }
        dropDown
        onPressClear={
          params.sortByPrice
            ? () => {
                const sp = new URLSearchParams(params);
                sp.delete('sortByPrice');
                onUpdateParams(sp);
              }
            : undefined
        }
      />
    </View>
  );
}

function SearchFilterButton({
  label,
  value,
  dropDown = false,
  active = false,
  onPress,
  onPressClear,
}: {
  label: string;
  value?: string;
  dropDown?: boolean;
  active?: boolean;
  onPress?: () => void;
  onPressClear?: () => void;
}) {
  return (
    <View
      className={cn(
        'flex flex-row items-center gap-1 rounded-full',
        active ? 'bg-pricetraGreenDark' : 'bg-gray-100'
      )}>
      <TouchableOpacity className="flex flex-row items-center gap-1.5 py-2 pl-4" onPress={onPress}>
        <Text className={cn('text-sm', active ? 'text-white' : 'text-black')}>{label}</Text>
        {value && (
          <Text className={cn('text-sm font-bold', active ? 'text-white' : 'text-black')}>
            {value}
          </Text>
        )}
      </TouchableOpacity>

      <View className="item-center flex flex-row pr-2">
        {dropDown && (
          <TouchableOpacity onPress={onPress} className="flex flex-row items-center p-1.5">
            <Ionicons name="caret-down-sharp" size={10} color="black" />
          </TouchableOpacity>
        )}

        {onPressClear && (
          <TouchableOpacity onPress={onPressClear} className="p-1.5">
            <AntDesign name="close" size={13} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
