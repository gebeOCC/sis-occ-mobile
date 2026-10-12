import { useState } from "react";
import { Text, View } from "react-native";
import { FilterChips } from "@/components/ui/FilterChips";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyView } from "@/components/ui/StateViews";
import { ClassCard } from "@/features/classes/components/ClassCard";
import { useClasses } from "@/features/classes/hooks";
import { TERM_LABEL } from "@/lib/constants";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

// 02 / My Classes
export default function ClassesScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const classes = useClasses();
  const term = search.trim().toLowerCase();

  return (
    <Screen tabbed refreshing={classes.isRefetching} onRefresh={classes.refetch}>
      <View className="gap-1">
        <Text className="text-[28px] font-bold text-ink">My Classes</Text>
        <Text className="text-[14px] text-ink-muted">{TERM_LABEL}</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search your classes…" />
      <FilterChips scrollable options={FILTERS} value={filter} onChange={setFilter} />

      <QueryBoundary query={classes}>
        {(items) => {
          const visible = items.filter(
            (cls) =>
              (filter === "all" || cls.status === filter) &&
              (!term ||
                [cls.code, cls.title, cls.instructor].some((v) => v.toLowerCase().includes(term))),
          );
          if (visible.length === 0) {
            return (
              <EmptyView
                title="No classes found"
                message={
                  term
                    ? "Try a different class code or name."
                    : `You have no ${filter} classes right now.`
                }
              />
            );
          }
          return visible.map((cls) => <ClassCard key={cls.id} cls={cls} />);
        }}
      </QueryBoundary>
    </Screen>
  );
}
