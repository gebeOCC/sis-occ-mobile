import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface, SkeletonText as Copy } from "@/components/ui/SkeletonLayout";

function MaterialsSkeletonLayout() {
  return (
    <>
      <View className="flex-row gap-2">
        <SkeletonBlock className="h-10 w-16 rounded-full" />
        <SkeletonBlock className="h-10 w-28 rounded-full" />
        <SkeletonBlock className="h-10 w-20 rounded-full" />
      </View>
      {[0, 1, 2].map((key) => (
        <Surface key={key} className="flex-row items-center gap-3 p-3">
          <SkeletonBlock className="h-11 w-11 rounded-lg" />
          <Copy />
          <SkeletonBlock className="h-5 w-5 rounded-md" />
        </Surface>
      ))}
    </>
  );
}

export function MaterialsSkeleton() {
  return (
    <SkeletonGroup label="Loading materials">
      <MaterialsSkeletonLayout />
    </SkeletonGroup>
  );
}
