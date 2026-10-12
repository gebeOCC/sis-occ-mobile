import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { calculateTermGrade, roundPercentage } from "@/lib/grades";
import colors from "@/theme/colors";

const points = (value) => (value === null ? "—" : value.toFixed(2));
const percent = (value) => (value === null ? "—" : `${roundPercentage(value)}%`);

function AssessmentRow({ name, score, maxScore }) {
  return (
    <View className="flex-row items-start justify-between gap-3 py-1">
      <Text className="min-w-0 flex-1 text-[13px] leading-5 text-ink-soft">{name}</Text>
      <Text className="text-[13px] leading-5 text-ink">
        {Number.isFinite(score) ? `${score} / ${maxScore}` : "Not graded"}
      </Text>
    </View>
  );
}

export function GradePeriodCard({ term }) {
  const [expanded, setExpanded] = useState(false);
  const result = calculateTermGrade(term);
  const passed = result.complete && result.equivalent <= 3;
  const title = !result.released
    ? "Not released yet"
    : !result.complete
      ? "In progress"
      : passed
        ? "Passed"
        : "Failed";
  const tone = result.complete ? (passed ? "success" : "danger") : "neutral";
  const gradeClass = passed ? "text-success-700" : "text-danger-600";

  return (
    <Card className="overflow-hidden p-0">
      <Pressable
        disabled={!result.released}
        accessibilityRole={result.released ? "button" : undefined}
        accessibilityState={result.released ? { expanded } : undefined}
        accessibilityLabel={`${term.period}, ${result.complete ? `grade ${result.equivalent.toFixed(1)}, ${result.roundedPercentage} percent, ` : ""}${title}${result.released ? ", grade breakdown" : ""}`}
        onPress={() => setExpanded((value) => !value)}
        className="gap-3 p-4 active:bg-surface"
      >
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <Text className="text-[17px] font-bold text-ink">{term.period}</Text>
          <Badge label={title} tone={tone} />
        </View>
        {result.complete ? (
          <View className="flex-row items-end gap-8">
            <View className="gap-0.5">
              <Text className={cn("text-[32px] font-bold", gradeClass)}>
                {result.equivalent.toFixed(1)}
              </Text>
              <Text className="text-[12px] text-ink-muted">Grade equivalent</Text>
            </View>
            <View className="gap-0.5">
              <Text className="text-[24px] font-semibold text-ink">
                {result.roundedPercentage}%
              </Text>
              <Text className="text-[12px] text-ink-muted">Term percentage</Text>
            </View>
          </View>
        ) : (
          <Text className="text-[13px] leading-5 text-ink-muted">
            {result.released
              ? "Your term grade appears when all scores are complete."
              : "Your instructor hasn’t released this term’s grades."}
          </Text>
        )}
        {result.released ? (
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-[13px] font-semibold text-brand-700">
              {expanded ? "Hide breakdown" : "View breakdown"}
            </Text>
            <Icon name={expanded ? "up" : "down"} size={18} color={colors.brand[700]} />
          </View>
        ) : null}
      </Pressable>

      {expanded && result.released ? (
        <View className="gap-5 border-t border-line p-4">
          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-[15px] font-bold text-ink">
                Class Standing · {result.classStanding.weight}%
              </Text>
              <Text className="text-[13px] text-ink-soft">
                {result.classStanding.percentage === null
                  ? "Waiting for complete category scores"
                  : `${percent(result.classStanding.percentage)} · ${points(result.classStanding.contribution)} of ${result.classStanding.weight} points`}
              </Text>
            </View>
            {result.categories.map((category) => (
              <View key={category.id ?? category.name} className="gap-2 rounded-xl bg-surface p-3">
                <Text className="text-[14px] font-semibold text-ink">{category.name}</Text>
                <Text className="text-[12px] leading-5 text-ink-muted">
                  {category.weight}% of Class Standing ·{" "}
                  {category.possible > 0
                    ? `${category.earned} / ${category.possible} scored points · ${percent(category.percentage)}`
                    : "No scores yet"}
                </Text>
                <View>
                  {category.assessments.map((assessment) => (
                    <AssessmentRow key={assessment.id ?? assessment.name} {...assessment} />
                  ))}
                </View>
                {!category.complete ? (
                  <Text className="text-[12px] text-warn-700">
                    Category incomplete; missing scores are not counted as zero.
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          <View className="gap-2 border-t border-line pt-4">
            <Text className="text-[15px] font-bold text-ink">Exam · {result.exam.weight}%</Text>
            <AssessmentRow
              name={`${term.period} exam`}
              score={result.exam.score}
              maxScore={result.exam.maxScore}
            />
            {result.exam.percentage !== null ? (
              <Text className="text-[13px] text-ink-soft">
                {percent(result.exam.percentage)} · {points(result.exam.contribution)} of{" "}
                {result.exam.weight} points
              </Text>
            ) : null}
          </View>

          {result.complete ? (
            <View className="gap-1.5 rounded-xl bg-brand-50 p-3">
              <Text className="text-[14px] font-bold text-ink">How your grade is calculated</Text>
              <Text className="text-[13px] leading-5 text-ink-soft">
                Class Standing {points(result.classStanding.contribution)} + Exam{" "}
                {points(result.exam.contribution)} = {points(result.percentage)}%
              </Text>
              <Text className="text-[13px] font-semibold text-brand-700">
                {result.roundedPercentage}% rounded → {result.equivalent.toFixed(1)} equivalent
              </Text>
              <Text className="text-[12px] leading-5 text-ink-muted">
                Scores keep their precision during calculation. The completed term percentage is
                rounded once before conversion. A grade of 3.0 or better is passing.
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
