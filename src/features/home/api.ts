import type { HomeData } from "@/features/home/types";
import { api } from "@/lib/api";

export const fetchHome = async () => (await api.get<HomeData>("/home")).data;
