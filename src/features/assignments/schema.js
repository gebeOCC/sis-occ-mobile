import { z } from "zod";

const REPO_URL = /^https:\/\/(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+\/[\w.-]+/i;

const repoLink = z
  .string()
  .trim()
  .min(1, "Add a repository link.")
  .regex(REPO_URL, "Use a link like https://github.com/username/repo.");

export const extensionOf = (name = "") => name.split(".").pop().toLowerCase();

const formatList = (formats) => {
  const upper = formats.map((format) => format.toUpperCase());
  return upper.length > 1
    ? `${upper.slice(0, -1).join(", ")} or ${upper.at(-1)}`
    : (upper[0] ?? "");
};

/**
 * Validation follows the assignment's own settings: repository links (plus group members when
 * required) or one uploaded file in an allowed format and size.
 */
export function buildSubmissionSchema(assignment) {
  if (assignment.submissionType === "file") {
    const formats = assignment.allowedFormats ?? [];
    const maxMb = assignment.maxFileSizeMb ?? 10;

    return z.object({
      file: z
        .object({
          name: z.string(),
          size: z.number(),
          mimeType: z.string().optional(),
          uri: z.string().optional(),
        })
        .nullable()
        .refine((file) => file !== null, "Choose a file to upload.")
        .refine(
          (file) =>
            file === null || formats.length === 0 || formats.includes(extensionOf(file.name)),
          `Upload a ${formatList(formats)} file.`,
        )
        .refine(
          (file) => file === null || file.size <= maxMb * 1024 * 1024,
          `Choose a file that is ${maxMb} MB or smaller.`,
        ),
    });
  }

  return z.object({
    frontendRepo: repoLink,
    backendRepo: repoLink,
    groupMembers: assignment.requiresGroupMembers
      ? z.string().trim().min(1, "Add at least one group member.")
      : z.string().trim().optional(),
  });
}
