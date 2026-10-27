import { View } from "react-native";

import { SkeletonBlock, SkeletonGroup } from "@/components/ui/Skeleton";
import {
  SkeletonSurface as Surface,
  SkeletonText as Copy,
  SkeletonSection as Section,
} from "@/components/ui/SkeletonLayout";
import { AssignmentRowSkeleton as AssignmentRow } from "@/features/assignments/components/AssignmentRowSkeleton";

function HomeSkeletonLayout() {
  return (
    <>
      <View className="flex-row items-center gap-3">
        <View className="min-w-0 flex-1 gap-2">
          <SkeletonBlock className="h-6 w-4/5" />
          <SkeletonBlock className="h-3 w-3/5" />
        </View>
        <SkeletonBlock className="h-11 w-11 rounded-full" />
        <SkeletonBlock className="h-6 w-6 rounded-full" />
      </View>
      <Surface className="flex-row items-center gap-3.5">
        <SkeletonBlock className="h-14 w-14 rounded-2xl" />
        <Copy body />
      </Surface>
      <Section>
        <Surface className="gap-0 overflow-hidden p-0">
          <AssignmentRow />
          <AssignmentRow bordered />
        </Surface>
      </Section>
      <Section>
        <Surface className="flex-row items-center gap-3">
          <SkeletonBlock className="h-14 w-14 rounded-2xl" />
          <Copy />
        </Surface>
      </Section>
      <Section>
        <Surface className="flex-row items-center gap-3">
          <SkeletonBlock className="h-6 w-6 rounded-md" />
          <Copy />
        </Surface>
      </Section>
    </>
  );
}

export function HomeSkeleton() {
  return (
    <SkeletonGroup label="Loading home">
      <HomeSkeletonLayout />
    </SkeletonGroup>
  );
}
