import { ApolloError, useMutation } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image as NativeImage, Platform } from 'react-native';

import Label from '../ui/Label';
import Textarea from '../ui/Textarea';

import Btn from '@/components/ui/Btn';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { Input } from '@/components/ui/Input';
import {
  User,
  GetAllUsersDocument,
  UpdateProfileDocument,
  UpdateUser,
  MeDocument,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { diffObjects } from '@/lib/utils';

export type ProfileFormProps = {
  user: User;
  onCancel: () => void;
  onSuccess: (user: User) => void;
  onError: (e: ApolloError) => void;
};

const MIN_BIRTH_DATE = dayjs(new Date()).subtract(100, 'year').toDate();
const MAX_BIRTH_DATE = dayjs(new Date()).subtract(10, 'year').toDate();

export default function ProfileForm({ user, onCancel, onSuccess, onError }: ProfileFormProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [imageBase64, setImageBase64] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updateProfile, { loading }] = useMutation(UpdateProfileDocument, {
    refetchQueries: [GetAllUsersDocument, MeDocument],
  });

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
      base64: true,
      allowsMultipleSelection: false,
      cameraType: ImagePicker.CameraType.back,
    });

    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.uri || !picture.base64) return alert('could not process image');

    setImageUpdated(true);
    setImageUri(picture.uri);
    setImageBase64(picture.base64);
  }

  function submit(input: UpdateUser) {
    if (imageUri && imageBase64 && imageUpdated) input.avatarBase64 = imageBase64;

    const filteredInput = diffObjects<UpdateUser>(input, user as any);
    if (Object.keys(filteredInput).length === 0) return;

    updateProfile({
      variables: {
        input: filteredInput,
      },
    })
      .then(({ data, errors }) => {
        if (errors) return onError(errors.at(0) as ApolloError);
        if (!data) return;

        onSuccess(data.updateProfile as User);
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
          name: user?.name ?? '',
          address: user?.address?.fullAddress ?? '',
          birthDate: user?.birthDate ? dayjs(user?.birthDate).toDate() : undefined,
          bio: user?.bio,
        } as UpdateUser
      }
      onSubmit={submit}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View className="flex flex-col gap-5">
          <TouchableOpacity onPress={!loading ? selectImage : () => {}}>
            {renderImageSelection()}
          </TouchableOpacity>

          <Input
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name ?? ''}
            label="Full Name"
            placeholder="Full name (Ex. John Smith)"
            editable={!loading}
          />

          <Input
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            value={values.address ?? ''}
            placeholder="Zip code, State, or Full address"
            label="Address"
            editable={!loading}
          />

          <View>
            <Label className="mb-2">Birth Date</Label>
            <Button
              onPress={() => {
                setShowDatePicker(!showDatePicker);
              }}>
              {values.birthDate
                ? dayjs.utc(values.birthDate).format('MMM D, YYYY')
                : 'Select Birth Date'}
            </Button>

            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={values.birthDate ?? MAX_BIRTH_DATE}
                display="spinner"
                onChange={({ nativeEvent: e }) => {
                  setFieldValue('birthDate', new Date(e.timestamp));
                  if (Platform.OS === 'android') setShowDatePicker(false);
                }}
                minimumDate={MIN_BIRTH_DATE}
                accentColor="black"
                textColor="black"
                maximumDate={MAX_BIRTH_DATE}
              />
            )}
          </View>

          <Textarea
            onChangeText={handleChange('bio')}
            onBlur={handleBlur('bio')}
            value={values.bio ?? ''}
            label="Bio"
            editable={!loading}
          />

          <View className="mt-5 flex flex-row justify-between gap-3">
            <Btn
              onPress={onCancel}
              disabled={loading}
              size="md"
              bgColor="bg-gray-100"
              color="text-gray-700"
              text="Cancel"
            />

            <View className="flex-1">
              <Btn
                onPress={() => handleSubmit()}
                loading={loading}
                size="md"
                text={user ? 'Update' : 'Create'}
              />
            </View>
          </View>

          <View className="h-[100px]" />
        </View>
      )}
    </Formik>
  );
}
