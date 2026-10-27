import { isAxiosError } from "axios";
import type {
  Assignment,
  SubmissionFormValues,
  SubmissionPayload,
} from "@/features/assignments/types";
import type { SubmissionValues } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View, type TextInputProps } from "react-native";
import { toast } from "sonner-native";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useDraftStore } from "@/store/drafts";
import { useSubmitAssignment } from "../hooks";
import { buildSubmissionSchema } from "../schema";
import { FilePickerField } from "./FilePickerField";

/**
 * Inputs follow the assignment: repository links (+ group members when required),
 * or a single file upload. `resubmitting` changes the wording; `onCancel` adds a Cancel button.
 */
export function SubmissionForm({
  assignment,
  resubmitting = false,
  onDone,
  onCancel,
}: {
  assignment: Assignment;
  resubmitting?: boolean;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const isFile = assignment.submissionType === "file";
  const schema = useMemo(() => buildSubmissionSchema(assignment), [assignment]);
  const submit = useSubmitAssignment(assignment.id);

  const draft = useDraftStore((state) => state.drafts[assignment.id]);
  const hydrated = useDraftStore((state) => state.hydrated);
  const setDraft = useDraftStore((state) => state.setDraft);
  const clearDraft = useDraftStore((state) => state.clearDraft);

  const defaults: SubmissionFormValues = {
    frontendRepo: assignment.submission?.frontendRepo ?? "",
    backendRepo: assignment.submission?.backendRepo ?? "",
    groupMembers: assignment.submission?.groupMembers ?? "",
    file: null,
  };

  const { control, handleSubmit, getValues, reset, formState } = useForm<SubmissionValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  // Restore an unsent draft (repository fields only) once persisted storage has loaded.
  useEffect(() => {
    if (hydrated && !isFile && !resubmitting && draft && !formState.isDirty) {
      reset({ ...defaults, ...draft });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const saveDraft = () => {
    if (!isFile && !resubmitting) {
      const values = getValues();
      setDraft(assignment.id, {
        frontendRepo: values.frontendRepo ?? "",
        backendRepo: values.backendRepo ?? "",
        groupMembers: values.groupMembers ?? "",
        file: null,
      });
    }
  };

  const payloadFrom = (values: SubmissionValues): SubmissionPayload | null => {
    if (isFile) {
      if (!values.file) return null;
      return {
        file: {
          name: values.file.name,
          size: values.file.size,
          mimeType: values.file.mimeType,
        },
      };
    }
    return {
      frontendRepo: values.frontendRepo,
      backendRepo: values.backendRepo,
      ...(assignment.requiresGroupMembers ? { groupMembers: values.groupMembers } : {}),
    };
  };

  const sendSubmission = (values: SubmissionValues) => {
    const payload = payloadFrom(values);
    if (!payload) return;
    submit.mutate(payload, {
      onSuccess: () => {
        clearDraft(assignment.id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.success(resubmitting ? "Submission updated" : "Assignment submitted");
        onDone?.();
      },
      onError: (error) =>
        toast.error(
          (isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined) ??
            "Couldn’t submit. Check your connection and try again.",
        ),
    });
  };

  const onValid = (values: SubmissionValues) =>
    Alert.alert(
      resubmitting ? "Resubmit assignment?" : "Submit assignment?",
      resubmitting
        ? "This replaces your previous submission."
        : "Your instructor will see your submission.",
      [
        { text: "Keep editing", style: "cancel" },
        { text: resubmitting ? "Resubmit" : "Submit", onPress: () => sendSubmission(values) },
      ],
    );

  const repoField = (
    name: "frontendRepo" | "backendRepo",
    label: string,
    returnKeyType: TextInputProps["returnKeyType"] = "next",
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          placeholder={`https://github.com/username/${name === "frontendRepo" ? "frontend" : "backend"}`}
          keyboardType="url"
          returnKeyType={returnKeyType}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={() => {
            field.onBlur();
            saveDraft();
          }}
          error={fieldState.error?.message}
        />
      )}
    />
  );

  return (
    <View className="gap-4">
      {isFile ? (
        <Controller
          control={control}
          name="file"
          render={({ field, fieldState }) => (
            <FilePickerField
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              assignment={assignment}
              currentFile={assignment.submission?.file}
            />
          )}
        />
      ) : (
        <>
          {repoField("frontendRepo", "Frontend repository")}
          {repoField(
            "backendRepo",
            "Backend repository",
            assignment.requiresGroupMembers ? "next" : "done",
          )}
          {assignment.requiresGroupMembers ? (
            <Controller
              control={control}
              name="groupMembers"
              render={({ field, fieldState }) => (
                <TextField
                  label="Group members"
                  placeholder="Enter the names of your group members…"
                  hint="Separate names with commas."
                  autoCapitalize="words"
                  returnKeyType="done"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={() => {
                    field.onBlur();
                    saveDraft();
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          ) : null}
        </>
      )}

      <Button
        title={resubmitting ? "Resubmit" : "Submit assignment"}
        icon="send"
        onPress={handleSubmit(onValid)}
        loading={submit.isPending}
      />
      {onCancel ? <Button title="Cancel" variant="secondary" onPress={onCancel} /> : null}
      <Text className="text-center text-[12px] text-ink-muted">
        You can review your work before submitting.
      </Text>
    </View>
  );
}
