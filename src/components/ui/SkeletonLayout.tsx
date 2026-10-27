import type { ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { SkeletonBlock } from "./Skeleton";

export function SkeletonSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("gap-3 rounded-2xl border border-line bg-card p-3.5", className)}>
      {children}
    </View>
  );
}

export function SkeletonText({ body = false }: { body?: boolean }) {
  return (
    <View className="min-w-0 flex-1 gap-2">
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-3 w-3/5" />
      {body ? <SkeletonBlock className="h-3 w-full" /> : null}
    </View>
  );
}

export function SkeletonSection({ children }: { children: ReactNode }) {
  return (
    <View className="gap-3">
      <SkeletonBlock className="h-4 w-2/5" />
      {children}
    </View>
  );
}
