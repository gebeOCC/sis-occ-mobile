import type { Material } from "@/features/materials/types";
import { api } from "@/lib/api";

export const fetchMaterials = async (classId: string) =>
  (await api.get<Material[]>(`/classes/${classId}/materials`)).data;
