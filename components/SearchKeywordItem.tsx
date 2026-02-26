import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

export type SearchKeywordItemProps = {
  searchTerm: string;
  onPress: () => void;
};

export default function SearchKeywordItem({ searchTerm, onPress }: SearchKeywordItemProps) {
  return (
    <TouchableOpacity
      className="my-1 flex flex-row items-center justify-between gap-2 px-5 py-3"
      onPress={onPress}>
      <Text className="font-lg">{searchTerm}</Text>
      <Ionicons name="search" size={15} color="#555" />
    </TouchableOpacity>
  );
}
