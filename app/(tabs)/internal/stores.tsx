import { useMutation, useQuery } from '@apollo/client';
import { upload } from 'cloudinary-react-native';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AllCompaniesDocument, CreateCompanyDocument } from '@/graphql/types/graphql';
import { cloudinary } from '@/lib/files';
import { Pressable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import CompanyItem, { CompanyItemLoading } from '@/components/CompanyItem';

export default function CreateCompanyScreen() {
  const [name, setName] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [logoFileUri, setLogoFileUri] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [createCompany, { data, error, loading: dataLoading }] = useMutation(
    CreateCompanyDocument,
    { refetchQueries: [AllCompaniesDocument] }
  );
  const { data: allCompaniesData, loading: allCompaniesLoading } = useQuery(AllCompaniesDocument);

  const loading = uploading || dataLoading;

  useEffect(() => {
    if (!data) return;

    setName(undefined);
    setWebsite(undefined);
    setLogoFileUri(undefined);
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
      <ScrollView className="h-full p-5">
        <View>
          <View className="flex flex-row gap-3">
            <TouchableOpacity onPress={selectLogo}>
              {logoFileUri ? (
                <Image source={{ uri: logoFileUri }} className="size-[93px] rounded-lg" />
              ) : (
                <View className="flex size-[93px] items-center justify-center rounded-md bg-gray-400">
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
            </View>
          </View>

          <Button
            onPress={create}
            className="mt-5"
            loading={loading}
            disabled={!name || !logoFileUri || !website}>
            Create store
          </Button>
        </View>

        <View className="my-20">
          {allCompaniesLoading && (
            <View>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <CompanyItemLoading key={i} />
                ))}
            </View>
          )}
          {allCompaniesData &&
            allCompaniesData.allCompanies.map((c) => <CompanyItem {...c} key={c.id} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
