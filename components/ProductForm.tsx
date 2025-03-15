import { Formik } from 'formik';
import { View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { Product } from '@/graphql/types/graphql';
import Button from '@/components/ui/Button';
import { CreateProduct } from '../graphql/types/graphql';
import { Textarea } from '@/components/ui/Textarea';

export type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  return (
    <Formik
      initialValues={
        {
          name: product?.name ?? '',
          description: product?.description ?? '',
          url: product?.url,
          brand: product?.brand ?? '',
          code: product?.code ?? '',
          color: product?.color,
          model: product?.model,
          category: product?.category,
          weight: product?.weight,
          lowestRecordedPrice: product?.lowestRecordedPrice,
          highestRecordedPrice: product?.highestRecordedPrice,
        } as CreateProduct
      }
      onSubmit={(values) => console.log(values)}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View className="flex flex-col gap-5">
          <Textarea
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            label="Product Name"
          />

          <Textarea
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            label="Description"
          />

          <Input
            onChangeText={handleChange('url')}
            onBlur={handleBlur('url')}
            value={values.url ?? ''}
            label="URL"
          />

          <Input
            onChangeText={handleChange('brand')}
            onBlur={handleBlur('brand')}
            value={values.brand}
            label="Brand"
          />

          <Input
            onChangeText={handleChange('code')}
            onBlur={handleBlur('code')}
            value={values.code}
            label="UPC Code"
          />

          <Input
            onChangeText={handleChange('color')}
            onBlur={handleBlur('color')}
            value={values.color ?? ''}
            label="Color"
          />

          <Input
            onChangeText={handleChange('model')}
            onBlur={handleBlur('model')}
            value={values.model ?? ''}
            label="Model"
          />

          <Input
            onChangeText={handleChange('category')}
            onBlur={handleBlur('category')}
            value={values.category ?? ''}
            label="Category"
          />
          <Input
            onChangeText={handleChange('weight')}
            onBlur={handleBlur('weight')}
            value={values.weight ?? ''}
            label="Weight"
          />
          <Input
            onChangeText={handleChange('lowestRecordedPrice')}
            onBlur={handleBlur('lowestRecordedPrice')}
            value={(values.lowestRecordedPrice ?? 0).toString()}
            label="Lowest recorded price"
          />
          <Input
            onChangeText={handleChange('highestRecordedPrice')}
            onBlur={handleBlur('highestRecordedPrice')}
            value={(values.highestRecordedPrice ?? 0).toString()}
            label="Highest recoded price"
          />

          <Button onPress={handleSubmit}>Update</Button>
        </View>
      )}
    </Formik>
  );
}
