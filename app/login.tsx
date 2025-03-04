import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View>
        <Text>Login</Text>
        <Link href="/register">
          <Text>Go to register</Text>
        </Link>
      </View>
    </>
  );
}
