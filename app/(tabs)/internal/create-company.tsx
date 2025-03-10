import { useMutation } from '@apollo/client';
import { upload } from 'cloudinary-react-native';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image } from 'react-native';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateCompanyDocument } from '@/graphql/types/graphql';
import { cloudinary } from '@/lib/files';

export default function CreateCompanyScreen() {
  const [name, setName] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [logoFileUri, setLogoFileUri] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [createCompany, { data, error, loading: dataLoading }] = useMutation(CreateCompanyDocument);

  const loading = uploading || dataLoading;

  useEffect(() => {
    if (!data) return;
    alert(`Company created: ${data.createCompany.name}`);
    setName(undefined);
    setWebsite(undefined);
    setLogoFileUri(undefined)
  }, [data]);

  useEffect(() => {
    if (!error) return;
    alert(error);
  }, [error]);

  function create() {
    if (!name || !website || !logoFileUri) return;

    setUploading(true);

    const upload_id = randomUUID();
    upload(cloudinary, {
      file: logoFileUri,
      options: {
        public_id: upload_id,
        tags: ['COMPANY_LOGO'],
      },
      callback: async (err, res) => {
        if (err) {
          alert(err);
          return;
        }

        createCompany({
          variables: {
            input: {
              name,
              website,
              logo: upload_id,
            },
          },
        });
        setUploading(false);
      },
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
    if (!picture || !picture.uri) return alert('could not process image');

    setLogoFileUri(picture.uri);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-5">
          <Text className="mb-10 text-2xl font-bold">Add company</Text>

          <View className="flex flex-col gap-3">
            <Input
              placeholder="Company name"
              onChangeText={setName}
              value={name}
              autoCorrect
              editable={!loading}
            />

            <Input
              placeholder="Website (https://example.com)"
              onChangeText={setWebsite}
              value={website}
              autoCapitalize="none"
              textContentType="URL"
              keyboardType="default"
              autoCorrect={false}
              autoComplete="url"
              editable={!loading}
            />

            {logoFileUri && <Image source={{ uri: logoFileUri }} className="size-28 rounded-lg" />}

            <Button onPress={selectLogo} loading={loading}>
              {logoFileUri ? 'Use another image' : 'Upload logo'}
            </Button>
          </View>

          <Button onPress={create} className="mt-10" loading={loading}>
            Create
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
