import { useLazyQuery, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import Btn from '@/components/ui/Btn';
import Combobox from '@/components/ui/Combobox';
import {
  AddGroceryListItemDocument,
  CategorySearchDocument,
  CountGroceryListItemsDocument,
  CreateGroceryListItemInput,
  DefaultGroceryListItemsDocument,
  GroceryListItemsDocument,
  WeightComponentsFromCategoryIdDocument,
} from '@/graphql/types/graphql';
import { parseWeight } from '@/lib/strings';

export type AddGroceryListItemProps = {
  groceryListId: number;
  onSuccess: () => void;
};

export default function AddGroceryListItem({ groceryListId, onSuccess }: AddGroceryListItemProps) {
  const [categorySearch, { data: categorySearchData, loading: categorySearchLoading }] =
    useLazyQuery(CategorySearchDocument, { fetchPolicy: 'no-cache' });
  const [weightComponents, { data: weightComponentsData, loading: weightComponentsLoading }] =
    useLazyQuery(WeightComponentsFromCategoryIdDocument, { fetchPolicy: 'no-cache' });
  const [addItem, { loading: addingItem }] = useMutation(AddGroceryListItemDocument, {
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string }>();
  const [selectedWeight, setSelectedWeight] = useState<string>();

  useEffect(() => {
    if (!selectedCategory?.id) return;
    weightComponents({ variables: { categoryId: selectedCategory.id } });
  }, [selectedCategory?.id]);

  return (
    <Formik
      initialValues={{} as CreateGroceryListItemInput}
      onSubmit={(input) => {
        console.log(input);
        addItem({
          variables: {
            groceryListId,
            input,
          },
        })
          .then((data) => {
            if (!data) return;
            onSuccess();
          })
          .catch((err) => console.log(err));
      }}>
      {(formik) => (
        <View>
          <Combobox
            dataSet={
              categorySearchData?.categorySearch?.map(({ id, name }) => ({
                id: String(id),
                title: name,
              })) ?? []
            }
            onChangeText={(search) =>
              categorySearch({ variables: { search, quickSearchMode: true } })
            }
            showChevron={false}
            debounce={600}
            loading={categorySearchLoading}
            useFilter={false}
            onSelectItem={(data) => {
              if (!data) return;
              setSelectedCategory({ id: +data.id, name: data.title! });
              formik.setFieldValue('category', data.title);
            }}
            textInputProps={{
              placeholder: 'Search',
            }}
            renderItem={(item) => (
              <View className="flex flex-row items-center gap-2 p-3">
                <Text>{item.title}</Text>
              </View>
            )}
          />

          {selectedCategory?.id && (
            <Combobox
              dataSet={
                weightComponentsData?.weightComponentsFromCategoryId?.map(
                  ({ weightValue, weightType }) => ({
                    id: `${weightValue} ${weightType}`,
                    title: `${weightValue} ${weightType}`,
                  })
                ) ?? []
              }
              loading={weightComponentsLoading}
              onSelectItem={(data) => {
                if (!data) return;
                setSelectedWeight(data.id);
                const weightComponents = parseWeight(data.id);
                formik.setFieldValue('weight', weightComponents.weightValue);
                formik.setFieldValue('unit', weightComponents.weightType);
              }}
              textInputProps={{
                placeholder: 'Select Weight',
              }}
            />
          )}

          <View className="mt-10">
            <Btn
              text="Add"
              icon={<Ionicons name="add" size={24} color="white" />}
              onPress={formik.submitForm}
              disabled={!selectedCategory}
              loading={addingItem}
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      )}
    </Formik>
  );
}
