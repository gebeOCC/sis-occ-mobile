export const ATTENDANCE_STATUSES = {
  present: { label: "Present", tone: "success" },
  late: { label: "Late", tone: "warning" },
  absent: { label: "Absent", tone: "danger" },
  excused: { label: "Excused", tone: "info" },
  unmarked: { label: "Unmarked", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

// Missing/unrecognized marks never silently become absences.
export function attendanceStatus(record) {
  if (record.cancelled) return "cancelled";
  return Object.hasOwn(ATTENDANCE_STATUSES, record.status) ? record.status : "unmarked";
}

/** Present + Late are attended. Excused, Unmarked and cancelled meetings are excluded. */
export function summarizeAttendance(records) {
  const counts = Object.fromEntries(Object.keys(ATTENDANCE_STATUSES).map((status) => [status, 0]));
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
