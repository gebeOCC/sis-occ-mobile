import type { SubmissionPayload } from "@/features/assignments/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchAssignment, fetchAssignments, submitAssignment } from "./api";

export const useAssignments = (classId?: string) =>
  useQuery({ queryKey: qk.assignments(classId), queryFn: () => fetchAssignments(classId) });

export const useAssignment = (id: string) =>
  useQuery({
    queryKey: qk.assignment(id),
    queryFn: () => fetchAssignment(id),
    enabled: Boolean(id),
  });

export function useSubmitAssignment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SubmissionPayload) => submitAssignment({ id, ...values }),
    onSuccess: () => {
      // Status shows on Home, My Classes, Tasks and the assignment itself.
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: qk.classes });
      queryClient.invalidateQueries({ queryKey: qk.home });
    },
  });
}
