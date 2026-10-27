import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchHome } from "./api";

export const useHome = () =>
  useQuery({
    queryKey: qk.home,
    queryFn: fetchHome,
    // Keep deadline groups current while the app remains open.
    refetchInterval: 60_000,
  });
