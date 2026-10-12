import { Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { Screen } from "@/components/ui/Screen";
import { useSignOut } from "@/features/auth/hooks";
import { useMe } from "@/features/profile/hooks";
import { cn } from "@/lib/cn";
import { TERM_LABEL } from "@/lib/constants";
import { FilterChips } from "@/components/ui/FilterChips";
import { useAppTheme } from "@/theme/ThemeProvider";

function InfoRow({ label, value, bordered }) {
    return (
        <View
            className={cn(
                "flex-row items-center justify-between px-4 py-3.5",
                bordered && "border-t border-line",
            )}
        >
            <Text className="text-[14px] text-ink-muted">{label}</Text>
            <Text className="text-[14px] font-medium text-ink">{value}</Text>
        </View>
    );
}

export default function ProfileScreen() {
    const me = useMe();
    const signOut = useSignOut();
    const { mode, setMode } = useAppTheme();

    return (
        <Screen tabbed refreshing={me.isRefetching} onRefresh={me.refetch}>
            <QueryBoundary query={me}>
                {(student) => (
                    <>
                        <View className="items-center gap-3 py-4">
                            <Avatar initials={student.initials} size={80} />
                            <View className="items-center gap-0.5">
                                <Text className="text-[22px] font-bold text-ink">{`${student.firstName} ${student.lastName}`}</Text>
                                <Text className="text-[14px] text-ink-muted">{`${student.program} · ${student.yearLevel}`}</Text>
                            </View>
                        </View>

                        <Card className="overflow-hidden p-0">
                            <InfoRow label="Section" value={student.section} />
                            <InfoRow bordered label="Email" value={student.email} />
                            <InfoRow bordered label="Term" value={TERM_LABEL} />
                        </Card>
                        <Card className="gap-3 p-4">
                            <Text className="text-[15px] font-semibold text-ink">
                                Appearance
                            </Text>

                            <FilterChips
                                size="sm"
                                value={mode}
                                onChange={setMode}
                                options={[
                                    { value: "system", label: "System" },
                                    { value: "light", label: "Light" },
                                    { value: "dark", label: "Dark" },
                                ]}
                            />
                        </Card>
                        <Button title="Sign out" variant="secondary" onPress={signOut} />
                    </>
                )}
            </QueryBoundary>
        </Screen>
    );
}
