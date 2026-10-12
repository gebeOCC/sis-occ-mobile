import { Text, View } from "react-native";
import { cn } from "@/lib/cn";
import colors from "@/theme/colors";
import { Icon } from "./Icon";

const TONES = {
  info: { box: "bg-brand-100", text: "text-brand-700", icon: colors.brand[700] },
  warning: { box: "bg-warn-100", text: "text-warn-700", icon: colors.warn[700] },
  success: { box: "bg-success-100", text: "text-success-700", icon: colors.success[700] },
  danger: { box: "bg-danger-100", text: "text-danger-600", icon: colors.danger[600] },
  neutral: { box: "bg-surface", text: "text-ink-soft", icon: colors.ink.soft },
    solid: {
        box: "bg-brand-600",
        text: "text-contrast",
        icon: "contrast",
    },
};

export function Badge({ label, tone = "info", icon, className }) {
  const t = TONES[tone];

  return (
    <View
      className={cn(
        "flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1",
        t.box,
        className,
      )}
    >
      {icon ? <Icon name={icon} size={13} color={t.icon} /> : null}
      <Text className={cn("text-[12px] font-semibold", t.text)}>{label}</Text>
    </View>
  );
}
