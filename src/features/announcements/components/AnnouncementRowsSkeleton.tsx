import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface } from "@/components/ui/SkeletonLayout";

export function AnnouncementRowsSkeleton({ inbox = false }: { inbox?: boolean }) {
  const rows = [0, 1, 2].map((key) => (
    <View
      key={key}
      className={cn("flex-row items-start gap-3 p-3.5", inbox && key > 0 && "border-t border-line")}
    >
      <SkeletonBlock className="h-11 w-11 rounded-xl" />
      <View className="min-w-0 flex-1 gap-2">
        {inbox ? <SkeletonBlock className="h-3 w-2/5" /> : null}
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-3 w-1/2" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-3/4" />
      </View>
    </View>
  ));
  return inbox ? (
    <Surface className="gap-0 overflow-hidden p-0">{rows}</Surface>
  ) : (
    rows.map((row, key) => (
      <Surface key={key} className="p-0">
        {row}
      </Surface>
    ))
  );
}
