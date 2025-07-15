import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Alert, Text } from 'react-native';

import AdminProductBilling from '@/components/profile/AdminProductBilling';
import ProfileLarge, { ProfileLargeLoading } from '@/components/profile/ProfileLarge';
import ProfileMini from '@/components/profile/ProfileMini';
import UserForm from '@/components/profile/UserForm';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { SearchContext } from '@/context/SearchContext';
import { UserAuthContext } from '@/context/UserContext';
import { GetAllUsersDocument, User, UserFilter, UserRole } from '@/graphql/types/graphql';
import { isRoleAuthorized } from '@/lib/roles';

export type SearchTypes = 'id' | 'email' | 'name' | 'role';

export default function UsersScreen() {
  const navigation = useNavigation();
  const { user } = useContext(UserAuthContext);
  const { search } = useContext(SearchContext);
  const [loadUsers, { data: users, loading, fetchMore }] = useLazyQuery(GetAllUsersDocument);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const limit = 50;
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilter>();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            showSearch
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <Feather name="users" size={20} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  Users
                </Text>
              </View>
            }
          />
        ),
      });
      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [])
  );

  useEffect(() => {
    if (!isRoleAuthorized(UserRole.Admin, user.role)) return router.replace('/');
  }, [user]);

  useEffect(() => {
    loadUsers({
      variables: {
        paginator: {
          limit,
          page,
        },
        filters,
      },
    });
  }, [page, limit, filters]);

  useEffect(() => {
    if (search && search?.trim() === '') return;

    if (!search?.includes(':')) return setFilters({ name: search });

    const parsedSearch = search.split(':');
    if (parsedSearch.length !== 2) return;
    const type = parsedSearch[0].trim().toLowerCase() as SearchTypes;
    const term = parsedSearch[1].trim();
    let numericTerm = 0;

    switch (type) {
      case 'id':
        try {
          numericTerm = parseInt(term, 10);
        } catch {
          Alert.alert('Could not parse', 'ID search type only supports numeric inputs.');
        }
        return setFilters({ id: numericTerm });
      case 'email':
        return setFilters({ email: term });
      case 'role':
        return setFilters({
          role: term.split(' ').join('_').toUpperCase() as UserRole,
        });
      default:
        return setFilters({ name: term });
    }
  }, [search]);

  return (
    <SafeAreaView>
      {selectedUser && (
        <>
          <ModalFormMini
            visible={openEditModal}
            onRequestClose={() => setOpenEditModal(false)}
            title="Edit User">
            <UserForm
              onSuccess={(_data) => setOpenEditModal(false)}
              user={selectedUser}
              onCancel={() => setOpenEditModal(false)}
              onError={(e) => Alert.alert(e.name, e.message)}
            />
          </ModalFormMini>

          <ModalFormFull
            visible={openUserModal}
            onRequestClose={() => setOpenUserModal(false)}
            TitleComponent={<ProfileMini user={selectedUser} />}
            title={selectedUser.name}
            className="px-0">
            <AdminProductBilling user={selectedUser} />
          </ModalFormFull>
        </>
      )}

      <ScrollView className="h-full p-5">
        <View className="mb-20">
          {loading && (
            <View className="w-full">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <View className="mb-7" key={i}>
                    <ProfileLargeLoading />
                  </View>
                ))}
            </View>
          )}
          {users &&
            users.getAllUsers.users.map((u) => (
              <TouchableOpacity
                key={u.id}
                onPress={() => {
                  setSelectedUser(u);
                  setOpenUserModal(true);
                }}
                onLongPress={() => {
                  setSelectedUser(u);
                  setOpenEditModal(true);
                }}
                className="mb-7">
                <ProfileLarge user={u} />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
