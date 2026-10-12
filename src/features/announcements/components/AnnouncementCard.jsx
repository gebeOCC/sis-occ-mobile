import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import { postedAt } from "@/lib/format";
import colors from "@/theme/colors";

/**
 * Feed item. Pinned ones carry a pin icon, unread ones a blue dot and a bolder title,
 * so state reads at a glance without tinted backgrounds.
 */
export function AnnouncementCard({ item, onPress }) {
  const attachments = item.attachments ?? [];
  const extra = attachments.length > 1 ? ` +${attachments.length - 1}` : "";
  const label = [
    item.pinned && "Pinned",
    !item.read && "Unread",
    item.title,
    postedAt(item.postedAt),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={label}
      className="flex-row items-center gap-3 p-3.5"
    >
      <View className="self-start">
        <IconTile name="megaphone" size="sm" />
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1.5">
          {item.pinned ? <Icon name="pin" size={14} color={colors.brand[600]} /> : null}
          <Text
            numberOfLines={1}
            className={cn("flex-1 text-[15px] text-ink", item.read ? "font-medium" : "font-bold")}
          >
            {item.title}
          </Text>
          {!item.read ? <View className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
        </View>
        <Text className="text-[12px] text-ink-muted">{postedAt(item.postedAt)}</Text>
        <Text numberOfLines={2} className="text-[14px] leading-5 text-ink-soft">
          {item.body}
        </Text>
        {attachments.length > 0 ? (
          <View className="flex-row items-center gap-1.5">
            <Icon name="paperclip" size={13} color={colors.ink.muted} />
            <Text numberOfLines={1} className="flex-1 text-[12px] text-ink-muted">
              {`${attachments[0].name}${extra}`}
            </Text>
          </View>
        ) : null}
      </View>
      <Icon name="next" size={18} color={colors.ink.muted} />
    </Card>
  );
}
