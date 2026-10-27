import type { SubmissionFormValues } from "@/features/assignments/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DraftState {
  drafts: Record<string, Partial<SubmissionFormValues>>;
  hydrated: boolean;
  setDraft: (assignmentId: string, values: Partial<SubmissionFormValues>) => void;
  clearDraft: (assignmentId: string) => void;
  markHydrated: () => void;
}

// Unsent submission links survive app restarts.
export const useDraftStore = create<DraftState>()(
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
