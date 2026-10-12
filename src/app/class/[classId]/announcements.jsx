import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { FilterChips } from "@/components/ui/FilterChips";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { EmptyView } from "@/components/ui/StateViews";
import { AnnouncementCard } from "@/features/announcements/components/AnnouncementCard";
import { useAnnouncements } from "@/features/announcements/hooks";
import { useClass } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "pinned", label: "Pinned" },
];

const EMPTY = {
  all: { title: "No announcements yet", message: "Updates from your instructor show up here." },
  unread: { title: "No unread announcements", message: "You’re all caught up." },
  pinned: {
    title: "No pinned announcements",
    message: "Important notices your instructor pins appear here.",
  },
};

const matches = (item, filter) =>
  filter === "all" || (filter === "unread" ? !item.read : item.pinned);

// 04 / Announcements: tap one to read it in full (that also marks it read).
export default function AnnouncementsScreen() {
  const { classId = "" } = useLocalSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const cls = useClass(classId);
  const announcements = useAnnouncements(classId);

  return (
    <Screen
      header={<AppHeader title="Announcements" subtitle={classSubtitle(cls.data)} />}
      refreshing={announcements.isRefetching}
      onRefresh={announcements.refetch}
    >
      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

      <QueryBoundary query={announcements}>
        {(items) => {
          const visible = items.filter((item) => matches(item, filter));
          if (visible.length === 0) return <EmptyView {...EMPTY[filter]} />;
          return visible.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onPress={() => router.push(`/class/${classId}/announcement/${item.id}`)}
            />
          ));
        }}
      </QueryBoundary>
    </Screen>
  );
}
