import { useLazyQuery } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';

import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import { FindStoreDocument } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedStoreScreen() {
  const { id } = useLocalSearchParams();
  const [findStore, { data: storeData, loading: storeLoading, error: storeError }] =
    useLazyQuery(FindStoreDocument);

  useEffect(() => {
    if (!id || typeof id !== 'string') return router.back();
    findStore({
      variables: { id },
    });
  }, [id]);

  return (
    <SafeAreaView>
      <ScrollView className="p-5">
        <View>
          {storeLoading && <StoreItemLoading />}
          {storeData && <StoreItem {...storeData?.findStore} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
