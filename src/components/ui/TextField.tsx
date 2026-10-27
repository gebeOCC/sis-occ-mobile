import { useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import { cn } from "@/lib/cn";
import { useAppTheme } from "@/theme/ThemeProvider";

/**
 * Labelled input with inline error text. Forward any TextInput prop.
 * `right` adds a trailing control, `hint` shows helper text while there is no error.
 * `labelAccessory` places an action beside the label.
 */
export type TextFieldProps = ComponentPropsWithRef<typeof TextInput> & {
  label: string;
  labelAccessory?: ReactNode;
  error?: string;
  hint?: string;
  right?: ReactNode;
};

export function TextField({
  label,
  labelAccessory,
  error,
  hint,
  right,
  className,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-1.5">
      <View className="flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <Text className="text-[13px] font-semibold text-ink">{label}</Text>
        {labelAccessory}
      </View>
      <View className="justify-center">
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.ink.muted}
          autoCapitalize="none"
          autoCorrect={false}
          className={cn(
            "min-h-[48px] rounded-xl border bg-surface px-3.5 text-[15px] text-ink",
            right && "pr-12",
            error ? "border-danger-500" : focused ? "border-brand-600" : "border-line",
            className,
          )}
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        {right ? (
          <View className="absolute inset-y-0 right-0 w-12 items-center justify-center">
            {right}
          </View>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-[12px] text-danger-600">
          {error}
        </Text>
      ) : hint ? (
        <Text className="text-[12px] text-ink-muted">{hint}</Text>
      ) : null}
    </View>
  );
}
