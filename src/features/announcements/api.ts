import type { Announcement } from "@/features/announcements/types";
import { api } from "@/lib/api";

/** All class announcements for the student's notification inbox. */
export const fetchNotificationAnnouncements = async () =>
  (await api.get<Announcement[]>("/announcements")).data;

export const fetchAnnouncements = async (classId: string) =>
  (await api.get<Announcement[]>(`/classes/${classId}/announcements`)).data;

export const markAnnouncementRead = async (id: string) =>
  (await api.post<Announcement>(`/announcements/${id}/read`)).data;
