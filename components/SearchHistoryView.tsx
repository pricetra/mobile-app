import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { MySearchHistoryDocument } from 'graphql-utils';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';

import SearchKeywordItem from './SearchKeywordItem';
import { SmartPagination } from './ui/SmartPagination';

export default function SearchHistoryView() {
  const [page, setPage] = useState(1);
  const [getProducts, { data, loading, error }] = useLazyQuery(MySearchHistoryDocument, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getProducts({
      variables: {
        paginator: {
          limit: 30,
          page,
        },
      },
    });
  }, [page]);

  return (
    <ScrollView className="pt-7">
      {loading && (
        <View className="flex-row items-center justify-center px-5 py-10">
          <ActivityIndicator />
        </View>
      )}
      {error && <Text>{error.message}</Text>}
      {data?.mySearchHistory && (
        <>
          {data.mySearchHistory.searches.map(({ searchTerm, id }, i) => {
            return (
              <SearchKeywordItem
                searchTerm={searchTerm}
                onPress={() => {
                  const sp = new URLSearchParams();
                  sp.set('query', encodeURIComponent(searchTerm.trim()));
                  router.push(`/(tabs)/search?${sp.toString()}`);
                }}
                key={`sh-${id}`}
              />
            );
          })}

          {data.mySearchHistory.paginator.numPages > 1 && (
            <View className="mt-10">
              <SmartPagination
                paginator={data.mySearchHistory.paginator}
                onPageChange={(p) => setPage(p)}
              />
            </View>
          )}
        </>
      )}

      <View className="h-[200px]" />
    </ScrollView>
  );
}
