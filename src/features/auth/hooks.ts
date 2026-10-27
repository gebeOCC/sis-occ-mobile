import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useSessionStore } from "@/store/session";
import { requestPasswordReset } from "./api";

export const useIsSignedIn = () => useSessionStore((state) => Boolean(state.token));

export const usePasswordReset = () => useMutation({ mutationFn: requestPasswordReset });

/** Signs out and drops cached server data. The route guard in app/_layout.tsx returns to Login. */
export function useSignOut() {
  const queryClient = useQueryClient();
  const signOut = useSessionStore((state) => state.signOut);

  return () => {
    signOut();
    queryClient.clear();
    toast("Signed out");
  };
}
