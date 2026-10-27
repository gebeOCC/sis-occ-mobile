import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

/** Section title with an optional "View all" action. */
type SectionProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function Section({ title, actionLabel = "View all", onAction, children }: SectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-bold text-ink">{title}</Text>
        {onAction ? (
          <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
            <Text className="text-[13px] font-semibold text-brand-600">{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}
