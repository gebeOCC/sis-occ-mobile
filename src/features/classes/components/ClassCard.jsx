import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { plural } from "@/lib/format";
import colors from "@/theme/colors";

const STATUS_LABELS = { upcoming: "Upcoming", completed: "Completed" };

export function ClassCard({ cls }) {
  const router = useRouter();
  const hasAlerts = cls.unreadAnnouncements > 0 || cls.tasksDue > 0;
  const statusLabel = STATUS_LABELS[cls.status];

  return (
    <Card
      tone={hasAlerts ? "highlight" : "default"}
      onPress={() => router.push(`/class/${cls.id}`)}
      className="gap-3 p-3.5"
    >
      <View className="flex-row items-center gap-3.5">
        <IconTile name={cls.icon} size="lg" />
        <View className="flex-1 gap-0.5">
          <Text className="text-[13px] font-bold text-brand-700">{cls.code}</Text>
          <Text className="text-[16px] font-bold text-ink">{cls.title}</Text>
          <Text className="text-[13px] text-ink-soft">{`${cls.instructor} · ${cls.section}`}</Text>
          <Text className="text-[13px] text-ink-muted">{`${cls.schedule} · ${cls.room}`}</Text>
        </View>
        <Icon name="next" size={18} color={colors.ink.muted} />
      </View>
      {hasAlerts || statusLabel ? (
        <View className="flex-row flex-wrap gap-2">
          {statusLabel ? <Badge label={statusLabel} tone="neutral" /> : null}
          {cls.unreadAnnouncements > 0 ? (
            <Badge
              icon="megaphone"
              tone="info"
              label={plural(cls.unreadAnnouncements, "new announcement")}
            />
          ) : null}
          {cls.tasksDue > 0 ? (
            <Badge
              icon="assignment"
              tone="warning"
              label={`${plural(cls.tasksDue, "task")} to do`}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
