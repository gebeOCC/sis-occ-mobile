import type { Material } from "@/features/materials/types";
import { Pressable, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { FileTypeIcon } from "./FileTypeIcon";

const KIND_LABELS: Record<string, string> = {
  pdf: "PDF",
  zip: "ZIP",
  image: "Image",
  video: "Video",
};

const metaLabel = (item: Material) => {
  if (item.kind === "link") return "Website";
  const type = KIND_LABELS[item.kind] ?? String(item.kind).toUpperCase();
  return item.size ? `${type} · ${item.size}` : type;
};

/**
 * Compact resource row. Tapping the row opens/previews it; files also get a separate
 * download button. Links have no download, so none is shown.
 */
export function MaterialRow({
  item,
  onOpen,
  onDownload,
}: {
  item: Material;
  onOpen: () => void;
  onDownload: () => void;
}) {
  const isLink = item.kind === "link";

  return (
    <Card className="flex-row items-center p-0">
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title}, ${metaLabel(item)}`}
        className="min-h-[64px] flex-1 flex-row items-center gap-3 p-3 active:opacity-80"
      >
        <View className="w-11 items-center">
          <FileTypeIcon kind={item.kind} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text numberOfLines={1} className="text-[15px] font-semibold text-ink">
            {item.title}
          </Text>
          <Text className="text-[12px] text-ink-muted">{metaLabel(item)}</Text>
        </View>
        {isLink ? <Icon name="external" size={20} /> : null}
      </Pressable>
      {!isLink ? (
        <Pressable
          onPress={onDownload}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Download ${item.title}`}
          className="h-12 w-12 items-center justify-center active:opacity-60"
        >
          <Icon name="download" size={20} />
        </Pressable>
      ) : null}
    </Card>
  );
}
