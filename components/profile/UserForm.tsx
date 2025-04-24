import { ApolloError, useMutation } from '@apollo/client';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image as NativeImage } from 'react-native';

import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import Combobox from '@/components/ui/Combobox';
import Image from '@/components/ui/Image';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import {
  User,
  GetAllUsersDocument,
  UpdateUserFull,
  UserRole,
  UpdateUserByIdDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl, uploadToCloudinary } from '@/lib/files';
import { enumToNormalizedString } from '@/lib/strings';
import { diffObjects } from '@/lib/utils';

const roles = [UserRole.SuperAdmin, UserRole.Admin, UserRole.Contributor, UserRole.Consumer];

export type ProductFormProps = {
  user: User;
  onCancel: () => void;
  onSuccess: (user: User) => void;
  onError: (e: ApolloError) => void;
};

export default function UserForm({ user, onCancel, onSuccess, onError }: ProductFormProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [updateProfile, { loading: updateLoading }] = useMutation(UpdateUserByIdDocument, {
    refetchQueries: [GetAllUsersDocument],
  });
  const loading = updateLoading || imageUploading;

  useEffect(() => {
    if (!user) return;

    if (user.avatar && user.avatar !== '') {
      setImageUri(createCloudinaryUrl(user.avatar, 200, 200));
    } else {
      setImageUri(undefined);
    }
  }, [user]);

  async function selectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
      allowsMultipleSelection: false,
      cameraType: ImagePicker.CameraType.back,
    });

    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.uri) return alert('could not process image');

    setImageUpdated(true);
    setImageUri(picture.uri);
  }

  function submit(input: UpdateUserFull) {
    if (imageUri && imageUpdated) input.avatar = randomUUID();

    const filteredInput = diffObjects(input, user);
    if (Object.keys(filteredInput).length === 0) return;

    updateProfile({
      variables: {
        userId: user.id,
        input: filteredInput,
      },
    })
      .then(({ data, errors }) => {
        if (errors) return onError(errors.at(0) as ApolloError);
        if (!data) return;

        if (imageUri && imageUpdated) {
          setImageUploading(true);
          uploadToCloudinary({
            file: imageUri,
            public_id: input.avatar ?? randomUUID(),
            tags: ['PRODUCT'],
            onSuccess: () => onSuccess(data.updateUserById),
            onError: (e) => onError(e as unknown as ApolloError),
            onFinally: () => setImageUploading(false),
          });
        } else {
          onSuccess(data.updateUserById);
        }
      })
      .catch((e) => onError(e));
  }

  function renderImageSelection() {
    if (imageUri) {
      return <Image src={imageUri} className="size-28 rounded-full" />;
    }
    return (
      <NativeImage
        source={require('@/assets/images/no_avatar.jpg')}
        className="size-28 rounded-full"
      />
    );
  }

  return (
    <Formik
      initialValues={
        {
          email: user?.email ?? '',
          name: user?.name ?? '',
          role: user?.role ?? UserRole.Consumer,
          active: user?.active ?? false,
        } as UpdateUserFull
      }
      onSubmit={submit}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View className="flex flex-col gap-5">
          <TouchableOpacity onPress={!loading ? selectImage : () => {}}>
            {renderImageSelection()}
          </TouchableOpacity>

          {user && <Input value={user.id.toString()} label="User ID" editable={false} readOnly />}

          <Input
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email ?? ''}
            label="Email"
            inputMode="email"
            keyboardType="email-address"
            editable={!loading}
          />

          <Input
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name ?? ''}
            label="Full Name"
            editable={!loading}
          />

          <View>
            <Label className="mb-1">Role</Label>
            <Combobox
              dataSet={roles.map((r) => ({ id: r, title: enumToNormalizedString(r) }))}
              initialValue={values.role ?? UserRole.Consumer}
              showClear={false}
              onSelectItem={(item) => {
                if (!item) return;
                setFieldValue('role', item.id);
              }}
            />
          </View>

          <Checkbox
            checked={values.active ?? false}
            onCheckedChange={(val) => setFieldValue('active', val)}
            label="Active"
          />

          <View className="my-10 flex flex-row justify-between gap-3">
            <Button onPress={onCancel} disabled={loading} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onPress={() => handleSubmit()}
              loading={loading}
              variant="secondary"
              className="flex-1">
              {user ? 'Update' : 'Create'}
            </Button>
          </View>

          <View className="h-[100px]" />
        </View>
      )}
    </Formik>
  );
}
