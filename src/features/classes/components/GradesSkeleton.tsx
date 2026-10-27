import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface } from "@/components/ui/SkeletonLayout";

function GradesSkeletonLayout() {
  return (
    <>
      <View className="gap-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
      </View>
      {[0, 1].map((key) => (
        <Surface key={key} className="gap-4 p-4">
          <View className="flex-row items-center justify-between gap-3">
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
          </View>
          <View className="flex-row gap-8">
            {[0, 1].map((column) => (
              <View key={column} className="min-w-0 flex-1 gap-2">
                <SkeletonBlock className="h-9 w-3/5" />
                <SkeletonBlock className="h-3 w-4/5" />
              </View>
            ))}
          </View>
          <SkeletonBlock className="h-3 w-2/5" />
        </Surface>
      ))}
    </>
  );
}

export function GradesSkeleton() {
  return (
    <SkeletonGroup label="Loading grades">
      <GradesSkeletonLayout />
    </SkeletonGroup>
  );
}
