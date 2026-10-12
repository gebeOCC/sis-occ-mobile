import { api } from "@/lib/api";

export const fetchAssignments = async (classId) =>
  (await api.get(classId ? `/classes/${classId}/assignments` : "/assignments")).data;

export const fetchAssignment = async (id) => (await api.get(`/assignments/${id}`)).data;

export const submitAssignment = async ({ id, ...payload }) =>
  (await api.post(`/assignments/${id}/submission`, payload)).data;
