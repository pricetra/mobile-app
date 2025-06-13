import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, Feather, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Image from '@/components/ui/Image';
import { useAuth } from '@/context/UserContext';
import {
  MeDocument,
  UpdateProfileDocument,
  Address,
  FindBranchesByDistanceDocument,
  Branch,
  AddBranchToListDocument,
  GetAllListsDocument,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { createCloudinaryUrl } from '@/lib/files';

export enum WelcomePageType {
  WELCOME,
  ADDRESS,
  BRANCHES,
}

export default function WelcomeModal() {
  const { user, lists } = useAuth();
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);
  const [page, setPage] = useState<WelcomePageType>(WelcomePageType.WELCOME);
  const [addressInput, setAddressInput] = useState<string>();
  const [updateProfile, { data: profileData, loading: profileLoading }] = useMutation(
    UpdateProfileDocument,
    { refetchQueries: [MeDocument] }
  );
  const { getCurrentGeocodeAddress } = useCurrentLocation();
  const [locating, setLocating] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>();
  const [getBranches, { data: branchesData, loading: branchesLoading }] = useLazyQuery(
    FindBranchesByDistanceDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [addBranchToList] = useMutation(AddBranchToListDocument, {
    refetchQueries: [GetAllListsDocument],
  });
  const [addingBranches, setAddingBranches] = useState(false);

  useEffect(() => {
    setAddressInput(user.address?.fullAddress);

    if (!user.addressId || !user.address) {
      return setOpenWelcomeModal(true);
    }
    if (!lists.favorites.branchList || lists.favorites.branchList.length === 0) {
      return setOpenWelcomeModal(true);
    }
  }, [user, lists]);

  useEffect(() => {
    if (!profileData?.updateProfile?.address) return;

    setAddressInput(profileData.updateProfile.address.fullAddress);
  }, [profileData]);

  return (
    <Modal visible={openWelcomeModal} animationType="slide" transparent>
      <View style={{ flex: 1 }} className="bg-white">
        <ScrollView>
          <SafeAreaView>
            <KeyboardAvoidingView behavior="padding" className="p-5 pb-[5vh]">
              {page === WelcomePageType.WELCOME && (
                <View className="flex flex-col justify-center gap-5 pt-[20vh]">
                  <Text className="text-5xl font-extrabold text-pricetraGreenHeavyDark">
                    Let's Setup Your Account...
                  </Text>

                  <Text className="mb-14 text-lg text-gray-800">
                    In order to help you shop efficiently, we will need just a little more
                    information from you. This won't take long.
                  </Text>

                  <TouchableOpacity
                    onPress={() => setPage(WelcomePageType.ADDRESS)}
                    className="flex flex-row items-center justify-center gap-5 rounded-xl bg-pricetraGreenHeavyDark px-7 py-5">
                    <Octicons name="location" size={28} color="white" />
                    <Text className="text-lg font-bold color-white">Add Your Address</Text>
                  </TouchableOpacity>
                </View>
              )}

              {page === WelcomePageType.ADDRESS && (
                <View className="flex flex-col justify-center gap-5 pt-[20vh]">
                  <View className="mb-5 flex items-center">
                    <View className="flex size-[90px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                      <Octicons name="location" size={50} color="#396a12" />
                    </View>
                  </View>

                  <Text className="text-3xl font-extrabold text-pricetraGreenHeavyDark">
                    Add Your Home Address
                  </Text>

                  <Text className="mb-10 text-lg text-gray-800">
                    This let's us find prices closest to you without using you location services
                    constantly.
                  </Text>

                  <View>
                    <View className="mb-5 flex flex-row">
                      <TouchableOpacity
                        onPress={() => {
                          setLocating(true);
                          getCurrentGeocodeAddress({})
                            .then((data) => {
                              if (data.length === 0)
                                return Alert.alert(
                                  'Invalid address',
                                  'Your current location returned an invalid response'
                                );
                              let formattedAddress = data[0].formattedAddress;
                              if (!formattedAddress) {
                                formattedAddress = `${data[0].name}, ${data[0].city}, ${data[0].region} ${data[0].postalCode}`;
                              }
                              setAddressInput(formattedAddress ?? undefined);
                            })
                            .finally(() => {
                              setLocating(false);
                            });
                        }}
                        disabled={locating}
                        className="flex flex-row items-center justify-center gap-2">
                        {locating ? (
                          <>
                            <AntDesign
                              name="loading1"
                              size={18}
                              color="black"
                              className="animate-spin"
                            />
                            <Text className="font-semibold">Locating...</Text>
                          </>
                        ) : (
                          <>
                            <MaterialIcons name="my-location" size={18} color="black" />
                            <Text className="font-semibold">Locate Me</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <View className="flex-1" />
                    </View>

                    <View className="flex flex-row items-center gap-3">
                      <TextInput
                        placeholder="Zip Code or Full Address..."
                        className="flex-1 rounded-lg bg-gray-200/50 p-5 color-gray-900 placeholder:color-gray-600"
                        value={addressInput}
                        onChangeText={setAddressInput}
                        editable={!profileLoading && !locating}
                      />

                      <TouchableOpacity
                        className="flex size-[55px] items-center justify-center rounded-lg bg-pricetraGreenHeavyDark"
                        disabled={!addressInput || addressInput.trim().length <= 3}
                        onPress={() => {
                          updateProfile({
                            variables: {
                              input: { address: addressInput?.trim() },
                            },
                          }).then(({ data }) => {
                            const address = (data?.updateProfile?.address ??
                              user.address) as Address;
                            setNewAddress(address);
                            getBranches({
                              variables: {
                                lat: address.latitude,
                                lon: address.longitude,
                                radiusMeters: 9000, // ~5 miles
                              },
                            });
                            setPage(WelcomePageType.BRANCHES);
                          });
                        }}>
                        {profileLoading ? (
                          <AntDesign
                            name="loading1"
                            size={24}
                            color="white"
                            className="animate-spin"
                          />
                        ) : (
                          <Feather name="arrow-right" size={24} color="white" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {page === WelcomePageType.BRANCHES && newAddress && (
                <View className="flex flex-col justify-center gap-5 pt-[5vh]">
                  <View className="mb-5 flex items-center">
                    <View className="flex size-[90px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                      <MaterialIcons name="storefront" size={50} color="#396a12" />
                    </View>
                  </View>

                  <Text className="text-3xl font-extrabold text-pricetraGreenHeavyDark">
                    Select Nearby Places You Like to Shop
                  </Text>

                  <Text className="mb-5 text-lg text-gray-800">{newAddress.fullAddress}</Text>

                  <View className="rounded-lg bg-gray-50 p-5">
                    {branchesLoading && <ActivityIndicator size="large" color="black" />}
                    {branchesData &&
                      branchesData.findBranchesByDistance.map((branch) => (
                        <TouchableOpacity
                          disabled={addingBranches}
                          onPress={() => {
                            const foundBranch = selectedBranches.find(({ id }) => id === branch.id);
                            if (foundBranch) {
                              setSelectedBranches((branches) =>
                                branches.filter(({ id }) => id !== branch.id)
                              );
                              return;
                            }
                            setSelectedBranches((branches) => {
                              const newArr = branches.filter(({ id }) => id !== branch.id);
                              newArr.push(branch as Branch);
                              return newArr;
                            });
                          }}
                          className="mb-7 flex flex-row justify-between"
                          key={branch.id}>
                          <View className="flex flex-1 flex-row items-center gap-2">
                            <Image
                              src={createCloudinaryUrl(branch.store?.logo ?? '', 100, 100)}
                              className="size-[35px] rounded-lg"
                            />
                            <View>
                              <Text className="text font-semibold">{branch.store?.name}</Text>
                              <Text className="text-xs">{branch.address?.fullAddress}</Text>
                            </View>
                          </View>
                          <View>
                            {selectedBranches.find(({ id }) => id === branch.id) && (
                              <MaterialIcons name="check" size={24} color="#396a12" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>

                  <View className="flex flex-row items-center gap-3">
                    <TouchableOpacity
                      disabled={addingBranches}
                      onPress={() => setPage(WelcomePageType.ADDRESS)}
                      className="flex flex-row items-center justify-center gap-5 rounded-xl bg-gray-200 px-7 py-5">
                      <Text className="text-lg font-bold color-black">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={addingBranches || selectedBranches.length === 0}
                      onPress={async () => {
                        setAddingBranches(true);
                        for (const branch of selectedBranches) {
                          await addBranchToList({
                            variables: {
                              listId: lists.favorites.id,
                              branchId: branch.id,
                            },
                          });
                        }
                        setAddingBranches(false);
                        setOpenWelcomeModal(false);
                      }}
                      className="flex flex-1 flex-row items-center justify-center gap-5 rounded-xl bg-pricetraGreenHeavyDark px-7 py-5">
                      {addingBranches ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-lg font-bold color-white">Finish Setup</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ScrollView>
      </View>
    </Modal>
  );
}
