import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { getSubmissionState } from "@/lib/assignment";
import { SubmissionForm } from "./SubmissionForm";
import { SubmissionSummary } from "./SubmissionSummary";

/**
 * Everything under "Your submission": status notices, the form when action is needed or
 * allowed, and a summary of what was handed in otherwise.
 */
export function SubmissionSection({ assignment }) {
    const state = getSubmissionState(assignment);
    const [editing, setEditing] = useState(false);
    const hasSubmission = Boolean(assignment.submission);
    const showForm = state.canSubmit && (state.requiresAction || editing);
    const canEdit = state.canSubmit && !state.requiresAction && !editing;

    return (
        <View className="gap-4">
            {state.notice ? (
                <Notice tone={state.notice.tone} title={state.notice.title}>
                    {state.notice.text}
                </Notice>
            ) : null}

            {state.status === "returned" && assignment.feedback ? (
                <Notice tone="warning" title="Needs revision">
                    {assignment.feedback}
                </Notice>
            ) : null}

            {hasSubmission && !showForm ? <SubmissionSummary assignment={assignment} /> : null}

            {showForm ? (
                <SubmissionForm
                    key={assignment.submission?.submittedAt ?? "new"}
                    assignment={assignment}
                    resubmitting={hasSubmission}
                    onDone={() => setEditing(false)}
                    onCancel={editing ? () => setEditing(false) : undefined}
                />
            ) : null}

            {canEdit ? (
                <Button title="Edit submission" variant="secondary" onPress={() => setEditing(true)} />
            ) : null}

            {hasSubmission && !state.canSubmit && ["submitted", "late"].includes(state.status) ? (
                <Text className="text-[12px] text-ink-muted">
                    Resubmission isn’t allowed for this assignment.
                </Text>
            ) : null}
        </View>
    );
}
