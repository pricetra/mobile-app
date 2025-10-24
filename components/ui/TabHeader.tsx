import { useQuery } from '@apollo/client';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle, Text } from 'react-native';

import TabHeaderContainer, { navConsts } from './TabHeaderContainer';
import TabHeaderSearchBar from './TabHeaderSearchBar';

import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import { CountGroceryListItemsDocument } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type TabHeaderProps = BottomTabHeaderProps;

export default function TabHeader(_props: TabHeaderProps) {
  const { user } = useAuth();
  const { subHeader } = useHeader();
  const { search, handleSearch, setSearching, searching, searchOpen, setSearchOpen } =
    useContext(SearchContext);

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: navConsts.padding,
    paddingHorizontal: navConsts.padding + 5,
  };

  const { data: groceryListItemCount } = useQuery(CountGroceryListItemsDocument, {
    fetchPolicy: 'no-cache',
    variables: { includeCompleted: false },
  });

  return (
    <TabHeaderContainer subHeader={subHeader}>
      {searchOpen ? (
        <TabHeaderSearchBar
          onBackPressed={() => {
            handleSearch(null);
            setSearchOpen(false);
            if (searching) setSearching(false);
          }}
          logoHeight={navConsts.logoHeight}
          padding={navConsts.padding}
          iconStyles={iconStyles}
          iconColor={navConsts.iconColor}
          iconSize={navConsts.iconSize}
          updateSearch={handleSearch}
          searchText={search}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/grocery-list', { relativeToDirectory: false })}
            style={iconStyles}
            className="relative">
            <FontAwesome5
              name="shopping-basket"
              size={navConsts.iconSize - 2}
              color={navConsts.iconColor}
            />

            {groceryListItemCount && (
              <View className="absolute right-0 top-1.5 flex size-6 items-center justify-center rounded-full bg-[#e7f8d0] ">
                <Text className="text-xs color-pricetraGreenHeavyDark">
                  {groceryListItemCount.countGroceryListItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/', { relativeToDirectory: false })}
            className="flex w-full flex-1 items-center justify-center"
            style={iconStyles}>
            {process.env.NODE_ENV === 'development' ? (
              <Image
                source={require('@/assets/images/logotype_header_black_dev.svg')}
                style={{ height: navConsts.logoHeight, width: 119.21 }}
              />
            ) : (
              <Image
                source={require('@/assets/images/logotype_header_black.svg')}
                style={{ height: navConsts.logoHeight, width: 119.21 }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/(profile)', { relativeToDirectory: false })}
            style={iconStyles}>
            {user.avatar ? (
              <Image
                source={{
                  uri: createCloudinaryUrl(
                    user.avatar,
                    2 * navConsts.iconSize,
                    2 * navConsts.iconSize
                  ),
                }}
                style={{
                  width: navConsts.iconSize + 2,
                  height: navConsts.iconSize + 2,
                  borderRadius: 20,
                }}
              />
            ) : (
              <Feather size={navConsts.iconSize} name="user" color={navConsts.iconColor} />
            )}
          </TouchableOpacity>
        </>
      )}
    </TabHeaderContainer>
  );
}
