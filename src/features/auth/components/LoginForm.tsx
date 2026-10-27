import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { TextField } from "@/components/ui/TextField";
import { useSessionStore } from "@/store/session";
import colors from "@/theme/colors";
import { loginSchema } from "../schema";

export function LoginForm() {
  const router = useRouter();
  const signIn = useSessionStore((state) => state.signIn);
  const identifierRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const enterPortal = () => {
    Keyboard.dismiss();
    signIn();
  };

  const logIn = () => {
    const result = loginSchema.safeParse({ identifier, password });
    if (!result.success) {
      setErrors({
        identifier: result.error.issues.find((issue) => issue.path[0] === "identifier")?.message,
        password: result.error.issues.find((issue) => issue.path[0] === "password")?.message,
      });
      if (result.error.issues.some((issue) => issue.path[0] === "identifier")) {
        identifierRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }
    setErrors({});
    enterPortal();
  };

  return (
    <View className="w-full max-w-md gap-6 self-center">
      <View className="gap-6">
        <View className="flex-row items-center gap-3">
          <IconTile name="classes" size="sm" />
          <View className="gap-0.5">
            <Text className="text-[15px] font-bold text-ink">Student Portal</Text>
            <Text className="text-[12px] text-ink-muted">Your campus companion</Text>
          </View>
        </View>
        <View className="gap-2">
          <Text accessibilityRole="header" className="text-[32px] font-bold leading-10 text-ink">
            Welcome back.
          </Text>
          <Text className="text-[15px] leading-6 text-ink-soft">
            Stay on top of your classes, deadlines, and everything in between.
          </Text>
        </View>
      </View>

      <View className="gap-5">
        <TextField
          ref={identifierRef}
          label="Student ID or email"
          placeholder="Your student ID or school email"
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          submitBehavior="submit"
          value={identifier}
          onChangeText={(value) => {
            setIdentifier(value);
            setErrors((current) => ({ ...current, identifier: undefined }));
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={errors.identifier}
          className="min-h-[52px]"
        />

        <TextField
          ref={passwordRef}
          label="Password"
          labelAccessory={
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/forgot-password",
                  params: { email: identifier.includes("@") ? identifier.trim() : "" },
                })
              }
              accessibilityRole="link"
              className="min-h-[44px] justify-center py-2"
            >
              <Text className="text-[13px] font-semibold text-brand-700">Forgot password?</Text>
            </Pressable>
          }
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          onSubmitEditing={logIn}
          error={errors.password}
          className="min-h-[52px]"
          right={
            <Pressable
              onPress={() => setShowPassword((visible) => !visible)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              accessibilityState={{ selected: showPassword }}
              className="h-11 w-11 items-center justify-center rounded-lg"
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={20} color={colors.ink.muted} />
            </Pressable>
          }
        />

        <Button title="Log in" icon="arrowRight" onPress={logIn} className="min-h-[52px]" />
      </View>

      <View className="gap-1">
        <Pressable
          onPress={enterPortal}
          accessibilityRole="button"
          className="min-h-[44px] items-center justify-center py-2"
        >
          <Text className="text-[14px] text-ink-muted">
            Just exploring? <Text className="font-semibold text-brand-700">Explore demo</Text>
          </Text>
        </Pressable>
        <Text className="text-center text-[12px] leading-5 text-ink-muted">
          Prototype preview. Login credentials aren’t verified.
        </Text>
      </View>
    </View>
  );
}
