import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useAppTheme } from "@/theme/ThemeProvider";

const TABS = [
  { name: "index", title: "Home", icon: "home" },
  { name: "classes", title: "Classes", icon: "classes" },
  { name: "tasks", title: "Tasks", icon: "tasks" },
  { name: "profile", title: "Profile", icon: "profile" },
] as const;

export default function TabsLayout() {
  const { colors } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand[600],
        tabBarInactiveTintColor: colors.ink.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
        },
      }}
    >
      {TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Icon name={icon} size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
