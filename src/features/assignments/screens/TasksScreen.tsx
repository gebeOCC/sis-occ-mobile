import { AssignmentsSkeleton } from "../components/AssignmentsSkeleton";
import { useState } from "react";
import { Text, View } from "react-native";
import { FilterChips } from "@/components/ui/FilterChips";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { EmptyView } from "@/components/ui/StateViews";
import { AssignmentCard } from "@/features/assignments/components/AssignmentCard";
import { useAssignments } from "@/features/assignments/hooks";
import { taskGroup } from "@/features/assignments/rules";

const FILTERS = [
  { value: "todo", label: "To do" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
] as const;

type TaskFilter = (typeof FILTERS)[number]["value"];

const EMPTY = {
  todo: { title: "You’re all caught up", message: "New assignments will appear here." },
  submitted: {
    title: "Nothing waiting for a grade",
    message: "Assignments you hand in show up here.",
  },
  graded: { title: "No graded work yet", message: "Scores and feedback appear here once graded." },
};

export function TasksScreen() {
  const [filter, setFilter] = useState<TaskFilter>("todo");
  const assignments = useAssignments();

  return (
    <Screen tabbed refreshing={assignments.isRefetching} onRefresh={assignments.refetch}>
      <View className="gap-1">
        <Text className="text-[28px] font-bold text-ink">Tasks</Text>
        <Text className="text-[14px] text-ink-muted">Assignments across all your classes</Text>
      </View>

      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

      <QueryBoundary loadingFallback={<AssignmentsSkeleton />} query={assignments}>
        {(items) => {
          const visible = items.filter((item) => taskGroup(item) === filter);
          if (visible.length === 0) return <EmptyView {...EMPTY[filter]} />;
          return visible.map((item) => <AssignmentCard key={item.id} assignment={item} />);
        }}
      </QueryBoundary>
    </Screen>
  );
}
