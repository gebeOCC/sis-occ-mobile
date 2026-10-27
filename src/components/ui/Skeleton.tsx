import { useEffect, useState, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, View } from "react-native";
import { cn } from "@/lib/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  return <View accessible={false} className={cn("h-4 rounded-md bg-line", className)} />;
}

/** One animation per loading region, with a static fallback when Reduce Motion is enabled. */
export function SkeletonGroup({
  children,
  label = "Loading content",
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let disposed = false;
    let motionChanged = false;
    let animation: Animated.CompositeAnimation | undefined;

    const updateMotion = (reduceMotion: boolean) => {
      if (disposed) return;
      animation?.stop();
      opacity.setValue(1);
      if (reduceMotion) return;

      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.45,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      );
      animation.start();
    };

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      motionChanged = true;
      updateMotion(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!motionChanged) updateMotion(enabled);
      })
      .catch(() => {
        // Leave placeholders static when the device preference is unavailable.
      });

    return () => {
      disposed = true;
      subscription.remove();
      animation?.stop();
    };
  }, [opacity]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
    >
      <Animated.View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={cn("gap-5", className)}
        style={{ opacity }}
      >
        {children}
      </Animated.View>
    </View>
  );
}
