import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your student ID or email."),
  password: z.string().min(1, "Enter your password."),
});

export const passwordResetSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
});
