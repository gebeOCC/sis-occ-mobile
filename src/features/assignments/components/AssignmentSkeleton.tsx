import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";

function AssignmentSkeletonLayout() {
  return (
    <>
      <View className="gap-3">
        <SkeletonBlock className="h-7 w-5/6" />
        <SkeletonBlock className="h-7 w-3/5" />
        <View className="flex-row gap-3">
          <SkeletonBlock className="h-6 w-24 rounded-full" />
          <SkeletonBlock className="h-3 w-1/2 self-center" />
        </View>
        <SkeletonBlock className="h-3 w-2/5" />
      </View>
      <View className="gap-3">
        <SkeletonBlock className="h-4 w-28" />
        {[0, 1, 2, 3].map((key) => (
          <SkeletonBlock key={key} className="h-3 w-full" />
        ))}
        <SkeletonBlock className="h-3 w-2/3" />
      </View>
      <View className="gap-3">
        <SkeletonBlock className="h-4 w-2/5" />
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </View>
    </>
  );
}

export function AssignmentSkeleton() {
  return (
    <SkeletonGroup label="Loading assignment">
      <AssignmentSkeletonLayout />
    </SkeletonGroup>
  );
}
