import { useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { AssignmentRow } from "@/features/assignments/components/AssignmentRow";

const GROUPS = [
    // { key: "overdue", title: "Overdue" },
    // { key: "needsRevision", title: "Needs revision" },
    { key: "dueSoon", title: "Due soon" },
    // { key: "upcoming", title: "Upcoming" },
];

/** Show a short preview of every outstanding state; only the global banner says caught up. */
export function HomeTaskGroups({ groups, counts }) {
    const router = useRouter();

    return GROUPS.filter(({ key }) => groups[key]?.length > 0).map(({ key, title }) => (
        <Section
            key={key}
            title={`${title} · ${counts[key]}`}
            actionLabel="View tasks"
            onAction={() => router.navigate("/tasks")}
        >
            <Card className="overflow-hidden p-0">
                {groups[key].map((item, index) => (
                    <AssignmentRow key={item.id} assignment={item} bordered={index > 0} />
                ))}
            </Card>
        </Section>
    ));
}
