import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { fetchAttendance, fetchClass, fetchClasses, fetchGrades } from "./api";

export const useClasses = () => useQuery({ queryKey: qk.classes, queryFn: fetchClasses });

export const useClass = (id) =>
  useQuery({ queryKey: qk.class(id), queryFn: () => fetchClass(id), enabled: Boolean(id) });

export const useAttendance = (id) =>
  useQuery({
    queryKey: qk.attendance(id),
    queryFn: () => fetchAttendance(id),
    enabled: Boolean(id),
  });

export const useGrades = (id) =>
  useQuery({ queryKey: qk.grades(id), queryFn: () => fetchGrades(id), enabled: Boolean(id) });
