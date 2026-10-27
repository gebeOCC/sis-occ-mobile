import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { useIsSignedIn, usePasswordReset } from "../hooks";
import { passwordResetSchema } from "../schema";

export function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const reset = usePasswordReset();
  const isSignedIn = useIsSignedIn();
  const returnLabel = isSignedIn ? "Back to profile" : "Back to login";
  const returnToAccount = () => router.replace(isSignedIn ? "/profile" : "/login");
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string>();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const submit = () => {
    const result = passwordResetSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    setEmailError(undefined);
    Keyboard.dismiss();
    setSubmittedEmail(result.data.email);
    reset.mutate(result.data.email);
  };

  if (reset.isSuccess) {
    const isDemo = reset.data.demo === true;
    return (
      <View className="w-full max-w-md gap-6 self-center">
        <View className="items-center gap-4">
          <IconTile name="mail" size="md" />
          <View className="gap-2">
            <Text
              accessibilityRole="header"
              className="text-center text-[28px] font-bold leading-9 text-ink"
            >
              {isDemo ? "Recovery preview" : "Check your inbox"}
            </Text>
            <Text className="text-center text-[15px] leading-6 text-ink-soft">
              {isDemo
                ? "This preview doesn’t send email or change your password."
                : "If an account is linked to this email, you’ll receive a password reset link."}
            </Text>
          </View>
        </View>

        <View className="gap-1.5">
          <Text selectable className="text-center text-[16px] font-semibold text-ink">
            {submittedEmail}
          </Text>
          {!isDemo ? (
            <Text className="text-center text-[13px] leading-5 text-ink-muted">
              Check your spam folder too.
            </Text>
          ) : null}
        </View>

        <View className="gap-1">
          <Button title={returnLabel} onPress={returnToAccount} />
          <Pressable
            onPress={() => {
              reset.reset();
              setEmailError(undefined);
            }}
            accessibilityRole="button"
            className="min-h-[44px] items-center justify-center py-2"
          >
            <Text className="text-[14px] font-semibold text-brand-700">Use another email</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const requestError = isAxiosError<{ message?: string }>(reset.error)
    ? reset.error.response?.data?.message
    : undefined;

  return (
    <View className="w-full max-w-md gap-6 self-center">
      <View className="gap-5">
        <IconTile name="lock" size="lg" />
        <View className="gap-2">
          <Text accessibilityRole="header" className="text-[30px] font-bold leading-10 text-ink">
            Let’s get you back in.
          </Text>
          <Text className="text-[15px] leading-6 text-ink-soft">
            Enter the email linked to your student account to request a password reset link.
          </Text>
        </View>
      </View>

      <View className="gap-5">
        <TextField
          label="School email"
          placeholder="you@school.edu"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          editable={!reset.isPending}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError(undefined);
            if (reset.isError) reset.reset();
          }}
          onSubmitEditing={reset.isPending ? undefined : submit}
          error={emailError}
          className="min-h-[52px]"
        />
        {reset.isError ? (
          <Notice tone="danger" title="We couldn’t send your request">
            {requestError ?? "Check your connection and try again."}
          </Notice>
        ) : null}
        <Button
          title={reset.isError ? "Try again" : "Send reset link"}
          icon="mail"
          onPress={submit}
          loading={reset.isPending}
          className="min-h-[52px]"
        />
      </View>

      <Pressable
        onPress={returnToAccount}
        accessibilityRole="link"
        className="min-h-[44px] items-center justify-center py-2"
      >
        <Text className="text-[14px] font-semibold text-brand-700">{returnLabel}</Text>
      </Pressable>
    </View>
  );
}
