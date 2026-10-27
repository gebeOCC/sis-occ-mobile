import { AssignmentsSkeleton } from "../components/AssignmentsSkeleton";
import { useLocalSearchParams } from "expo-router";
import { AppHeader } from "@/components/ui/AppHeader";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { EmptyView } from "@/components/ui/StateViews";
import { AssignmentCard } from "@/features/assignments/components/AssignmentCard";
import { useAssignments } from "@/features/assignments/hooks";
import { useClass } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";

export function AssignmentsScreen() {
  const { classId = "" } = useLocalSearchParams<{ classId: string }>();
  const cls = useClass(classId);
  const assignments = useAssignments(classId);

  return (
    <Screen
      header={<AppHeader title="Assignments" subtitle={classSubtitle(cls.data)} />}
      refreshing={assignments.isRefetching}
      onRefresh={assignments.refetch}
    >
      <QueryBoundary loadingFallback={<AssignmentsSkeleton />} query={assignments}>
        {(items) =>
          items.length === 0 ? (
            <EmptyView title="No assignments yet" message="New assignments will appear here." />
          ) : (
            items.map((item) => <AssignmentCard key={item.id} assignment={item} />)
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
