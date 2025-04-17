import { useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { upload } from 'cloudinary-react-native';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { AlertTriangle } from 'lucide-react-native';
import { useContext, useState } from 'react';
import { SafeAreaView, Text, View, Image, Pressable, ScrollView } from 'react-native';

import { createCloudinaryUrl } from '../../lib/files';

import AllProductBillingData from '@/components/profile/AllProductBillingData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { UserAuthContext } from '@/context/UserContext';
import { UpdateProfileDocument, User } from '@/graphql/types/graphql';
import { getFileBlobFromUri, cloudinary } from '@/lib/files';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useContext(UserAuthContext);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [updateProfileDocument, { error: updateProfileError }] = useMutation(UpdateProfileDocument);

  async function selectProfileAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (result.canceled || result.assets.length === 0) return alert('could not pick image');

    const picture = result.assets.at(0);
    if (!picture || !picture.uri) return alert('could not process image');

    const upload_id = randomUUID();
    upload(cloudinary, {
      file: picture.uri,
      options: {
        public_id: upload_id,
        tags: ['USER_PROFILE'],
      },
      callback: (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        updateProfileDocument({
          variables: {
            input: {
              avatar: upload_id,
            },
          },
        }).then(({ errors, data }) => {
          if (errors || !data) {
            console.error(errors);
            return;
          }
          updateUser({ ...data.updateProfile } as User);
        });
      },
    });
  }

  return (
    <ScrollView>
      <SafeAreaView style={{ minHeight: '100%' }}>
        <View className="p-5">
          {updateProfileError && (
            <Alert icon={AlertTriangle} variant="destructive" className="mb-10 max-w-xl">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{updateProfileError.message}</AlertDescription>
            </Alert>
          )}

          <View className="flex flex-row items-center justify-start gap-3">
            <Pressable onPress={selectProfileAvatar}>
              {user.avatar ? (
                <Image
                  source={{
                    uri: createCloudinaryUrl(user.avatar, 100, 100),
                  }}
                  className="size-16 rounded-full"
                />
              ) : (
                <View className="flex size-16 items-center justify-center rounded-full bg-gray-300">
                  <Feather name="user" size={35} />
                </View>
              )}
            </Pressable>

            <View className="flex flex-col gap-1">
              <Text className="text-lg font-bold">{user.name}</Text>
              <Text className="text-sm">{user.email}</Text>
            </View>
          </View>

          <View className="mt-5">
            <Button
              onPress={() => {
                setLogoutLoading(true);
                logout();
              }}
              loading={logoutLoading}
              variant="secondary"
              size="sm">
              Logout
            </Button>
          </View>
        </View>

        <AllProductBillingData />
      </SafeAreaView>
    </ScrollView>
  );
}
