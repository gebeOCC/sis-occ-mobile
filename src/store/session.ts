import { create } from "zustand";

interface SessionState {
  token: string | null;
  signIn: () => void;
  signOut: () => void;
}

// Prototype auth: nothing is verified. signIn() stores a placeholder token, which the axios
// client sends as a Bearer header. Swap it for a real login request (e.g. Laravel Sanctum) later.
export const MOCK_TOKEN = "mock-sanctum-token";

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  signIn: () => set({ token: MOCK_TOKEN }),
  signOut: () => set({ token: null }),
}));
