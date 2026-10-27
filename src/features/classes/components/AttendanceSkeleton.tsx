import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import {
  SkeletonSurface as Surface,
  SkeletonSection as Section,
} from "@/components/ui/SkeletonLayout";

function AttendanceSkeletonLayout() {
  return (
    <>
      <Surface className="gap-4 p-4">
        <SkeletonBlock className="h-3 w-2/5" />
        <SkeletonBlock className="h-9 w-24" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-2 w-full rounded-full" />
        <View className="flex-row flex-wrap gap-2">
          {[0, 1, 2].map((key) => (
            <SkeletonBlock key={key} className="h-6 w-20 rounded-full" />
          ))}
        </View>
        <View className="gap-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
        </View>
      </Surface>
      <Section>
        <Surface className="gap-0 overflow-hidden p-0">
          {[0, 1, 2].map((key) => (
            <View
              key={key}
              className={cn(
                "min-h-[60px] flex-row items-center gap-3 px-4 py-3",
                key > 0 && "border-t border-line",
              )}
            >
              <View className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-3/5" />
              </View>
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </View>
          ))}
        </Surface>
      </Section>
    </>
  );
}

export function AttendanceSkeleton() {
  return (
    <SkeletonGroup label="Loading attendance">
      <AttendanceSkeletonLayout />
    </SkeletonGroup>
  );
}
