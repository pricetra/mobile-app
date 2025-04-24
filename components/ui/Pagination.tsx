import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import Button from './Button';

import { Paginator } from '@/graphql/types/graphql';

export type PaginationProps = {
  paginator: Paginator;
  curPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ paginator, curPage, onPageChange }: PaginationProps) {
  return (
    <View className="flex flex-row items-center justify-between gap-2">
      <Button
        variant="outline"
        disabled={!paginator.prev}
        onPress={() => {
          if (!paginator.prev) return;
          onPageChange(paginator.prev);
        }}
        className="!px-4">
        <MaterialIcons name="arrow-back" size={20} color="black" />
      </Button>

      <View className="flex flex-1 flex-row flex-wrap items-center justify-center gap-2">
        {Array(paginator.numPages)
          .fill(0)
          .map((_, i) => (
            <Button
              key={i}
              variant={curPage === i + 1 ? 'secondary' : 'outline'}
              onPress={() => {
                onPageChange(i + 1);
              }}
              className="!px-5">
              {i + 1}
            </Button>
          ))}
      </View>

      <Button
        variant="outline"
        disabled={!paginator.next}
        onPress={() => {
          if (!paginator.next) return;
          onPageChange(paginator.next);
        }}
        className="!px-4">
        <MaterialIcons name="arrow-forward" size={20} color="black" />
      </Button>
    </View>
  );
}
