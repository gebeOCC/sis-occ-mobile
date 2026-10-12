import { ActivityIndicator, Text, View } from "react-native";
import { cn } from "@/lib/cn";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Button } from "./Button";

export function LoadingView() {
    const { colors } = useAppTheme();
    return (
        <View accessibilityLabel="Loading" className="items-center py-16">
            <ActivityIndicator color={colors.brand[600]} />
        </View>
    );
}

/** `offline` swaps the copy when the request failed because there is no connection. */
export function ErrorView({ onRetry, offline = false }) {
    return (
        <View className="items-center gap-3 px-6 py-16">
            <Text className="text-[16px] font-semibold text-ink">
                {offline ? "You’re offline" : "Couldn’t load this page"}
            </Text>
            <Text className="text-center text-[13px] text-ink-muted">
                {offline
                    ? "Check your internet connection, then try again."
                    : "Something went wrong. Try again in a moment."}
            </Text>
            <Button title="Try again" variant="secondary" onPress={onRetry} className="px-8" />
        </View>
    );
}

export function EmptyView({ title, message, compact = false }) {
    return (
        <View
            className={cn(
                "items-center gap-1 px-4",
                compact ? "rounded-2xl border border-dashed border-line py-6" : "py-16",
            )}
        >
            <Text className="text-[15px] font-semibold text-ink">{title}</Text>
            {message ? <Text className="text-center text-[13px] text-ink-muted">{message}</Text> : null}
        </View>
    );
}
