import type { Student } from "@/features/profile/types";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { greeting, longDate } from "@/lib/format";
import colors from "@/theme/colors";

export function HomeHeader({ student, hasUnread }: { student: Student; hasUnread: boolean }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-[22px] font-bold text-ink">{`${greeting()}, ${student.firstName} 👋`}</Text>
        <Text className="mt-0.5 text-[13px] text-ink-muted">{longDate()}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => router.navigate("/profile")}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Open your profile"
        >
          <Avatar initials={student.initials} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/notifications")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            hasUnread ? "Notifications, you have unread updates" : "Notifications"
          }
          className="h-11 w-11 items-center justify-center"
        >
          <Icon name="bell" size={24} color={colors.ink.soft} />
          {hasUnread ? (
            <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-danger-500" />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
