import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchAnnouncements, markAnnouncementRead } from "./api";

export const useAnnouncements = (classId) =>
  useQuery({
    queryKey: qk.announcements(classId),
    queryFn: () => fetchAnnouncements(classId),
    enabled: Boolean(classId),
  });

export function useMarkAnnouncementRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAnnouncementRead,
    onSuccess: () => {
      // Unread counts appear on Home, My Classes and the class overview.
      queryClient.invalidateQueries({ queryKey: qk.classes });
      queryClient.invalidateQueries({ queryKey: qk.home });
    },
  });
}
