import { GradesSkeleton } from "../components/GradesSkeleton";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { EmptyView } from "@/components/ui/StateViews";
import { GradePeriodCard } from "@/features/classes/components/GradePeriodCard";
import { useClass, useGrades } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";

export function GradesScreen() {
  const { classId = "" } = useLocalSearchParams<{ classId: string }>();
  const cls = useClass(classId);
  const grades = useGrades(classId);

  return (
    <Screen
      header={<AppHeader title="My grades" subtitle={classSubtitle(cls.data)} />}
      refreshing={grades.isRefetching}
      onRefresh={grades.refetch}
    >
      <QueryBoundary loadingFallback={<GradesSkeleton />} query={grades}>
        {(rows) =>
          rows.length === 0 ? (
            <EmptyView
              title="No grades yet"
              message="Grades appear here once your instructor posts them."
            />
          ) : (
            <>
              <Text className="text-[13px] leading-5 text-ink-muted">
                See your term grade and the scores behind it. Computed grades are for reference.
              </Text>
              {rows.map((term) => (
                <GradePeriodCard key={term.period} term={term} />
              ))}
            </>
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
