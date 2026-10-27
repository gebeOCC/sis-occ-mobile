import type { Announcement } from "@/features/announcements/types";
import { Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { postedAt } from "@/lib/format";
import colors from "@/theme/colors";

/** The announcement preview on the class overview: pinned first, otherwise the newest. */
export function AnnouncementHighlight({
  item,
  onPress,
}: {
  item: Announcement;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} className="gap-2 p-3.5">
      <View className="flex-row items-center justify-between gap-2">
        {item.pinned ? (
          <Badge label="Pinned" icon="pin" tone="info" className="py-0.5" />
        ) : !item.read ? (
          <Badge label="New" tone="solid" className="py-0.5" />
        ) : (
          <View />
        )}
        <Text className="text-[12px] text-ink-muted">{postedAt(item.postedAt)}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-[15px] font-bold text-ink">{item.title}</Text>
          <Text numberOfLines={3} className="text-[13px] leading-5 text-ink-soft">
            {item.body}
          </Text>
        </View>
        <Icon name="next" size={18} color={colors.ink.muted} />
      </View>
    </Card>
  );
}
