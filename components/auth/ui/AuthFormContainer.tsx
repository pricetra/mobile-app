import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';

import Btn from '@/components/ui/Btn';

export type AuthFormContainerProps = {
  title: string;
  buttonLabel: string;
  description?: string;
  error?: string;
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  extras?: ReactNode;
  onPressSubmit?: () => void;
  onPressApple?: () => void;
  onPressGoogle?: () => void;
};

export default function AuthFormContainer({
  title,
  buttonLabel,
  description,
  error,
  children,
  disabled,
  loading,
  extras,
  onPressSubmit,
  onPressApple,
  onPressGoogle,
}: AuthFormContainerProps) {
  return (
    <ScrollView className="h-screen w-screen bg-white p-5 sm:bg-muted md:p-10">
      <SafeAreaView>
        <View className="w-full max-w-sm">
          <View className="my-10 flex flex-col gap-6">
            <View className="mb-0 flex flex-row items-center justify-center sm:mb-2">
              <Image
                source={require('@/assets/images/logotype_header_black.svg')}
                style={{ height: 30, width: 155.5 }}
              />
            </View>

            <View className="border-0 shadow-none sm:border sm:shadow">
              <View className="px-2 py-6 sm:p-6">
                <View className="px-3 py-5 md:px-5 md:py-7">
                  <View className="flex flex-col gap-6">
                    <View className="mb-3 flex flex-col">
                      <Text className="text-3xl font-bold">{title}</Text>
                      {description && (
                        <Text className="mt-1 leading-5 text-gray-500">{description}</Text>
                      )}
                    </View>

                    {children}

                    <View className="mt-2">
                      {error && (
                        <View className="mb-5">
                          <Text className="text-red-700">{error}</Text>
                        </View>
                      )}

                      <Btn
                        text={buttonLabel}
                        onPress={onPressSubmit}
                        loading={loading}
                        disabled={disabled}
                      />
                    </View>

                    {onPressApple && onPressGoogle && (
                      <>
                        <View className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                          <Text className="relative z-10 px-2 text-center text-gray-500">
                            Or continue with
                          </Text>
                        </View>
                        <View className="flex flex-row items-center justify-between gap-4">
                          <TouchableOpacity
                            onPress={onPressApple}
                            className="flex flex-1 flex-row justify-center rounded-xl border-[1px] border-gray-200 bg-white px-10 py-3">
                            <AntDesign name="apple1" size={20} color="black" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={onPressGoogle}
                            className="flex flex-1 flex-row justify-center rounded-xl border-[1px] border-gray-200 bg-white px-10 py-3">
                            <AntDesign name="google" size={20} color="black" />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {extras && extras}
                  </View>
                </View>
              </View>
            </View>
            <Text className="text-ms text-balance px-5 text-center text-gray-500">
              By clicking continue, you agree to our{' '}
              <Text
                onPress={() => Linking.openURL('https://pricetra.com/terms')}
                className="text-gray-800 underline underline-offset-4">
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                onPress={() => Linking.openURL('https://pricetra.com/privacy')}
                className="text-gray-800 underline underline-offset-4">
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
