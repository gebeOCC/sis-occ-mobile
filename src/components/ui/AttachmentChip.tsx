import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native";
import colors from "@/theme/colors";
import { Icon } from "./Icon";

/** File attached to an announcement or assignment. Tapping it downloads. */
type AttachmentChipProps = {
  attachment: { name: string; size: string };
  onPress?: PressableProps["onPress"];
};

export function AttachmentChip({ attachment, onPress }: AttachmentChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Download ${attachment.name}, ${attachment.size}`}
      className="min-h-[48px] flex-row items-center gap-2.5 rounded-xl border border-line bg-surface px-3 active:opacity-80"
    >
      <Icon name="paperclip" size={16} color={colors.ink.soft} />
      <Text numberOfLines={1} className="flex-1 text-[13px] font-medium text-ink">
        {attachment.name}
      </Text>
      <Text className="text-[12px] text-ink-muted">{attachment.size}</Text>
      <Icon name="download" size={18} />
    </Pressable>
  );
}
