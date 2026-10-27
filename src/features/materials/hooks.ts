import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchMaterials } from "./api";

export const useMaterials = (classId: string) =>
  useQuery({
    queryKey: qk.materials(classId),
    queryFn: () => fetchMaterials(classId),
    enabled: Boolean(classId),
  });
