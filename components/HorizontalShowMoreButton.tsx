import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, useWindowDimensions, View, Text } from 'react-native';

export type HorizontalShowMoreButtonProps = {
  onPress: () => void;
  heightDiv?: number;
};

export default function HorizontalShowMoreButton({
  onPress,
  heightDiv = 2,
}: HorizontalShowMoreButtonProps) {
  const { width } = useWindowDimensions();

  return (
    <View
      className="mx-5 flex flex-col items-start justify-center"
      style={{ width: width / 3, height: width / heightDiv }}>
      <TouchableOpacity
        className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border-[1px] border-gray-200 bg-gray-50"
        onPress={onPress}>
        <AntDesign name="arrowright" size={25} color="#4b5563" />
        <Text className="text-xs color-gray-600">Show All</Text>
      </TouchableOpacity>
    </View>
  );
}
