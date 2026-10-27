import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface, SkeletonText as Copy } from "@/components/ui/SkeletonLayout";

function ProfileSkeletonLayout() {
  return (
    <>
      <Surface>
        <View className="flex-row items-center gap-3">
          <SkeletonBlock className="h-12 w-12 rounded-full" />
          <Copy />
        </View>
        <View className="gap-2 border-t border-line pt-3">
          <SkeletonBlock className="h-3 w-4/5" />
          <SkeletonBlock className="h-3 w-3/5" />
        </View>
      </Surface>
      <View className="gap-2">
        <SkeletonBlock className="h-4 w-24" />
        <View className="flex-row gap-1 rounded-xl border border-line p-1">
          {[0, 1, 2].map((key) => (
            <SkeletonBlock key={key} className="h-11 min-w-0 flex-1 rounded-lg" />
          ))}
        </View>
      </View>
      <View className="gap-2">
        <SkeletonBlock className="h-4 w-20" />
        <Surface className="gap-0 overflow-hidden p-0">
          {[0, 1, 2].map((key) => (
            <View
              key={key}
              className={cn(
                "min-h-[48px] flex-row items-center gap-3 px-3.5 py-3",
                key > 0 && "border-t border-line",
              )}
            >
              <SkeletonBlock className="h-5 w-5 rounded-md" />
              <SkeletonBlock className="h-3 w-2/5" />
            </View>
          ))}
        </Surface>
      </View>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <SkeletonGroup label="Loading profile" className="gap-4">
      <ProfileSkeletonLayout />
    </SkeletonGroup>
  );
}
