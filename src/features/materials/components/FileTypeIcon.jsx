import { Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";

const BADGES = {
  pdf: { label: "PDF", box: "bg-danger-600" },
  zip: { label: "ZIP", box: "bg-slate-600" },
};

/** Icon for a resource: coloured badge for documents, tiles for links and images. */
export function FileTypeIcon({ kind }) {
  if (kind === "link") return <IconTile name="link" size="sm" />;

  if (kind === "image") {
    return (
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
        <Icon name="image" size={22} color="#FFFFFF" />
      </View>
    );
  }

  const badge = BADGES[kind] ?? {
    label: String(kind).slice(0, 4).toUpperCase(),
    box: "bg-slate-600",
  };
  return (
    <View className={cn("h-11 w-9 items-center justify-center rounded-md", badge.box)}>
      <Text className="text-[10px] font-extrabold text-white">{badge.label}</Text>
    </View>
  );
}
