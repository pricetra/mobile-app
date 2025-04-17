import { useMutation } from '@apollo/client';
import { upload } from 'cloudinary-react-native';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { useContext } from 'react';
import { SafeAreaView, View, ScrollView, Alert } from 'react-native';

import AllProductBillingData from '@/components/profile/AllProductBillingData';
import ProfileSmall from '@/components/profile/ProfileSmall';
import { UserAuthContext } from '@/context/UserContext';
import { UpdateProfileDocument, User } from '@/graphql/types/graphql';
import { cloudinary } from '@/lib/files';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useContext(UserAuthContext);
  const [updateProfileDocument] = useMutation(UpdateProfileDocument);

  async function selectProfileAvatar() {
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

    const upload_id = randomUUID();
    upload(cloudinary, {
      file: picture.uri,
      options: {
        public_id: upload_id,
        tags: ['USER_PROFILE'],
      },
      callback: (err) => {
        if (err) {
          Alert.alert('Upload Failed', err.message);
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
          <ProfileSmall user={user} selectProfileAvatar={selectProfileAvatar} />
        </View>

        <AllProductBillingData />
      </SafeAreaView>
    </ScrollView>
  );
}
