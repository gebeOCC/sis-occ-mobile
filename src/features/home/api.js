import { api } from "@/lib/api";

export const fetchHome = async () => (await api.get("/home")).data;
