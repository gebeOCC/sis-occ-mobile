import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";

function AnnouncementSkeletonLayout() {
  return (
    <>
      <View className="gap-3">
        <SkeletonBlock className="h-7 w-5/6" />
        <SkeletonBlock className="h-7 w-3/5" />
        <View className="flex-row gap-3">
          <SkeletonBlock className="h-3 w-1/2 self-center" />
        </View>
      </View>
      <View className="gap-3">
        {[0, 1, 2, 3].map((key) => (
          <SkeletonBlock key={key} className="h-3 w-full" />
        ))}
        <SkeletonBlock className="h-3 w-2/3" />
      </View>
    </>
  );
}

export function AnnouncementSkeleton() {
  return (
    <SkeletonGroup label="Loading announcement">
      <AnnouncementSkeletonLayout />
    </SkeletonGroup>
  );
}
