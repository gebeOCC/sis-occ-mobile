import { Text, View } from "react-native";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { SkeletonBlock, SkeletonGroup } from "./Skeleton";
import { SkeletonSurface, SkeletonText } from "./SkeletonLayout";

export function LoadingView() {
  return (
    <SkeletonGroup>
      {[0, 1, 2].map((key) => (
        <SkeletonSurface key={key} className="flex-row items-center gap-3">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <SkeletonText />
        </SkeletonSurface>
      ))}
    </SkeletonGroup>
  );
}

/** `offline` swaps the copy when the request failed because there is no connection. */
type ErrorViewProps = { onRetry?: () => void; offline?: boolean };

export function ErrorView({ onRetry, offline = false }: ErrorViewProps) {
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

type EmptyViewProps = { title: string; message?: string; compact?: boolean };

export function EmptyView({ title, message, compact = false }: EmptyViewProps) {
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
