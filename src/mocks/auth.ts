import { passwordResetSchema } from "../features/auth/schema.ts";
import type { PasswordResetResponse } from "../features/auth/api";

type ResetReply = [number, PasswordResetResponse];

/** Validates the recovery request; the preview never sends mail or exposes account existence. */
export function passwordResetReply(data: unknown): ResetReply {
  let payload = data;
  if (typeof data === "string") {
    try {
      payload = JSON.parse(data);
    } catch {
      return [400, { message: "The request could not be read. Please try again." }];
    }
  }

  if (!passwordResetSchema.safeParse(payload).success) {
    return [422, { message: "Enter a valid email address." }];
  }

  return [
    200,
    {
      message: "If an account is linked to this email, you’ll receive a password reset link.",
      demo: true,
    },
  ];
}
