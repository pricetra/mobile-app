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
    <ScrollView className="h-screen w-screen bg-slate-200 py-10">
      <SafeAreaView>
        <View className="flex flex-col items-center justify-center gap-1 p-10">
          <View className="mb-10">
            <Image
              source={require('../assets/images/logotype_light.svg')}
              style={{ height: 42.426, width: 180 }}
            />
          </View>

          <View className="w-full rounded-lg bg-white px-5 py-10">
            <Text className="mb-10 text-center text-2xl font-bold">{title}</Text>

            <View className="flex flex-col gap-5">{children}</View>
          </View>

          <View className="flex w-full flex-col gap-5 rounded-lg p-5">{optionalContent}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
