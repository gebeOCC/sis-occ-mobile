import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchAnnouncements, fetchNotificationAnnouncements, markAnnouncementRead } from "./api";
import type { Announcement } from "@/features/announcements/types";

export const useNotificationAnnouncements = () =>
  useQuery({
    queryKey: qk.notifications,
    queryFn: fetchNotificationAnnouncements,
    refetchInterval: 60_000,
  });

export const useAnnouncements = (classId: string) =>
  useQuery({
    queryKey: qk.announcements(classId),
    queryFn: () => fetchAnnouncements(classId),
    enabled: Boolean(classId),
  });

export function useMarkAnnouncementRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAnnouncementRead,
    onSuccess: (announcement) => {
      queryClient.setQueryData<Announcement[]>(qk.notifications, (items) =>
        items?.map((item) => (item.id === announcement.id ? announcement : item)),
      );
      queryClient.invalidateQueries({ queryKey: qk.notifications });
      // Unread counts appear on Home, My Classes and the class overview.
      queryClient.invalidateQueries({ queryKey: qk.classes });
      queryClient.invalidateQueries({ queryKey: qk.home });
    },
  });
}
