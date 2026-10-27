import { useLocalSearchParams } from "expo-router";
import { AppHeader } from "@/components/ui/AppHeader";
import { Screen } from "@/components/ui/Screen";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export function ForgotPasswordScreen() {
  const { email = "" } = useLocalSearchParams<{ email?: string }>();

  return (
    <Screen
      header={<AppHeader title="Password recovery" />}
      contentClassName="grow justify-center py-8"
    >
      <ForgotPasswordForm initialEmail={email} />
    </Screen>
  );
}
