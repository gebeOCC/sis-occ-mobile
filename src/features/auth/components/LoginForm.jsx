import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { TextField } from "@/components/ui/TextField";
import { useSessionStore } from "@/store/session";
import colors from "@/theme/colors";

// Prototype login: the fields are cosmetic. Any tap on "Log in" signs the user in.
export function LoginForm() {
  const signIn = useSessionStore((state) => state.signIn);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-8">
      <View className="items-center gap-4">
        <IconTile name="classes" size="lg" />
        <View className="items-center gap-1">
          <Text className="text-[28px] font-bold text-ink">Student Portal</Text>
          <Text className="text-center text-[14px] text-ink-muted">
            Your classes, learning materials, and submissions.
          </Text>
        </View>
      </View>

      <View className="gap-4">
        <TextField
          label="Student ID or email"
          placeholder="Enter your student ID or email"
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={signIn}
          right={
            <Pressable
              onPress={() => setShowPassword((visible) => !visible)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={20} color={colors.ink.muted} />
            </Pressable>
          }
        />
        <Button title="Log in" onPress={signIn} className="mt-2" />
      </View>

      <Text className="text-center text-[12px] text-ink-muted">
        Prototype only: tap Log in to continue. No credentials are checked.
      </Text>
    </View>
  );
}
