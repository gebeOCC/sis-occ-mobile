import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/lib/cn";

/**
 * options: [{ value, label }]. Use `scrollable` for rows that may not fit on small screens,
 * and size="sm" for compact quick-navigation pills.
 */
export function FilterChips({ options, value, onChange, scrollable = false, size = "md" }) {
  const chips = options.map((option) => {
    const active = option.value === value;
    return (
      <Pressable
        key={option.value}
        onPress={() => onChange(option.value)}
        hitSlop={{ top: 4, bottom: 4 }}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        className={cn(
          "items-center justify-center rounded-full",
          size === "sm" ? "min-h-[36px] px-4 py-1.5" : "min-h-[40px] px-5 py-2",
          active ? "bg-brand-600" : "bg-surface",
        )}
      >
        <Text
          className={cn(
            "font-semibold",
            size === "sm" ? "text-[13px]" : "text-[14px]",
              active ? "text-contrast" : "text-ink-soft",
          )}
        >
          {option.label}
        </Text>
      </Pressable>
    );
  });

  if (!scrollable) return <View className="flex-row flex-wrap gap-2.5">{chips}</View>;

  // Bleeds to the screen edges (the page has px-5) so chips scroll under the margin.
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5 grow-0"
      contentContainerClassName="gap-2.5 px-5"
    >
      {chips}
    </ScrollView>
  );
}
