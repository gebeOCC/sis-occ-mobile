import { api } from "@/lib/api";

export const fetchAnnouncements = async (classId) =>
  (await api.get(`/classes/${classId}/announcements`)).data;

export const markAnnouncementRead = async (id) =>
  (await api.post(`/announcements/${id}/read`)).data;
