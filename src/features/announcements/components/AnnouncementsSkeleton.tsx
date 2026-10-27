import { SkeletonGroup } from "@/components/ui/Skeleton";
import { AnnouncementRowsSkeleton } from "./AnnouncementRowsSkeleton";

export function AnnouncementsSkeleton() {
  return (
    <SkeletonGroup label="Loading announcements">
      <AnnouncementRowsSkeleton />
    </SkeletonGroup>
  );
}
