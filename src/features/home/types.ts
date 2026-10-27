import type { Student } from "../profile/types";
import type { ClassSummary } from "../classes/types";
import type { Announcement } from "../announcements/types";
import type { TaskCounts, TaskGroups } from "../assignments/types";

export interface HomeData {
  student: Student;
  hasUnreadNotifications: boolean;
  taskSummary: TaskCounts;
  taskGroups: TaskGroups;
  schedule: { kind: "today" | "next" | "none"; whenLabel: string; classes: ClassSummary[] };
  latestAnnouncement: Announcement | null;
}
