import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import colors from "@/theme/colors";
import { Icon } from "./Icon";

/** Back button + centered title/subtitle, used on every pushed screen. */
type AppHeaderProps = { title: string; subtitle?: string };

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <View className="items-center justify-center border-b border-line bg-card px-14 pb-3 pt-2">
      <View className="absolute inset-y-0 left-3 justify-center">
        <Pressable
          onPress={goBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-surface"
        >
          <Icon name="back" size={26} color={colors.ink.DEFAULT} />
        </Pressable>
      </View>
      <Text numberOfLines={1} className="text-[16px] font-bold text-ink">
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} className="text-[12px] text-ink-muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
