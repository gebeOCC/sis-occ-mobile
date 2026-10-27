import type { ReactNode } from "react";
import type { Assignment, AssignmentStatus } from "@/features/assignments/types";
import { Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { resolveStatus } from "@/features/assignments/rules";
import { formatBytes, postedAt } from "@/lib/format";
import colors from "@/theme/colors";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View className="gap-0.5">
      <Text className="text-[12px] text-ink-muted">{label}</Text>
      <Text selectable className="text-[14px] text-ink">
        {value}
      </Text>
    </View>
  );
}

const HEADLINES: Partial<Record<AssignmentStatus, string>> = {
  submitted: "Submitted",
  late: "Submitted late",
  graded: "Graded",
  returned: "Returned for revision",
};

/** What the student handed in, when, and (once graded) the score and feedback. */
export function SubmissionSummary({ assignment }: { assignment: Assignment }) {
  const { submission } = assignment;
  if (!submission) return null;
  const status = resolveStatus(assignment);
  const graded = status === "graded";
  const late = status === "late";

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center gap-2">
        <Icon name="check" size={20} color={late ? colors.warn[700] : colors.success[700]} />
        <View className="flex-1">
          <Text
            className={cn("text-[15px] font-bold", late ? "text-warn-700" : "text-success-700")}
          >
            {HEADLINES[status] ?? "Submitted"}
          </Text>
          <Text className="text-[13px] text-ink-soft">{`Submitted on ${postedAt(submission.submittedAt)}`}</Text>
        </View>
      </View>

      <View className="gap-3 border-t border-line pt-3">
        {submission.file ? (
          <Row
            label="File"
            value={[submission.file.name, formatBytes(submission.file.size)]
              .filter(Boolean)
              .join(" · ")}
          />
        ) : (
          <>
            <Row label="Frontend repository" value={submission.frontendRepo} />
            <Row label="Backend repository" value={submission.backendRepo} />
            {submission.groupMembers ? (
              <Row label="Group members" value={submission.groupMembers} />
            ) : null}
          </>
        )}
      </View>

      {graded ? (
        <View className="gap-1 border-t border-line pt-3">
          <Text className="text-[12px] text-ink-muted">Score</Text>
          <Text className="text-[24px] font-bold text-ink">
            {assignment.score}
            <Text className="text-[16px] font-normal text-ink-muted">{` / ${assignment.maxScore}`}</Text>
          </Text>
          {assignment.feedback ? (
            <Text className="text-[14px] leading-5 text-ink-soft">{assignment.feedback}</Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
