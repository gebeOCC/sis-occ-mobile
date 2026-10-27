import type { IconName } from "./Icon";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import colors from "@/theme/colors";
import { Icon } from "./Icon";

const TONES = {
  brand: { box: "bg-brand-100", icon: colors.brand[600] },
  warn: { box: "bg-warn-100", icon: colors.warn[600] },
};

const SIZES = {
  sm: { box: "h-11 w-11 rounded-xl", icon: 20 },
  md: { box: "h-14 w-14 rounded-2xl", icon: 26 },
  lg: { box: "h-16 w-16 rounded-2xl", icon: 30 },
};

type IconTileProps = {
  name: IconName;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  className?: string;
};

export function IconTile({ name, tone = "brand", size = "md", className }: IconTileProps) {
  const t = TONES[tone];
  const s = SIZES[size];

  return (
    <View className={cn("items-center justify-center", s.box, t.box, className)}>
      <Icon name={name} size={s.icon} color={t.icon} />
    </View>
  );
}
