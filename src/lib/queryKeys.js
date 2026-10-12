// Hierarchical keys: invalidating ["classes"] also refreshes every class sub-resource.
export const qk = {
  me: ["me"],
  home: ["home"],
  classes: ["classes"],
  class: (id) => ["classes", id],
  announcements: (classId) => ["classes", classId, "announcements"],
  materials: (classId) => ["classes", classId, "materials"],
  attendance: (classId) => ["classes", classId, "attendance"],
  grades: (classId) => ["classes", classId, "grades"],
  assignments: (classId) => ["assignments", classId ?? "all"],
  assignment: (id) => ["assignments", "detail", id],
};
