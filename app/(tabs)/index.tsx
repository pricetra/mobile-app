import { useLazyQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react-native';
import { useContext, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserAuthContext } from '@/context/UserContext';
import { AllProductsDocument } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const { token } = useContext(UserAuthContext);
  const [getAllProducts, { data: productsData, loading: productsLoading, error: productsError }] =
    useLazyQuery(AllProductsDocument);

  useEffect(() => {
    getAllProducts({
      context: { headers: { authorization: `Bearer ${token}` } },
    });
  }, []);

  return (
    <ScrollView>
      <View className="p-5 pb-24">
        {productsError && (
          <Alert icon={AlertTriangle} variant="destructive" className="mb-10 max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{productsError.message}</AlertDescription>
          </Alert>
        )}
        {productsLoading &&
          Array(10)
            .fill(0)
            .map((i) => (
              <View className="mb-10 flex flex-row items-center gap-4" key={i}>
                <Skeleton className="size-28 rounded-lg" />
                <View className="gap-2">
                  <Skeleton className="h-4 max-w-[250px]" />
                  <Skeleton className="h-4 max-w-[200px]" />
                </View>
              </View>
            ))}

        <View className="max-w-full">
          {productsData &&
            productsData.allProducts.map(({ id, name, image }) => (
              <View className="mb-10 flex max-w-full flex-row gap-2" key={id}>
                {image !== '' && (
                  <Image
                    source={{
                      uri: image,
                    }}
                    className="size-28 rounded-lg"
                  />
                )}
                <View className="max-w-full flex-1 gap-2 p-2">
                  <Text className="font-bold">{name}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
