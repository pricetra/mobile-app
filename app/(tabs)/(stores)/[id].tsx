import { useLocalSearchParams } from "expo-router";

export default function SelectedStoreScreen() {
  const { id } = useLocalSearchParams();
  console.log(id);

  return <></>
}
