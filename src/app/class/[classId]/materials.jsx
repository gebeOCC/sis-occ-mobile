import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { FilterChips } from "@/components/ui/FilterChips";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyView } from "@/components/ui/StateViews";
import { useClass } from "@/features/classes/hooks";
import { classSubtitle } from "@/features/classes/utils";
import { MaterialRow } from "@/features/materials/components/MaterialRow";
import { useMaterials } from "@/features/materials/hooks";
import { downloadFile, openLink, previewFile } from "@/lib/files";

const CATEGORY_OF = {
  pdf: "documents",
  zip: "documents",
  image: "images",
  link: "links",
  video: "videos",
};
const CATEGORY_LABELS = {
  documents: "Documents",
  images: "Images",
  links: "Links",
  videos: "Videos",
};
const categoryOf = (item) => CATEGORY_OF[item.kind] ?? "documents";

// Only offer filters for the kinds of resource this class actually has.
const buildFilters = (items) => {
  const present = new Set(items.map(categoryOf));
  return [
    { value: "all", label: "All" },
    ...Object.entries(CATEGORY_LABELS)
      .filter(([value]) => present.has(value))
      .map(([value, label]) => ({ value, label })),
  ];
};

// 05 / Materials
export default function MaterialsScreen() {
  const { classId = "" } = useLocalSearchParams();
  const cls = useClass(classId);
  const materials = useMaterials(classId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const term = search.trim().toLowerCase();

  return (
    <Screen
      header={<AppHeader title="Materials" subtitle={classSubtitle(cls.data)} />}
      refreshing={materials.isRefetching}
      onRefresh={materials.refetch}
    >
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search materials…" />

      <QueryBoundary query={materials}>
        {(items) => {
          if (items.length === 0) {
            return (
              <EmptyView
                title="No materials yet"
                message="Files and links your instructor shares show up here."
              />
            );
          }

          const filters = buildFilters(items);
          const active = filters.some((option) => option.value === filter) ? filter : "all";
          const visible = items.filter(
            (item) =>
              (active === "all" || categoryOf(item) === active) &&
              item.title.toLowerCase().includes(term),
          );

          return (
            <>
              {filters.length > 2 ? (
                <FilterChips scrollable options={filters} value={active} onChange={setFilter} />
              ) : null}

              {visible.length === 0 ? (
                <EmptyView title="No resources found" message="Try another search or filter." />
              ) : (
                <>
                  {visible.map((item) => (
                    <MaterialRow
                      key={item.id}
                      item={item}
                      onOpen={() =>
                        item.kind === "link" ? openLink(item.url) : previewFile(item.title)
                      }
                      onDownload={() => downloadFile(item.title)}
                    />
                  ))}
                  <Text className="text-center text-[13px] text-ink-muted">
                    Tap a resource to preview or download.
                  </Text>
                </>
              )}
            </>
          );
        }}
      </QueryBoundary>
    </Screen>
  );
}
