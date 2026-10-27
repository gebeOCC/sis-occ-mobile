import { Stack } from "expo-router";

// Keeps every class screen in one navigator, so the root layout guards them with a single entry.
export default function ClassLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
