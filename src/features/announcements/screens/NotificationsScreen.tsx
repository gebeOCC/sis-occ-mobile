import { NotificationsSkeleton } from "../components/NotificationsSkeleton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { useNotificationAnnouncements } from "@/features/announcements/hooks";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import { useAppTheme } from "@/theme/ThemeProvider";

type InboxFilter = "unread" | "all";

export function NotificationsScreen() {
  const router = useRouter();
  const query = useNotificationAnnouncements();
  const [filter, setFilter] = useState<InboxFilter>("unread");
  const { colors } = useAppTheme();
  const unread = query.data?.filter((item) => !item.read).length ?? 0;

  return (
    <Screen
      header={<AppHeader title="Notifications" />}
      refreshing={query.isRefetching}
      onRefresh={query.refetch}
    >
      <View className="gap-1">
        <Text className="text-[26px] font-bold text-ink">Your class updates</Text>
        <Text className="text-[14px] leading-5 text-ink-muted">
          Announcements from all your classes, in one place.
        </Text>
      </View>

      <FilterChips<InboxFilter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: "unread", label: `Unread${unread > 0 ? ` · ${unread}` : ""}` },
          { value: "all", label: "All updates" },
        ]}
      />

      <QueryBoundary loadingFallback={<NotificationsSkeleton />} query={query}>
        {(items) => {
          const visible = filter === "unread" ? items.filter((item) => !item.read) : items;

          if (visible.length === 0) {
            return (
              <View className="items-center gap-4 rounded-3xl border border-line bg-card px-6 py-10">
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                  <Icon name={filter === "unread" ? "check" : "bell"} size={28} />
                </View>
                <View className="gap-1.5">
                  <Text
                    accessibilityRole="header"
                    className="text-center text-[18px] font-bold text-ink"
                  >
                    {filter === "unread" ? "You’re all caught up" : "No updates yet"}
                  </Text>
                  <Text className="text-center text-[14px] leading-5 text-ink-muted">
                    {filter === "unread"
                      ? "New announcements will appear here when your instructors post them."
                      : "Class announcements will appear here once they’re posted."}
                  </Text>
                </View>
                {filter === "unread" && items.length > 0 ? (
                  <Pressable
                    onPress={() => setFilter("all")}
                    accessibilityRole="button"
                    className="min-h-[44px] items-center justify-center px-4"
                  >
                    <Text className="text-[14px] font-semibold text-brand-700">
                      View all updates
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            );
          }

          return (
            <View className="overflow-hidden rounded-2xl border border-line bg-card">
              {visible.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/class/${item.classId}/announcement/${item.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.read ? "Read" : "Unread"}, ${item.classCode}, ${item.title}, ${timeAgo(item.postedAt)}`}
                  className={cn(
                    "flex-row items-start gap-3 px-4 py-4 active:bg-surface",
                    !item.read && "bg-brand-50",
                    index > 0 && "border-t border-line",
                  )}
                >
                  <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-xl border border-line bg-card">
                    <Icon
                      name="megaphone"
                      size={20}
                      color={item.read ? colors.ink.muted : colors.brand[600]}
                    />
                  </View>
                  <View className="min-w-0 flex-1 gap-1.5">
                    <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
                      <Text className="text-[11px] font-bold tracking-wide text-brand-700">
                        {item.classCode}
                      </Text>
                      <Text className="text-[12px] text-ink-muted">{timeAgo(item.postedAt)}</Text>
                      {item.pinned ? <Icon name="pin" size={12} color={colors.ink.muted} /> : null}
                    </View>
                    <Text
                      numberOfLines={2}
                      className={cn(
                        "text-[15px] leading-5 text-ink",
                        item.read ? "font-medium" : "font-bold",
                      )}
                    >
                      {item.title}
                    </Text>
                    <Text numberOfLines={2} className="text-[13px] leading-5 text-ink-soft">
                      {item.body.replace(/\s+/g, " ")}
                    </Text>
                  </View>
                  <View className="min-h-[40px] items-center justify-center">
                    {!item.read ? (
                      <View className="h-2 w-2 rounded-full bg-brand-600" />
                    ) : (
                      <Icon name="next" size={16} color={colors.ink.muted} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          );
        }}
      </QueryBoundary>
    </Screen>
  );
}
