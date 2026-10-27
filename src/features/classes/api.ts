import type {
  ClassSummary,
  ClassDetail,
  AttendanceRecord,
  GradeTerm,
} from "@/features/classes/types";
import { api } from "@/lib/api";

export const fetchClasses = async () => (await api.get<ClassSummary[]>("/classes")).data;
export const fetchClass = async (id: string) => (await api.get<ClassDetail>(`/classes/${id}`)).data;
export const fetchAttendance = async (id: string) =>
  (await api.get<AttendanceRecord[]>(`/classes/${id}/attendance`)).data;
export const fetchGrades = async (id: string) =>
  (await api.get<GradeTerm[]>(`/classes/${id}/grades`)).data;
