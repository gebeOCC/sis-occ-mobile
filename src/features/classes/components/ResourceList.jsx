import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import colors from "@/theme/colors";

const VALUE_TONES = {
  brand: "text-brand-600",
  warn: "text-warn-700",
  muted: "text-ink-muted",
};

/** The "Class resources" menu on the class overview, with a live summary on each row. */
export function ResourceList({ cls }) {
  const router = useRouter();
  const base = `/class/${cls.id}`;
  const { attended, counted, percentage, total } = cls.attendance;

  const rows = [
    {
      key: "announcements",
      label: "Announcements",
      icon: "megaphone",
      href: `${base}/announcements`,
      value: cls.unreadAnnouncements > 0 ? `${cls.unreadAnnouncements} unread` : "All read",
      tone: cls.unreadAnnouncements > 0 ? "brand" : "muted",
    },
    {
      key: "materials",
      label: "Materials",
      icon: "file",
      href: `${base}/materials`,
      value: cls.materialsCount > 0 ? plural(cls.materialsCount, "resource") : "None yet",
      tone: "muted",
    },
    {
      key: "assignments",
      label: "Assignments",
      icon: "assignment",
      href: `${base}/assignments`,
      value: cls.tasksDue > 0 ? `${plural(cls.tasksDue, "task")} to do` : "All caught up",
      tone: cls.tasksDue > 0 ? "warn" : "muted",
    },
    {
      key: "attendance",
      label: "My attendance",
      icon: "attendance",
      href: `${base}/attendance`,
      value:
        counted > 0
          ? `${percentage}% · ${attended}/${counted} attended`
          : total > 0
            ? "No counted meetings yet"
            : "No meetings yet",
      tone: "muted",
    },
    {
      key: "grades",
      label: "My grades",
      icon: "chart",
      href: `${base}/grades`,
      value: cls.gradingPeriods.length > 0 ? cls.gradingPeriods.join(" & ") : "Not available yet",
      tone: "muted",
    },
  ];

  return (
    <Card className="overflow-hidden p-0">
      {rows.map((row, index) => (
        <Pressable
          key={row.key}
          onPress={() => router.push(row.href)}
          accessibilityRole="button"
          accessibilityLabel={`${row.label}, ${row.value}`}
          className={cn(
            "min-h-[56px] flex-row items-center gap-3.5 px-4 py-3 active:bg-surface",
            index > 0 && "border-t border-line",
          )}
        >
          <Icon name={row.icon} size={22} />
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-[15px] font-medium text-ink">{row.label}</Text>
            <Text className={cn("text-[13px]", VALUE_TONES[row.tone])}>{row.value}</Text>
          </View>
          <Icon name="next" size={18} color={colors.ink.muted} />
        </Pressable>
      ))}
    </Card>
  );
}
