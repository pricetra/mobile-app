import { Feather } from '@expo/vector-icons';
import { Paginator } from 'graphql-utils';
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

export type PaginatorProps = {
  paginator: Paginator;
  onPageChange: (page: number) => void;
};

export default function PaginationSimple({ paginator, onPageChange }: PaginatorProps) {
  const [pageInput, setPageInput] = useState(String(paginator.page));

  const handlePrev = () => {
    if (paginator.prev) {
      onPageChange(paginator.prev);
      setPageInput(String(paginator.prev));
    }
  };

  const handleNext = () => {
    if (paginator.next) {
      onPageChange(paginator.next);
      setPageInput(String(paginator.next));
    }
  };

  const handleSubmit = (p: string) => {
    const pageNum = parseInt(p, 10);
    if (isNaN(pageNum)) return;
    if (pageNum < 1) return;
    if (pageNum > paginator.numPages) return;

    onPageChange(pageNum);
  };

  return (
    <View className="flex-row items-center justify-between space-x-3 py-3">
      {/* Prev Button */}
      <TouchableOpacity
        disabled={!paginator.prev}
        onPress={handlePrev}
        className={`flex flex-row items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-3 ${
          !paginator.prev ? 'opacity-30' : ''
        }`}>
        <Feather name="arrow-left" size={15} color="black" />
        <Text className="font-bold color-black">Prev</Text>
      </TouchableOpacity>

      {/* Current Page Input */}
      <View className="flex-row items-center">
        <TextInput
          value={pageInput}
          onEndEditing={() => handleSubmit(pageInput)}
          onChangeText={setPageInput}
          keyboardType="numeric"
          className="h-10 w-14 rounded-lg border border-gray-300 text-center text-gray-800"
          readOnly={!paginator.prev && !paginator.next}
        />
        <Text className="ml-2 text-gray-600">of {paginator.numPages}</Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        disabled={!paginator.next}
        onPress={handleNext}
        className={`flex flex-row items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-3 ${
          !paginator.next ? 'opacity-30' : ''
        }`}>
        <Text className="font-bold color-black">Next</Text>
        <Feather name="arrow-right" size={15} color="black" />
      </TouchableOpacity>
    </View>
  );
}
