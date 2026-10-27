import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export function AssignmentRowSkeleton({ bordered = false }: { bordered?: boolean }) {
  return (
    <View className={cn("flex-row items-start gap-3 p-3.5", bordered && "border-t border-line")}>
      <SkeletonBlock className="h-11 w-11 rounded-xl" />
      <View className="min-w-0 flex-1 gap-2">
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-5 w-24 rounded-full" />
      </View>
    </View>
  );
}
