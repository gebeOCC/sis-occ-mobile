import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useSessionStore } from "@/store/session";

export const useIsSignedIn = () => useSessionStore((state) => Boolean(state.token));

/** Signs out and drops cached server data. The route guard in app/_layout.jsx returns to Login. */
export function useSignOut() {
  const queryClient = useQueryClient();
  const signOut = useSessionStore((state) => state.signOut);

  return () => {
    signOut();
    queryClient.clear();
    toast("Signed out");
  };
}
