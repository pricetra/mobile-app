import { ApolloError, useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import Btn from './ui/Btn';

import { Input } from '@/components/ui/Input';
import { AllStoresDocument, CreateStoreDocument, CreateStoreMutation } from 'graphql-utils';

export type CreateStoreFormProps = {
  onSuccess?: (data: CreateStoreMutation) => void;
  onError?: (err: ApolloError) => void;
  onCloseModal: () => void;
};

export default function CreateStoreForm({
  onSuccess,
  onError,
  onCloseModal,
}: CreateStoreFormProps) {
  const [name, setName] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [logoFileUri, setLogoFileUri] = useState<string>();
  const [logoBase64, setLogoBase64] = useState<string>();

  const [createStore, { loading }] = useMutation(CreateStoreDocument, {
    refetchQueries: [AllStoresDocument],
  });

  function create() {
    if (!name || !website || !logoFileUri || !logoBase64) return;

    createStore({
      variables: {
        input: {
          name,
          website,
          logoBase64,
        },
      },
    })
      .then(({ data }) => {
        if (!data) return;

        if (onSuccess) onSuccess(data);
        setName(undefined);
        setWebsite(undefined);
        setLogoFileUri(undefined);
      })
      .catch((err) => {
        if (onError) onError(err);
      });
  }

  async function selectLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.uri || !picture.base64) return alert('could not process image');

    setLogoFileUri(picture.uri);
    setLogoBase64(`data:image/jpeg;base64,${picture.base64}`);
  }

  return (
    <View>
      <TouchableOpacity onPress={selectLogo} className="mb-3">
        {logoFileUri ? (
          <Image source={{ uri: logoFileUri }} className="size-[93px] rounded-xl" />
        ) : (
          <View className="flex size-[93px] items-center justify-center rounded-xl bg-gray-400">
            <Feather name="camera" color="white" size={35} />
          </View>
        )}
      </TouchableOpacity>

      <View className="flex flex-1 flex-col gap-3">
        <Input
          placeholder="Store name"
          onChangeText={setName}
          value={name}
          autoCorrect
          editable={!loading}
          autoFocus
          autoCapitalize="words"
        />

        <Input
          placeholder="Website (https://example.com)"
          onChangeText={setWebsite}
          value={website}
          autoCapitalize="none"
          textContentType="URL"
          keyboardType="default"
          autoComplete="url"
          editable={!loading}
        />
      </View>

      <View className="mt-10 flex flex-row items-center gap-3">
        <Btn
          onPress={onCloseModal}
          disabled={loading}
          text="Cancel"
          size="md"
          bgColor="bg-gray-100"
          color="text-gray-700"
        />

        <View className="flex-1">
          <Btn
            onPress={create}
            loading={loading}
            disabled={!name || !logoFileUri || !website}
            size="md"
            text="Create Store"
          />
        </View>
      </View>

      <View style={{ height: 50 }} />
    </View>
  );
}
