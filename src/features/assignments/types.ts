import type { Attachment } from "../../types/files";

export type AssignmentStatus =
  "not_submitted" | "overdue" | "submitted" | "late" | "graded" | "returned";

export interface Task {
  dueAt: string;
  status: AssignmentStatus;
}

export interface SubmissionFile {
  name: string;
  size: number;
  mimeType?: string;
  uri?: string;
}

export interface SubmissionPayload {
  frontendRepo?: string;
  backendRepo?: string;
  groupMembers?: string;
  file?: SubmissionFile;
}

export interface Submission extends SubmissionPayload {
  submittedAt: string;
}

export interface SubmissionFormValues {
  frontendRepo: string;
  backendRepo: string;
  groupMembers: string;
  file: SubmissionFile | null;
}

export interface Assignment extends Task {
  id: string;
  classId: string;
  classCode: string;
  className: string;
  kind: "project" | "lab" | "quiz" | "activity";
  title: string;
  instructions: string;
  maxScore: number;
  score: number | null;
  feedback: string | null;
  submissionType: "repository" | "file";
  allowedFormats: string[] | null;
  maxFileSizeMb: number | null;
  requiresGroupMembers: boolean;
  allowResubmission: boolean;
  allowLate: boolean;
  attachments: Attachment[];
  submission: Submission | null;
}

export type TaskGroupKey = "overdue" | "needsRevision" | "dueSoon" | "upcoming";

export type TaskGroups<T extends Task = Assignment> = Record<TaskGroupKey, T[]>;

export type TaskCounts = Record<TaskGroupKey, number> & { dueToday: number; total: number };
