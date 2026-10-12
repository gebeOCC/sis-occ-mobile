import { api } from "@/lib/api";

export const fetchMe = async () => (await api.get("/me")).data;
