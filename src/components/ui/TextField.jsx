import { Text, TextInput, View } from "react-native";
import { cn } from "@/lib/cn";
import { useAppTheme } from "@/theme/ThemeProvider";

/**
 * Labelled input with inline error text. Forward any TextInput prop.
 * `right` adds a trailing control, `hint` shows helper text while there is no error.
 */
export function TextField({ label, error, hint, right, className, ...inputProps }) {
    const { colors } = useAppTheme();
    return (
        <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-ink">{label}</Text>
            <View className="justify-center">
                <TextInput
                    accessibilityLabel={label}
                    placeholderTextColor={colors.ink.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={cn(
                        "min-h-[48px] rounded-xl border bg-surface px-3.5 text-[15px] text-ink",
                        right && "pr-12",
                        error ? "border-danger-500" : "border-line",
                        className,
                    )}
                    {...inputProps}
                />
                {right ? (
                    <View className="absolute inset-y-0 right-0 w-12 items-center justify-center">
                        {right}
                    </View>
                ) : null}
            </View>
            {error ? (
                <Text className="text-[12px] text-danger-600">{error}</Text>
            ) : hint ? (
                <Text className="text-[12px] text-ink-muted">{hint}</Text>
            ) : null}
        </View>
    );
}
