import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/cn";

const TONES = {
  info: { box: "border-brand-200 bg-brand-50", title: "text-brand-700" },
  warning: { box: "border-warn-100 bg-warn-100", title: "text-warn-700" },
  danger: { box: "border-danger-100 bg-danger-100", title: "text-danger-600" },
  success: { box: "border-success-100 bg-success-100", title: "text-success-700" },
};

/** Inline message for statuses and instructor feedback. */
export type NoticeTone = keyof typeof TONES;
type NoticeProps = { tone?: NoticeTone; title?: string; children?: ReactNode };

export function Notice({ tone = "info", title, children }: NoticeProps) {
  const t = TONES[tone];

  return (
    <View accessibilityRole="alert" className={cn("gap-1 rounded-xl border p-3.5", t.box)}>
      {title ? <Text className={cn("text-[13px] font-bold", t.title)}>{title}</Text> : null}
      <Text className="text-[14px] leading-5 text-ink">{children}</Text>
    </View>
  );
}
