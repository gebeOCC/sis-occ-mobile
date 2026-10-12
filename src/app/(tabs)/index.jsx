import { useRouter } from "expo-router";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
import { EmptyView } from "@/components/ui/StateViews";
import { AnnouncementPreview } from "@/features/announcements/components/AnnouncementPreview";
import { TodayClassCard } from "@/features/classes/components/TodayClassCard";
import { HomeTaskGroups } from "@/features/home/components/HomeTaskGroups";
import { HeroBanner } from "@/features/home/components/HeroBanner";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { useHome } from "@/features/home/hooks";

// 01 / Home: deadlines first, then today's schedule, then the latest announcement.
export default function HomeScreen() {
  const router = useRouter();
  const home = useHome();

  return (
    <Screen tabbed refreshing={home.isRefetching} onRefresh={home.refetch}>
      <QueryBoundary query={home}>
        {(data) => {
          const { schedule, latestAnnouncement } = data;
          const isNext = schedule.kind === "next";

          return (
            <>
              <HomeHeader student={data.student} hasUnread={data.hasUnreadNotifications} />
              <HeroBanner counts={data.taskSummary} onPress={() => router.navigate("/tasks")} />

              <HomeTaskGroups groups={data.taskGroups} counts={data.taskSummary} />

              <Section
                title={isNext ? "Next class" : "Today’s classes"}
                onAction={() => router.navigate("/classes")}
              >
                {schedule.classes.length > 0 ? (
                  schedule.classes.map((cls) => (
                    <TodayClassCard
                      key={cls.id}
                      cls={cls}
                      whenLabel={isNext ? schedule.whenLabel : undefined}
                    />
                  ))
                ) : (
                  <EmptyView compact title="No classes scheduled" />
                )}
              </Section>

              <Section
                title="Latest announcement"
                onAction={
                  latestAnnouncement
                    ? () => router.push(`/class/${latestAnnouncement.classId}/announcements`)
                    : undefined
                }
              >
                {latestAnnouncement ? (
                  <AnnouncementPreview item={latestAnnouncement} />
                ) : (
                  <EmptyView compact title="No announcements yet" />
                )}
              </Section>
            </>
          );
        }}
      </QueryBoundary>
    </Screen>
  );
}
