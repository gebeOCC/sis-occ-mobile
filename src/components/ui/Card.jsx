import { Pressable, View } from "react-native";
import { cn } from "@/lib/cn";

const TONES = {
  default: "border-line bg-white shadow-sm",
  highlight: "border-brand-200 bg-brand-50",
};

/** Rounded surface. Becomes a pressable button when `onPress` is passed. */
export function Card({ children, className, tone = "default", onPress, accessibilityLabel }) {
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
