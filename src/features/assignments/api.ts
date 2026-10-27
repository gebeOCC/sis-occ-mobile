import type { Assignment, SubmissionPayload } from "@/features/assignments/types";
import { api } from "@/lib/api";

export const fetchAssignments = async (classId?: string) =>
  (await api.get<Assignment[]>(classId ? `/classes/${classId}/assignments` : "/assignments")).data;

export const fetchAssignment = async (id: string) =>
  (await api.get<Assignment>(`/assignments/${id}`)).data;

export const submitAssignment = async ({ id, ...payload }: SubmissionPayload & { id: string }) =>
  (await api.post<Assignment>(`/assignments/${id}/submission`, payload)).data;
