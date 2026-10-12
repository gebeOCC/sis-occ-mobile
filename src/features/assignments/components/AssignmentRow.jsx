import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import { needsAction, statusBadge } from "@/lib/assignment";
import { dueClock } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const ICON_BY_KIND = { quiz: "assignment", lab: "assignment" };

/** One assignment line: icon, title, "IT311 · Due Oct 11, 11:59 PM", status. Used in lists and Home. */
export function AssignmentRow({ assignment, bordered = false }) {
  const router = useRouter();
  const badge = statusBadge(assignment);
  const subtitle = `${assignment.classCode} · Due ${dueClock(assignment.dueAt)}`;

  return (
    <Pressable
      onPress={() => router.push(`/class/${assignment.classId}/assignments/${assignment.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${assignment.title}, ${subtitle}, ${badge.label}`}
      className={cn(
        "min-h-[88px] flex-row items-start gap-3 px-3.5 py-3.5 active:bg-surface",
        bordered && "border-t border-line",
      )}
    >
      <IconTile
        name={ICON_BY_KIND[assignment.kind] ?? "file"}
        tone={needsAction(assignment) ? "warn" : "brand"}
        size="sm"
      />
      <View className="min-w-0 flex-1 gap-1.5">
        <Text numberOfLines={2} className="text-[15px] font-semibold leading-5 text-ink">
          {assignment.title}
        </Text>
        <Text className="text-[12px] leading-4 text-ink-muted">{subtitle}</Text>
        <StatusBadge assignment={assignment} />
      </View>
    </Pressable>
  );
}
