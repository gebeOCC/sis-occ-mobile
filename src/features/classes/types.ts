import type { Announcement } from "../announcements/types";

export type ClassIcon = "monitor" | "database" | "network" | "classes" | "file";

export type AttendanceStatus = "present" | "late" | "absent" | "excused" | "unmarked" | "cancelled";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  cancelled?: boolean;
  topic?: string;
}

export type AttendanceSummary = Record<AttendanceStatus, number> & {
  total: number;
  attended: number;
  counted: number;
  percentage: number | null;
};

export type ClassStatus = "ongoing" | "upcoming" | "completed";

export interface ClassSummary {
  id: string;
  code: string;
  title: string;
  instructor: string;
  section: string;
  status: ClassStatus;
  schedule: string;
  time: string;
  room: string;
  icon: ClassIcon;
  unreadAnnouncements: number;
  tasksDue: number;
  materialsCount: number;
  attendance: AttendanceSummary;
  gradingPeriods: string[];
}

export interface ClassDetail extends ClassSummary {
  highlight: Announcement | null;
}

export interface GradeAssessment {
  id?: string;
  name?: string;
  score: number | null;
  maxScore: number;
}

export interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  assessments?: GradeAssessment[];
}

export interface GradeTerm {
  period?: string;
  released: boolean;
  classStandingWeight?: number;
  examWeight?: number;
  categories?: GradeCategory[];
  exam?: GradeAssessment;
}

export type GradePeriod = GradeTerm;
