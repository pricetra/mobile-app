import { useLazyQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react-native';
import { useContext, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import ProductItem, { ProductLoadingItem } from '@/components/ProductItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { UserAuthContext } from '@/context/UserContext';
import { AllProductsDocument } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const { token } = useContext(UserAuthContext);
  const [getAllProducts, { data: productsData, loading: productsLoading, error: productsError }] =
    useLazyQuery(AllProductsDocument);

  function fetchAllProducts() {
    getAllProducts({
      context: { headers: { authorization: `Bearer ${token}` } },
    });
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <ScrollView>
      <View className="p-5 py-36">
        {productsError && (
          <Alert icon={AlertTriangle} variant="destructive" className="mb-10 max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{productsError.message}</AlertDescription>
          </Alert>
        )}
        {productsLoading &&
          Array(10)
            .fill(0)
            .map((_, i) => <ProductLoadingItem key={i} />)}

        <View className="max-w-full">
          {productsData &&
            productsData.allProducts.map((product) => (
              <ProductItem product={product} key={product.code} />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
