import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable, View } from "react-native";
import { cn } from "@/lib/cn";

const TONES = {
  default: "border-line bg-card shadow-sm",
  highlight: "border-brand-200 bg-brand-50",
};

/** Rounded surface. Becomes a pressable button when `onPress` is passed. */
type CardProps = {
  children?: ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
  onPress?: PressableProps["onPress"];
  accessibilityLabel?: string;
};

export function Card({
  children,
  className,
  tone = "default",
  onPress,
  accessibilityLabel,
}: CardProps) {
  const classes = cn("rounded-2xl border p-3.5", TONES[tone], className);

  if (!onPress) return <View className={classes}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn(classes, "active:opacity-80")}
    >
      {children}
    </Pressable>
  );
}
