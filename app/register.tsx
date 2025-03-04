import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function RegisterScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Create account' }} />
      <View>
        <Text>Create new account</Text>
        <Link href="/login">
          <Text>Go to login screen</Text>
        </Link>
      </View>
    </>
  );
}
