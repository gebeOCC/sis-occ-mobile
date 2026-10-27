import { api } from "@/lib/api";

export interface PasswordResetResponse {
  message: string;
  demo?: boolean;
}

export const requestPasswordReset = async (email: string) =>
  (await api.post<PasswordResetResponse>("/forgot-password", { email })).data;
