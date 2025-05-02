import { useMutation } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';

import AllProductBillingData from '@/components/profile/AllProductBillingData';
import ProfileSmall from '@/components/profile/ProfileSmall';
import { UserAuthContext } from '@/context/UserContext';
import { UpdateProfileDocument, User } from '@/graphql/types/graphql';
import { getApolloUploadObject } from '@/lib/files';

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
    if (!picture || !picture.uri) return;

    const file = getApolloUploadObject(picture);
    console.log(file);
    updateProfileDocument({
      variables: {
        input: {
          avatarFile: file,
        },
      },
    })
      .then(({ errors, data }) => {
        if (errors || !data) {
          console.error(errors);
          return;
        }
        updateUser({ ...data.updateProfile } as User);
      })
      .catch((err) => console.error(err));

    // const upload_id = randomUUID();
    // upload(cloudinary, {
    //   file: picture.uri,
    //   options: {
    //     public_id: upload_id,
    //     tags: ['USER_PROFILE'],
    //   },
    //   callback: (err) => {
    //     if (err) {
    //       Alert.alert('Upload Failed', err.message);
    //       return;
    //     }
    //     updateProfileDocument({
    //       variables: {
    //         input: {
    //           avatarFile: picture.uri,
    //         },
    //       },
    //     }).then(({ errors, data }) => {
    //       if (errors || !data) {
    //         console.error(errors);
    //         return;
    //       }
    //       updateUser({ ...data.updateProfile } as User);
    //     });
    //   },
    // });
  }

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
      <View className="p-5 pb-3">
        <ProfileSmall user={user} selectProfileAvatar={selectProfileAvatar} />
      </View>

      <AllProductBillingData />
    </SafeAreaView>
  );
}
