import { AttendanceSkeleton } from "../components/AttendanceSkeleton";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
import { EmptyView } from "@/components/ui/StateViews";
import { useAttendance, useClass } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";
import {
  ATTENDANCE_STATUSES,
  attendanceStatus,
  summarizeAttendance,
} from "@/features/classes/attendance";
import { cn } from "@/lib/cn";
import { meetingDate } from "@/lib/format";
import type { AttendanceStatus } from "@/features/classes/types";

export function AttendanceScreen() {
  const { classId = "" } = useLocalSearchParams<{ classId: string }>();
  const cls = useClass(classId);
  const attendance = useAttendance(classId);

  return (
    <Screen
      header={<AppHeader title="My attendance" subtitle={classSubtitle(cls.data)} />}
      refreshing={attendance.isRefetching}
      onRefresh={attendance.refetch}
    >
      <QueryBoundary loadingFallback={<AttendanceSkeleton />} query={attendance}>
        {(records) => {
          if (records.length === 0) {
            return (
              <EmptyView
                title="No meetings yet"
                message="Your attendance appears here once classes start."
              />
            );
          }
          const summary = summarizeAttendance(records);
          const hasCounted = summary.counted > 0;

          return (
            <>
              <Card className="gap-4 p-4">
                <View className="gap-1">
                  <Text className="text-[13px] font-medium text-ink-muted">Attendance rate</Text>
                  <Text className="text-[32px] font-bold text-ink">
                    {hasCounted ? `${summary.percentage}%` : "—"}
                  </Text>
                  <Text className="text-[14px] text-ink-soft">
                    {hasCounted
                      ? `${summary.attended} of ${summary.counted} counted meetings attended`
                      : "No counted meetings yet"}
                  </Text>
                </View>
                {hasCounted ? (
                  <View
                    accessibilityRole="progressbar"
                    accessibilityLabel="Attendance rate"
                    accessibilityValue={{ min: 0, max: 100, now: summary.percentage ?? undefined }}
                    className="h-2 overflow-hidden rounded-full bg-brand-100"
                  >
                    <View
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${summary.percentage ?? 0}%` }}
                    />
                  </View>
                ) : null}
                <View className="flex-row flex-wrap gap-2">
                  {Object.entries(ATTENDANCE_STATUSES)
                    .filter(([key]) => key !== "cancelled" || summary.cancelled > 0)
                    .map(([key, status]) => (
                      <Badge
                        key={key}
                        label={`${status.label} ${summary[key as AttendanceStatus]}`}
                        tone={status.tone}
                      />
                    ))}
                </View>
                <Text className="text-[12px] leading-5 text-ink-muted">
                  Present and Late count as attended. Only Present, Late, and Absent enter the
                  percentage. Excused, Unmarked, and cancelled meetings are excluded.
                </Text>
              </Card>

              <Section title="Meeting history">
                <Card className="overflow-hidden p-0">
                  {[...records]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((record, index) => {
                      const status = ATTENDANCE_STATUSES[attendanceStatus(record)];
                      return (
                        <View
                          key={record.id}
                          className={cn(
                            "min-h-[60px] flex-row items-center gap-3 px-4 py-3",
                            index > 0 && "border-t border-line",
                          )}
                        >
                          <View className="min-w-0 flex-1 gap-0.5">
                            <Text className="text-[14px] font-medium text-ink">
                              {meetingDate(record.date)}
                            </Text>
                            {record.topic ? (
                              <Text className="text-[12px] text-ink-muted">{record.topic}</Text>
                            ) : null}
                          </View>
                          <Badge label={status.label} tone={status.tone} />
                        </View>
                      );
                    })}
                </Card>
              </Section>
            </>
          );
        }}
      </QueryBoundary>
    </Screen>
  );
}
