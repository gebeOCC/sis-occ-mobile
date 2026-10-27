import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import {
  SkeletonSurface as Surface,
  SkeletonText as Copy,
  SkeletonSection as Section,
} from "@/components/ui/SkeletonLayout";

function ClassOverviewSkeletonLayout() {
  return (
    <>
      <Surface className="flex-row items-center gap-3.5">
        <SkeletonBlock className="h-16 w-16 rounded-2xl" />
        <Copy body />
      </Surface>
      <Section>
        <Surface>
          <SkeletonBlock className="h-5 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-4/5" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-3/4" />
        </Surface>
      </Section>
      <Section>
        <Surface className="gap-0 overflow-hidden p-0">
          {[0, 1, 2, 3, 4].map((key) => (
            <View
              key={key}
              className={cn(
                "min-h-[56px] flex-row items-center gap-3.5 px-4 py-3",
                key > 0 && "border-t border-line",
              )}
            >
              <SkeletonBlock className="h-5 w-5 rounded-md" />
              <Copy />
            </View>
          ))}
        </Surface>
      </Section>
    </>
  );
}

export function ClassOverviewSkeleton() {
  return (
    <SkeletonGroup label="Loading class overview">
      <ClassOverviewSkeletonLayout />
    </SkeletonGroup>
  );
}
