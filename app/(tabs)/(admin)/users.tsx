import { useLazyQuery, useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';

import CreateStoreForm from '@/components/CreateStoreForm';
import { StoreItemLoading } from '@/components/StoreItem';
import ProfileLarge, { ProfileLargeLoading } from '@/components/profile/ProfileLarge';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { SearchContext } from '@/context/SearchContext';
import { UserAuthContext } from '@/context/UserContext';
import { GetAllUsersDocument, UserFilter, UserRole } from '@/graphql/types/graphql';

export type SearchTypes = 'id' | 'email' | 'name' | 'role';

export default function UsersScreen() {
  const { user } = useContext(UserAuthContext);
  const { search } = useContext(SearchContext);
  const [loadUsers, { data: users, loading, fetchMore }] = useLazyQuery(GetAllUsersDocument);
  const [openModal, setOpenModal] = useState(false);
  const limit = 50;
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilter>();

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

    switch (type) {
      case 'id':
        return setFilters({ id: term });
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
      <ScrollView className="h-full p-5">
        <ModalFormMini
          visible={openModal}
          onRequestClose={() => setOpenModal(false)}
          title="Add Store">
          <CreateStoreForm onSuccess={(_data) => setOpenModal(false)} />
        </ModalFormMini>

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
                  // router.push(`/(stores)/${c.id}`);
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
