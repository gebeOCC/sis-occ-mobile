import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "@/components/ui/AppHeader";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
import { EmptyView } from "@/components/ui/StateViews";
import { AnnouncementHighlight } from "@/features/announcements/components/AnnouncementHighlight";
import { ClassHeader } from "@/features/classes/components/ClassHeader";
import { ResourceList } from "@/features/classes/components/ResourceList";
import { useClass } from "@/features/classes/hooks";

// 03 / Class Overview: the hub for one class.
export default function ClassOverviewScreen() {
  const { classId = "" } = useLocalSearchParams();
  const router = useRouter();
  const query = useClass(classId);

  return (
    <Screen
      header={<AppHeader title={query.data?.code ?? "Class"} subtitle={query.data?.title} />}
      refreshing={query.isRefetching}
      onRefresh={query.refetch}
    >
      <QueryBoundary query={query}>
        {(cls) => (
          <>
            <ClassHeader cls={cls} />

            <Section
              title="Class announcements"
              onAction={
                cls.highlight ? () => router.push(`/class/${cls.id}/announcements`) : undefined
              }
            >
              {cls.highlight ? (
                <AnnouncementHighlight
                  item={cls.highlight}
                  onPress={() => router.push(`/class/${cls.id}/announcement/${cls.highlight.id}`)}
                />
              ) : (
                <EmptyView compact title="No announcements yet" />
              )}
            </Section>

            <Section title="Explore this class">
              <ResourceList cls={cls} />
            </Section>
          </>
        )}
      </QueryBoundary>
    </Screen>
  );
}
