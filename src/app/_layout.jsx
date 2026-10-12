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
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "expo-router/react-navigation";

import {
    AppThemeProvider,
    useAppTheme,
} from "@/theme/ThemeProvider";

// Answer API calls from src/mocks. Set EXPO_PUBLIC_USE_MOCK=false to hit a real backend.
if (process.env.EXPO_PUBLIC_USE_MOCK !== "false") installMockApi();

function AppLayout() {
    const isSignedIn = useIsSignedIn();
    const { scheme, colors } = useAppTheme();

    const baseTheme = scheme === "dark" ? DarkTheme : DefaultTheme;

    const navigationTheme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: colors.brand[600],
            background: colors.background,
            card: colors.card,
            text: colors.ink.DEFAULT,
            border: colors.line,
            notification: colors.danger[500],
        },
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NavigationThemeProvider value={navigationTheme}>
                    <QueryClientProvider client={queryClient}>
                        <StatusBar style={scheme === "dark" ? "light" : "dark"} />

                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: colors.background },
                            }}
                        >
                            <Stack.Protected guard={isSignedIn}>
                                <Stack.Screen name="(tabs)" />
                                <Stack.Screen name="class" />
                            </Stack.Protected>

                            <Stack.Protected guard={!isSignedIn}>
                                <Stack.Screen
                                    name="login"
                                    options={{ animation: "fade" }}
                                />
                            </Stack.Protected>
                        </Stack>

                        <Toaster theme={scheme} />
                    </QueryClientProvider>
                </NavigationThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    return (
        <AppThemeProvider>
            <AppLayout />
        </AppThemeProvider>
    );
}
