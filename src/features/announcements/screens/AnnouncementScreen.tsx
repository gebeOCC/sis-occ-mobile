import { AnnouncementSkeleton } from "../components/AnnouncementSkeleton";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { toast } from "sonner-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { AttachmentChip } from "@/components/ui/AttachmentChip";
import { Badge } from "@/components/ui/Badge";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { EmptyView } from "@/components/ui/StateViews";
import { useAnnouncements, useMarkAnnouncementRead } from "@/features/announcements/hooks";
import { useClass } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";
import { downloadFile } from "@/lib/files";
import { postedAt } from "@/lib/format";

// Full announcement. Opening it marks it as read.
export function AnnouncementScreen() {
  const { classId = "", announcementId = "" } = useLocalSearchParams<{
    classId: string;
    announcementId: string;
  }>();
  const cls = useClass(classId);
  const announcements = useAnnouncements(classId);
  const { mutate: markRead } = useMarkAnnouncementRead();
  const marked = useRef<string | null>(null);

  const item = announcements.data?.find((a) => a.id === announcementId);

  useEffect(() => {
    if (item && !item.read && marked.current !== item.id) {
      marked.current = item.id;
      markRead(item.id, {
        onError: () => {
          marked.current = null;
          toast.error("Couldn’t mark this announcement as read. Pull down to retry.");
        },
      });
    }
  }, [item, markRead, announcements.dataUpdatedAt]);

  return (
    <Screen
      header={<AppHeader title="Announcement" subtitle={classSubtitle(cls.data)} />}
      refreshing={announcements.isRefetching}
      onRefresh={announcements.refetch}
    >
      <QueryBoundary loadingFallback={<AnnouncementSkeleton />} query={announcements}>
        {() =>
          !item ? (
            <EmptyView title="Announcement not found" message="It may have been removed." />
          ) : (
            <>
              <View className="gap-3">
                {item.pinned ? <Badge label="Pinned" icon="pin" tone="info" /> : null}
                <Text className="text-[22px] font-bold leading-7 text-ink">{item.title}</Text>
                <Text className="text-[13px] text-ink-muted">{`${item.author} · ${postedAt(item.postedAt)}`}</Text>
              </View>

              <Text selectable className="text-[15px] leading-6 text-ink-soft">
                {item.body}
              </Text>

              {item.attachments.length > 0 ? (
                <View className="gap-2.5">
                  <Text className="text-[16px] font-bold text-ink">Attachments</Text>
                  {item.attachments.map((file) => (
                    <AttachmentChip
                      key={file.name}
                      attachment={file}
                      onPress={() => downloadFile(file.name)}
                    />
                  ))}
                </View>
              ) : null}
            </>
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
