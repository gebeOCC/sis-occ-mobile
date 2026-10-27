import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface } from "@/components/ui/SkeletonLayout";

function ClassesSkeletonLayout() {
  return [0, 1, 2].map((key) => (
    <Surface key={key}>
      <View className="flex-row items-center gap-3.5">
        <SkeletonBlock className="h-16 w-16 rounded-2xl" />
        <View className="min-w-0 flex-1 gap-2">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-4 w-5/6" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-3/4" />
        </View>
      </View>
      <View className="flex-row gap-2">
        <SkeletonBlock className="h-6 w-28 rounded-full" />
        <SkeletonBlock className="h-6 w-24 rounded-full" />
      </View>
    </Surface>
  ));
}

export function ClassesSkeleton() {
  return (
    <SkeletonGroup label="Loading classes">
      <ClassesSkeletonLayout />
    </SkeletonGroup>
  );
}
