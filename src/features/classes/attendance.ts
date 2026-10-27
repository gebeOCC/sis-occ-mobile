import type { AttendanceStatus, AttendanceSummary } from "./types";

type AttendanceInput = { status?: string | null; cancelled?: boolean };

export const ATTENDANCE_STATUSES = {
  present: { label: "Present", tone: "success" },
  late: { label: "Late", tone: "warning" },
  absent: { label: "Absent", tone: "danger" },
  excused: { label: "Excused", tone: "info" },
  unmarked: { label: "Unmarked", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
} as const;

// Missing/unrecognized marks never silently become absences.
export function attendanceStatus(record: AttendanceInput): AttendanceStatus {
  if (record.cancelled) return "cancelled";
  return record.status && Object.hasOwn(ATTENDANCE_STATUSES, record.status)
    ? (record.status as AttendanceStatus)
    : "unmarked";
}

/** Present + Late are attended. Excused, Unmarked and cancelled meetings are excluded. */
export function summarizeAttendance(records: readonly AttendanceInput[]): AttendanceSummary {
  const counts: Record<AttendanceStatus, number> = {
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    unmarked: 0,
    cancelled: 0,
  };
  records.forEach((record) => {
    counts[attendanceStatus(record)] += 1;
  });
  const attended = counts.present + counts.late;
  const counted = attended + counts.absent;
  return {
    ...counts,
    total: records.length,
    attended,
    counted,
    percentage: counted > 0 ? Math.round((attended / counted) * 100) : null,
  };
}
