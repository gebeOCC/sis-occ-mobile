import { api } from "@/lib/api";

export const fetchMaterials = async (classId) =>
  (await api.get(`/classes/${classId}/materials`)).data;
