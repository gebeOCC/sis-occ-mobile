import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Unsent submission links survive app restarts.
export const useDraftStore = create(
  persist(
    (set) => ({
      drafts: {},
      hydrated: false,
      setDraft: (assignmentId, values) =>
        set((state) => ({ drafts: { ...state.drafts, [assignmentId]: values } })),
      clearDraft: (assignmentId) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[assignmentId];
          return { drafts };
        }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "student-portal-drafts",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ drafts: state.drafts }),
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);
