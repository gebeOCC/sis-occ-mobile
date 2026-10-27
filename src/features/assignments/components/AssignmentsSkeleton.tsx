import { SkeletonGroup } from "@/components/ui/Skeleton";
import { SkeletonSurface as Surface } from "@/components/ui/SkeletonLayout";
import { AssignmentRowSkeleton as AssignmentRow } from "./AssignmentRowSkeleton";

function AssignmentsSkeletonLayout() {
  return [0, 1, 2].map((key) => (
    <Surface key={key} className="overflow-hidden p-0">
      <AssignmentRow />
    </Surface>
  ));
}

export function AssignmentsSkeleton() {
  return (
    <SkeletonGroup label="Loading assignments">
      <AssignmentsSkeletonLayout />
    </SkeletonGroup>
  );
}
