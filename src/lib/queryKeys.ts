// Hierarchical keys: invalidating ["classes"] also refreshes every class sub-resource.
export const qk = {
  me: ["me"],
  home: ["home"],
  notifications: ["notifications"],
  classes: ["classes"],
  class: (id: string) => ["classes", id],
  announcements: (classId?: string) => ["classes", classId, "announcements"],
  materials: (classId?: string) => ["classes", classId, "materials"],
  attendance: (classId?: string) => ["classes", classId, "attendance"],
  grades: (classId?: string) => ["classes", classId, "grades"],
  assignments: (classId?: string) => ["assignments", classId ?? "all"],
  assignment: (id: string) => ["assignments", "detail", id],
};
