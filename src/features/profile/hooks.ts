import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchMe } from "./api";

export const useMe = () => useQuery({ queryKey: qk.me, queryFn: fetchMe });
