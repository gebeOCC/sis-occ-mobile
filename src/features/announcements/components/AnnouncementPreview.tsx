import type { Announcement } from "@/features/announcements/types";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { timeAgo } from "@/lib/format";
import colors from "@/theme/colors";

/** One-line announcement row used on Home. */
export function AnnouncementPreview({ item }: { item: Announcement }) {
  const router = useRouter();

  return (
    <Card
      onPress={() => router.push(`/class/${item.classId}/announcement/${item.id}`)}
      accessibilityLabel={`Read ${item.title}, ${item.classCode}`}
      className="flex-row items-center gap-3"
    >
      <Icon name="megaphone" size={24} />
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-[15px] font-semibold text-ink">
          {item.title}
        </Text>
        <Text className="text-[12px] text-ink-muted">{`${item.classCode} · ${timeAgo(item.postedAt)}`}</Text>
      </View>
      <Icon name="next" size={18} color={colors.ink.muted} />
    </Card>
  );
}
