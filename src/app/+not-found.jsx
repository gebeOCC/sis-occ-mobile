import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-8">
      <Text className="text-[18px] font-bold text-ink">This page doesn’t exist</Text>
      <Button title="Go to Home" onPress={() => router.replace("/")} className="px-8" />
    </View>
  );
}
