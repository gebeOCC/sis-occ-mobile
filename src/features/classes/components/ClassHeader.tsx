import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import colors from "@/theme/colors";
import type { ClassSummary } from "@/features/classes/types";

export function ClassHeader({ cls }: { cls: ClassSummary }) {
  return (
    <Card className="flex-row items-center gap-3.5 p-3.5">
      <IconTile name={cls.icon} size="lg" />
      <View className="flex-1 gap-1">
        <Text className="text-[16px] font-bold text-ink">{`${cls.code} · ${cls.title}`}</Text>
        <Text className="text-[13px] text-ink-soft">{`${cls.instructor} · ${cls.section}`}</Text>
        <View className="flex-row items-center gap-1.5">
          <Icon name="calendar" size={14} color={colors.ink.muted} />
          <Text className="text-[13px] text-ink-muted">{`${cls.schedule} · ${cls.room}`}</Text>
        </View>
      </View>
    </Card>
  );
}
