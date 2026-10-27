import { z } from "zod";
import type { Assignment } from "@/features/assignments/types";

const REPO_URL = /^https:\/\/(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+\/[\w.-]+/i;

const repoLink = z
  .string()
  .trim()
  .min(1, "Add a repository link.")
  .regex(REPO_URL, "Use a link like https://github.com/username/repo.");

export const extensionOf = (name = "") => (name.split(".").pop() ?? "").toLowerCase();

const formatList = (formats: string[]) => {
  const upper = formats.map((format) => format.toUpperCase());
  return upper.length > 1
    ? `${upper.slice(0, -1).join(", ")} or ${upper.at(-1)}`
    : (upper[0] ?? "");
};

const submissionFile = z.object({
  name: z.string(),
  size: z.number(),
  mimeType: z.string().optional(),
  uri: z.string().optional(),
});

/** Validation follows the assignment's repository or file requirements. */
export function buildSubmissionSchema(assignment: Assignment) {
  const isFile = assignment.submissionType === "file";
  const formats = assignment.allowedFormats ?? [];
  const maxMb = assignment.maxFileSizeMb ?? 10;
  const requiredFile = submissionFile
    .nullable()
    .refine((file) => file !== null, "Choose a file to upload.")
    .refine(
      (file) => file === null || formats.length === 0 || formats.includes(extensionOf(file.name)),
      `Upload a ${formatList(formats)} file.`,
    )
    .refine(
      (file) => file === null || file.size <= maxMb * 1024 * 1024,
      `Choose a file that is ${maxMb} MB or smaller.`,
    );

  return z.object({
    frontendRepo: isFile ? z.string().optional() : repoLink,
    backendRepo: isFile ? z.string().optional() : repoLink,
    groupMembers:
      !isFile && assignment.requiresGroupMembers
        ? z.string().trim().min(1, "Add at least one group member.")
        : z.string().trim().optional(),
    file: isFile ? requiredFile : submissionFile.nullable().optional(),
  });
}

export type SubmissionValues = z.infer<ReturnType<typeof buildSubmissionSchema>>;
