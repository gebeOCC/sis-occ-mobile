import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { AttachmentChip } from "@/components/ui/AttachmentChip";
import { Icon } from "@/components/ui/Icon";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { StatusBadge } from "@/features/assignments/components/StatusBadge";
import { SubmissionSection } from "@/features/assignments/components/SubmissionSection";
import { useAssignment } from "@/features/assignments/hooks";
import { downloadFile } from "@/lib/files";
import { dueFull } from "@/lib/format";
import colors from "@/theme/colors";

// 06 / Assignment & Submission
export default function AssignmentScreen() {
  const { assignmentId = "" } = useLocalSearchParams();
  const query = useAssignment(assignmentId);
  const data = query.data;

  return (
    <Screen
      header={
        <AppHeader
          title="Assignment"
          subtitle={data ? `${data.classCode} · ${data.className}` : undefined}
        />
      }
      refreshing={query.isRefetching}
      onRefresh={query.refetch}
    >
      <QueryBoundary query={query}>
        {(assignment) => (
          <>
            <View className="gap-3">
              <Text className="text-[26px] font-bold leading-8 text-ink">{assignment.title}</Text>
              <View className="flex-row flex-wrap items-center gap-x-3 gap-y-2">
                <StatusBadge assignment={assignment} />
                <View className="flex-row items-center gap-1.5">
                  <Icon name="calendar" size={16} color={colors.ink.muted} />
                  <Text className="text-[13px] text-ink-soft">{dueFull(assignment.dueAt)}</Text>
                </View>
              </View>
              {assignment.maxScore ? (
                <Text className="text-[13px] text-ink-muted">{`Maximum score: ${assignment.maxScore} points`}</Text>
              ) : null}
            </View>

            <View className="gap-2.5">
              <Text className="text-[16px] font-bold text-ink">Instructions</Text>
              <Text className="text-[14px] leading-5 text-ink-soft">{assignment.instructions}</Text>
              {assignment.attachments.map((file) => (
                <AttachmentChip
                  key={file.name}
                  attachment={file}
                  onPress={() => downloadFile(file.name)}
                />
              ))}
            </View>

            <View className="gap-3">
              <Text className="text-[16px] font-bold text-ink">Your submission</Text>
              <SubmissionSection assignment={assignment} />
            </View>
          </>
        )}
      </QueryBoundary>
    </Screen>
  );
}
