import { api } from "@/lib/api";

export const fetchClasses = async () => (await api.get("/classes")).data;
export const fetchClass = async (id) => (await api.get(`/classes/${id}`)).data;
export const fetchAttendance = async (id) => (await api.get(`/classes/${id}/attendance`)).data;
export const fetchGrades = async (id) => (await api.get(`/classes/${id}/grades`)).data;
