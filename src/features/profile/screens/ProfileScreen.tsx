import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { useSignOut } from "@/features/auth/hooks";
import { useMe } from "@/features/profile/hooks";
import { cn } from "@/lib/cn";
import { TERM_LABEL } from "@/lib/constants";
import { useAppTheme, type ThemeMode } from "@/theme/ThemeProvider";

const APPEARANCE: { value: ThemeMode; label: string; hint: string }[] = [
  { value: "system", label: "System", hint: "Match your device's appearance." },
  { value: "light", label: "Light", hint: "Use a light appearance." },
  { value: "dark", label: "Dark", hint: "Use a dark appearance." },
];

function AccountAction({
  icon,
  title,
  hint,
  onPress,
  bordered = false,
  destructive = false,
}: {
  icon: IconName;
  title: string;
  hint?: string;
  onPress: () => void;
  bordered?: boolean;
  destructive?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={hint}
      className={cn(
        "min-h-[48px] flex-row items-center gap-3 px-3.5 py-3 active:bg-surface",
        bordered && "border-t border-line",
      )}
    >
      <Icon name={icon} size={18} color={destructive ? colors.danger[600] : colors.ink.soft} />
      <Text
        className={cn(
          "min-w-0 flex-1 text-[14px] font-medium",
          destructive ? "text-danger-600" : "text-ink",
        )}
      >
        {title}
      </Text>
      {!destructive ? <Icon name="next" size={16} color={colors.ink.muted} /> : null}
    </Pressable>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const me = useMe();
  const signOut = useSignOut();
  const { mode, setMode, colors } = useAppTheme();

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You can log in again whenever you're ready.", [
      { text: "Stay signed in", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);

  return (
    <Screen
      tabbed
      refreshing={me.isRefetching}
      onRefresh={me.refetch}
      contentClassName="gap-4 pb-5"
    >
      <Text accessibilityRole="header" className="text-[24px] font-bold leading-8 text-ink">
        Profile
      </Text>

      <QueryBoundary loadingFallback={<ProfileSkeleton />} query={me}>
        {(student) => (
          <>
            <Card className="gap-3 p-3.5">
              <View className="flex-row items-center gap-3">
                <Avatar initials={student.initials} size={48} />
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text className="text-[19px] font-bold leading-6 text-ink">{`${student.firstName} ${student.lastName}`}</Text>
                  <Text className="text-[13px] leading-5 text-ink-soft">
                    {`${student.program} · ${student.yearLevel} · ${student.section}`}
                  </Text>
                </View>
              </View>
              <View className="gap-1.5 border-t border-line pt-3">
                <View className="flex-row items-start gap-2">
                  <View className="pt-0.5">
                    <Icon name="mail" size={15} color={colors.ink.muted} />
                  </View>
                  <Text
                    selectable
                    accessibilityLabel={`Registered email, ${student.email}`}
                    className="min-w-0 flex-1 text-[13px] leading-5 text-ink"
                  >
                    {student.email}
                  </Text>
                </View>
                <Text className="text-[13px] leading-5 text-ink-muted">{TERM_LABEL}</Text>
              </View>
            </Card>

            <View className="gap-2">
              <Text accessibilityRole="header" className="text-[14px] font-semibold text-ink">
                Appearance
              </Text>
              <View
                accessibilityRole="radiogroup"
                accessibilityLabel="Appearance"
                className="flex-row flex-wrap gap-1 rounded-xl border border-line bg-surface p-1"
              >
                {APPEARANCE.map((option) => {
                  const selected = mode === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setMode(option.value)}
                      accessibilityRole="radio"
                      accessibilityLabel={`${option.label} appearance`}
                      accessibilityHint={option.hint}
                      accessibilityState={{ checked: selected }}
                      className={cn(
                        "min-h-[44px] min-w-[72px] flex-1 items-center justify-center rounded-lg px-2 py-2 active:opacity-75",
                        selected && "bg-brand-600",
                      )}
                    >
                      <Text
                        className={cn(
                          "text-center text-[13px] font-semibold",
                          selected ? "text-contrast" : "text-ink-soft",
                        )}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-2">
              <Text accessibilityRole="header" className="text-[14px] font-semibold text-ink">
                Account
              </Text>
              <Card className="overflow-hidden p-0">
                <AccountAction
                  icon="bell"
                  title="Notifications"
                  hint="Open announcements from your classes."
                  onPress={() => router.push("/notifications")}
                />
                <AccountAction
                  bordered
                  icon="lock"
                  title="Password recovery"
                  hint="Request a reset link for your registered email."
                  onPress={() =>
                    router.push({ pathname: "/forgot-password", params: { email: student.email } })
                  }
                />
                <AccountAction
                  bordered
                  destructive
                  icon="logOut"
                  title="Sign out"
                  hint="You will be asked to confirm."
                  onPress={confirmSignOut}
                />
              </Card>
            </View>
          </>
        )}
      </QueryBoundary>
    </Screen>
  );
}
