import { Text, View } from "react-native";

type AvatarProps = { initials: string; size?: number };

export function Avatar({ initials, size = 44 }: AvatarProps) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-brand-100"
    >
      <Text style={{ fontSize: size * 0.32 }} className="font-bold text-brand-700">
        {initials}
      </Text>
    </View>
  );
}
