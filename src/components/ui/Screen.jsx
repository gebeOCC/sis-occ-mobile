import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/cn";
import { useAppTheme } from "@/theme/ThemeProvider";

export function Screen({
    children,
    header,
    tabbed = false,
    refreshing = false,
    onRefresh,
    contentClassName,
}) {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();

    return (
        <View
            className="flex-1 bg-background"
            style={{
                paddingTop: insets.top,
                paddingBottom: tabbed ? 0 : insets.bottom,
            }}
        >
            {header}

            <ScrollView
                className="flex-1"
                contentContainerClassName={cn(
                    "gap-5 px-5 pb-8 pt-4",
                    contentClassName
                )}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.brand[600]}
                            colors={[colors.brand[600]]}
                            progressBackgroundColor={colors.card}
                        />
                    ) : undefined
                }
            >
                {children}
            </ScrollView>
        </View>
    );
}