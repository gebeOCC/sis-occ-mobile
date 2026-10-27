import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import colors from "@/theme/colors";
import type { ClassSummary } from "@/features/classes/types";

/** `whenLabel` ("Tomorrow", "Monday") is passed when this is the next class rather than today's. */
export function TodayClassCard({ cls, whenLabel }: { cls: ClassSummary; whenLabel?: string }) {
  const router = useRouter();
  const when = whenLabel ? `${whenLabel} · ` : "";

  return (
    <Card onPress={() => router.push(`/class/${cls.id}`)} className="flex-row items-center gap-3">
      <IconTile name={cls.icon} size="md" />
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] font-semibold text-ink">{`${cls.code} · ${cls.title}`}</Text>
        <Text className="text-[13px] text-ink-soft">{`${when}${cls.time} · ${cls.room}`}</Text>
      </View>
      <Icon name="next" size={18} color={colors.ink.muted} />
    </Card>
  );
}
