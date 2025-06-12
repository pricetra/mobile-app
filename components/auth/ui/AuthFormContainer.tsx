import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

export type AuthFormContainerProps = {
  title: string;
  children: ReactNode;
  optionalContent?: ReactNode;
};

export default function AuthFormContainer({
  children,
  title,
  optionalContent,
}: AuthFormContainerProps) {
  return (
    <ScrollView className="h-screen w-screen bg-white py-10">
      <SafeAreaView>
        <View className="flex flex-col items-center justify-center gap-1 p-10">
          <View className="mb-5 flex flex-row items-center justify-center gap-5">
            <Image
              source={require('@/assets/images/logo_black_color.svg')}
              style={{ height: 32.047, width: 45 }}
            />

            <View className="h-[50px] w-[1px] bg-gray-200" />

            <Text className="text-center text-2xl font-bold">{title}</Text>
          </View>

          <View className="w-full rounded-lg bg-white px-5 py-10">
            <View className="flex flex-col gap-5">{children}</View>
          </View>

          <View className="flex w-full flex-col gap-5 rounded-lg p-5">{optionalContent}</View>

          <View style={{ height: 300 }} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
