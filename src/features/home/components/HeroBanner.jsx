import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { plural } from "@/lib/format";
import colors from "@/theme/colors";

/** Compact summary banner. Tapping it opens Tasks. */
export function HeroBanner({ counts, onPress }) {
  const urgent = counts.overdue + counts.needsRevision;
  const title =
    urgent > 0
      ? `${plural(urgent, "task")} ${urgent === 1 ? "needs" : "need"} attention`
      : counts.dueToday > 0
        ? `${plural(counts.dueToday, "assignment")} due today`
        : counts.total > 0
          ? `${plural(counts.total, "assignment")} to complete`
          : "You’re all caught up";
  const summary =
    [
      counts.overdue > 0 && `${counts.overdue} overdue`,
      counts.dueToday > 0 && `${counts.dueToday} due today`,
      counts.needsRevision > 0 &&
        `${counts.needsRevision} ${counts.needsRevision === 1 ? "needs" : "need"} revision`,
      counts.dueSoon > counts.dueToday && `${counts.dueSoon - counts.dueToday} due soon`,
      counts.upcoming > 0 && `${counts.upcoming} upcoming`,
    ]
      .filter(Boolean)
      .join(" · ") || "No outstanding assignments. View your submitted work.";

  return (
    <Card
      tone="highlight"
      onPress={onPress}
      accessibilityLabel={`${title}. ${summary} Open tasks.`}
      className="flex-row items-center gap-3.5 p-3.5"
    >
      <IconTile name={counts.total > 0 ? "tasks" : "check"} size="md" />
      <View className="flex-1 gap-1">
        <Text className="text-[16px] font-bold leading-6 text-ink">{title}</Text>
        <Text className="text-[13px] text-ink-soft">{summary}</Text>
      </View>
      <Icon name="next" size={18} color={colors.ink.muted} />
    </Card>
  );
}
