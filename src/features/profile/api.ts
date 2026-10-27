import type { Student } from "@/features/profile/types";
import { api } from "@/lib/api";

export const fetchMe = async () => (await api.get<Student>("/me")).data;
