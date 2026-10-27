import type { Assignment, Task } from "./types";

import { differenceInCalendarDays, parseISO } from "date-fns";

interface SubmissionState {
  status: Task["status"];
  canSubmit: boolean;
  requiresAction: boolean;
  notice: { tone: "danger"; title: string; text: string } | null;
}

// Statuses an assignment can have:
//   not_submitted · overdue · submitted · late · graded · returned (needs revision)
const URGENT_DAYS = 3;

/** Work past its deadline with no submission is overdue, even if the server still says not_submitted. */
export const resolveStatus = (assignment: Task, now = new Date()) =>
  assignment.status === "not_submitted" && parseISO(assignment.dueAt) < now
    ? "overdue"
    : assignment.status;

/** True while the student still has something to do (submit, finish late, or revise). */
export const needsAction = (assignment: Task, now?: Date) =>
  ["not_submitted", "overdue", "returned"].includes(resolveStatus(assignment, now));

/** Which Tasks filter an assignment belongs to. */
export function taskGroup(assignment: Task, now?: Date) {
  const status = resolveStatus(assignment, now);
  if (status === "graded") return "graded";
  if (status === "submitted" || status === "late") return "submitted";
  return "todo";
}

/** Label and badge tone. Upcoming deadlines inside 3 days read "N days left". */
export function statusBadge(
  assignment: Task,
  now = new Date(),
): { label: string; tone: "success" | "warning" | "danger" } {
  switch (resolveStatus(assignment, now)) {
    case "graded":
      return { label: "Graded", tone: "success" };
    case "submitted":
      return { label: "Submitted", tone: "success" };
    case "late":
      return { label: "Submitted late", tone: "warning" };
    case "returned":
      return { label: "Needs revision", tone: "warning" };
    case "overdue":
      return { label: "Overdue", tone: "danger" };
    default: {
      const left = differenceInCalendarDays(parseISO(assignment.dueAt), now);
      if (left <= 0) return { label: "Due today", tone: "danger" };
      if (left <= URGENT_DAYS) {
        return { label: left === 1 ? "1 day left" : `${left} days left`, tone: "danger" };
      }
      return { label: "Not submitted", tone: "warning" };
    }
  }
}

/**
 * What the student may do on the assignment screen.
 * canSubmit: show the form (or an "Edit submission" button when nothing is required)
 * requiresAction: the form is shown right away instead of behind "Edit submission"
 */
export function getSubmissionState(assignment: Assignment, now = new Date()): SubmissionState {
  const status = resolveStatus(assignment, now);

  switch (status) {
    case "graded":
      return { status, canSubmit: false, requiresAction: false, notice: null };
    case "overdue":
      return assignment.allowLate
        ? {
            status,
            canSubmit: true,
            requiresAction: true,
            notice: {
              tone: "danger",
              title: "Overdue",
              text: "The deadline has passed. You can still submit, but it will be marked late.",
            },
          }
        : {
            status,
            canSubmit: false,
            requiresAction: false,
            notice: {
              tone: "danger",
              title: "Submissions closed",
              text: "The deadline has passed and late submissions aren’t accepted.",
            },
          };
    case "returned":
      return {
        status,
        canSubmit: Boolean(assignment.allowResubmission),
        requiresAction: true,
        notice: null,
      };
    case "submitted":
    case "late":
      return {
        status,
        canSubmit: Boolean(assignment.allowResubmission),
        requiresAction: false,
        notice: null,
      };
    default:
      return { status, canSubmit: true, requiresAction: true, notice: null };
  }
}
