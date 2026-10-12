import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/cn";

/**
 * Page shell: safe-area padding, optional fixed header, pull-to-refresh and keyboard-aware scrolling.
 * Pass `tabbed` on tab screens, the tab bar already handles the bottom inset.
 */
export function Screen({
  children,
  header,
  tabbed = false,
  refreshing = false,
  onRefresh,
  contentClassName,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: tabbed ? 0 : insets.bottom }}
    >
      {header}
      <ScrollView
        className="flex-1"
        contentContainerClassName={cn("gap-5 px-5 pb-8 pt-4", contentClassName)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}
