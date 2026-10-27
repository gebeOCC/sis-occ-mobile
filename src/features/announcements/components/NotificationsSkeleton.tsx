import { SkeletonGroup } from "@/components/ui/Skeleton";
import { AnnouncementRowsSkeleton } from "./AnnouncementRowsSkeleton";

export function NotificationsSkeleton() {
  return (
    <SkeletonGroup label="Loading notifications">
      <AnnouncementRowsSkeleton inbox />
    </SkeletonGroup>
  );
}
