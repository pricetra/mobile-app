import { ReactNode } from 'react';
import { View, Text } from 'react-native';

export type AuthFormSearchParams = {
  email?: string;
  name?: string;
  success?: string;
  error?: string;
};

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
    <View className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-slate-200 p-10">
      <View className="w-full rounded-lg bg-white px-5 py-10">
        <Text className="mb-10 text-center text-2xl font-bold">{title}</Text>

        <View className="flex flex-col gap-5">{children}</View>
      </View>

      <View className="flex w-full flex-col gap-5 rounded-lg p-5">{optionalContent}</View>
    </View>
  );
}
