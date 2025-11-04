import { ReactNode } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';

export type TabHeaderContainerProps = {
  subHeader?: ReactNode;
  children: ReactNode;
};

const iconSize = 20;
const logoHeight = 23;
const padding = 15;

export const navConsts = {
  iconSize,
  logoHeight,
  padding,
  navHeight: 2 * padding + logoHeight,
  iconColor: '#333',
};

export default function TabHeaderContainer({ children, subHeader }: TabHeaderContainerProps) {
  return (
    <SafeAreaView className="flex w-full bg-white shadow shadow-black/10">
      <View
        className="w-full flex-row items-center justify-between gap-3"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: navConsts.navHeight }}>
        {children}
      </View>
      {subHeader && <View>{subHeader}</View>}
    </SafeAreaView>
  );
}
