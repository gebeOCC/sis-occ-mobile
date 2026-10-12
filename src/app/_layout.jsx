import "../../global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { useIsSignedIn } from "@/features/auth/hooks";
import { queryClient } from "@/lib/queryClient";
import { installMockApi } from "@/mocks/install";

// Answer API calls from src/mocks. Set EXPO_PUBLIC_USE_MOCK=false to hit a real backend.
if (process.env.EXPO_PUBLIC_USE_MOCK !== "false") installMockApi();

export default function RootLayout() {
  const isSignedIn = useIsSignedIn();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Signed in: the app. Signed out: only Login. Expo Router redirects when this flips. */}
            <Stack.Protected guard={isSignedIn}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="class" />
            </Stack.Protected>
            <Stack.Protected guard={!isSignedIn}>
              <Stack.Screen name="login" options={{ animation: "fade" }} />
            </Stack.Protected>
          </Stack>
          <Toaster />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
