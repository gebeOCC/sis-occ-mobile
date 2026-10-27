import { Screen } from "@/components/ui/Screen";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function LoginScreen() {
  return (
    <Screen contentClassName="grow justify-center py-8">
      <LoginForm />
    </Screen>
  );
}
