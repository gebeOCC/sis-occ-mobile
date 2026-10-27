import type { Task, TaskGroups } from "./types";
import { addDays, endOfDay, isSameDay, parseISO } from "date-fns";
import { resolveStatus } from "./rules.ts";

/** Mutually exclusive Home groups. Closed overdue work remains visible until resolved. */
export function summarizeTasks<T extends Task>(assignments: readonly T[], now = new Date()) {
  const groups: TaskGroups<T> = { overdue: [], needsRevision: [], dueSoon: [], upcoming: [] };
  const horizon = endOfDay(addDays(now, 7));
  let dueToday = 0;

  assignments.forEach((assignment) => {
    const status = resolveStatus(assignment, now);
    if (status === "overdue") groups.overdue.push(assignment);
    else if (status === "returned") groups.needsRevision.push(assignment);
    else if (status === "not_submitted") {
      const due = parseISO(assignment.dueAt);
      if (isSameDay(due, now)) dueToday += 1;
      groups[due <= horizon ? "dueSoon" : "upcoming"].push(assignment);
    }
  });

  Object.values(groups).forEach((items) =>
    items.sort((a, b) => parseISO(a.dueAt).getTime() - parseISO(b.dueAt).getTime()),
  );

  return {
    groups,
    counts: {
      overdue: groups.overdue.length,
      needsRevision: groups.needsRevision.length,
      dueToday,
      dueSoon: groups.dueSoon.length,
      upcoming: groups.upcoming.length,
      total: Object.values(groups).reduce((sum, items) => sum + items.length, 0),
    },
  };
}
