import type { IconName } from "./Icon";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { cn } from "@/lib/cn";
import colors from "@/theme/colors";
import { Icon } from "./Icon";
import { useAppTheme } from "@/theme/ThemeProvider";

const VARIANTS = {
  primary: {
    box: "bg-brand-600 active:bg-brand-700",
    text: "text-contrast",
    accent: "contrast",
  },
  secondary: {
    box: "border border-line bg-card active:bg-surface",
    text: "text-ink",
    accent: colors.brand[600],
  },
};

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  variant?: keyof typeof VARIANTS;
  className?: string;
};

export function Button({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: ButtonProps) {
  const { resolveColor } = useAppTheme();
  const v = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className={cn(
        "min-h-[48px] flex-row items-center justify-center gap-2 rounded-xl px-4 py-2.5",
        v.box,
        inactive && "opacity-60",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={resolveColor(v.accent)} />
      ) : icon ? (
        <Icon name={icon} size={18} color={v.accent} />
      ) : null}
      <Text className={cn("text-[15px] font-semibold", v.text)}>{title}</Text>
    </Pressable>
  );
}
