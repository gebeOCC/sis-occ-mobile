import type { Student } from "@/features/profile/types";
import type {
  ClassSummary,
  ClassDetail,
  ClassStatus,
  AttendanceRecord,
} from "@/features/classes/types";
import type { Announcement } from "@/features/announcements/types";
import type { Attachment } from "@/types/files";
import type { Assignment, SubmissionPayload } from "@/features/assignments/types";
import type { Material, MaterialKind } from "@/features/materials/types";
import type { HomeData } from "@/features/home/types";

// In-memory "database" behind the mock API. Edit freely; it resets on every app reload.
// Dates are relative to the moment the app starts, so the demo always looks current.
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  subDays,
  subHours,
} from "date-fns";
import { summarizeAttendance } from "../features/classes/attendance.ts";
import { summarizeTasks } from "../features/assignments/taskSummary.ts";
import { grades } from "./grades.ts";

interface ClassRecord {
  id: string;
  code: string;
  title: string;
  instructor: string;
  section: string;
  status: ClassStatus;
  days: number[];
  start: string;
  time: string;
  room: string;
  icon: ClassSummary["icon"];
  gradingPeriods: string[];
}
type SubmitResult = { item: Assignment; error?: never } | { error: [number, string]; item?: never };

const NOW = new Date();
const INSTRUCTOR = "Prof. Barry Gebe";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MB = 1024 * 1024;

const iso = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");
const ago = (hours: number) => iso(subHours(NOW, hours));
const at = (dayOffset: number, hour = 23, minute = 59) =>
  iso(setMinutes(setHours(startOfDay(addDays(NOW, dayOffset)), hour), minute));
const file = (name: string, size: string): Attachment => ({
  name,
  size,
  url: `https://example.com/files/${encodeURIComponent(name)}`,
});

const STATUS_RANK: Record<Assignment["status"], number> = {
  overdue: 0,
  returned: 1,
  not_submitted: 2,
  submitted: 3,
  late: 3,
  graded: 4,
};
const CLASS_RANK: Record<ClassStatus, number> = { ongoing: 0, upcoming: 1, completed: 2 };
const TODO = ["not_submitted", "overdue", "returned"];

// Work past its deadline with no submission is overdue, whatever the stored status says.
const effectiveStatus = (a: Assignment) =>
  a.status === "not_submitted" && a.dueAt < iso(new Date()) ? "overdue" : a.status;

const byNewest = (a: Announcement, b: Announcement) => b.postedAt.localeCompare(a.postedAt);
const byDue = (a: Assignment, b: Assignment) => a.dueAt.localeCompare(b.dueAt);
const byPriority = (a: Assignment, b: Assignment) =>
  STATUS_RANK[effectiveStatus(a)] - STATUS_RANK[effectiveStatus(b)] || byDue(a, b);

export const student: Student = {
  id: "stu-001",
  firstName: "Mika",
  lastName: "Santos",
  initials: "MS",
  email: "mika.santos@example.edu",
  program: "BSIT",
  section: "BSIT 3A",
  yearLevel: "3rd year",
};

const classRecords: ClassRecord[] = [
  {
    id: "it311",
    code: "IT311",
    title: "App Development",
    instructor: INSTRUCTOR,
    section: "BSIT 3A",
    status: "ongoing",
    days: [3, 6],
    start: "17:30",
    time: "5:30 – 8:30 PM",
    room: "Room 305",
    icon: "monitor",
    gradingPeriods: ["Midterm", "Final"],
  },
  {
    id: "it312",
    code: "IT312",
    title: "Database Management",
    instructor: INSTRUCTOR,
    section: "BSIT 3A",
    status: "ongoing",
    days: [1, 4],
    start: "13:00",
    time: "1:00 – 4:00 PM",
    room: "Room 307",
    icon: "database",
    gradingPeriods: ["Midterm", "Final"],
  },
  {
    id: "it313",
    code: "IT313",
    title: "Networking",
    instructor: INSTRUCTOR,
    section: "BSIT 3A",
    status: "ongoing",
    days: [2, 5],
    start: "09:00",
    time: "9:00 AM – 12:00 PM",
    room: "Room 203",
    icon: "network",
    gradingPeriods: ["Midterm", "Final"],
  },
  {
    id: "it314",
    code: "IT314",
    title: "Capstone Project 1",
    instructor: INSTRUCTOR,
    section: "BSIT 3A",
    status: "upcoming",
    days: [5],
    start: "13:00",
    time: "1:00 – 4:00 PM",
    room: "Room 210",
    icon: "classes",
    gradingPeriods: [],
  },
  {
    id: "it310",
    code: "IT310",
    title: "Web Systems and Technologies",
    instructor: INSTRUCTOR,
    section: "BSIT 3A",
    status: "completed",
    days: [2, 4],
    start: "15:00",
    time: "3:00 – 6:00 PM",
    room: "Room 301",
    icon: "file",
    gradingPeriods: ["Midterm", "Final"],
  },
];

const announcements: Announcement[] = [
  {
    id: "ann-1",
    classId: "it311",
    classCode: "IT311",
    title: "Midterm project guidelines",
    body: `Submit your frontend and backend repository links before ${format(addDays(NOW, 4), "MMMM d")}.\n\nBoth repositories must be public or shared with your instructor. Include every group member when you submit.\n\nThe full project instructions are attached.`,
    author: INSTRUCTOR,
    postedAt: ago(2),
    pinned: true,
    read: true,
    attachments: [file("Project instructions.pdf", "2.4 MB")],
  },
  {
    id: "ann-2",
    classId: "it311",
    classCode: "IT311",
    title: `Class suspended on ${format(addDays(NOW, 5), "MMM d")}`,
    body: `Please be informed that our class on ${format(addDays(NOW, 5), "MMMM d")} is suspended due to a faculty meeting.\n\nWe will cover the lesson in the next session. In the meantime, review the Axios examples under Materials.`,
    author: INSTRUCTOR,
    postedAt: ago(17),
    pinned: false,
    read: false,
    attachments: [],
  },
  {
    id: "ann-3",
    classId: "it311",
    classCode: "IT311",
    title: "Laboratory group assignment",
    body: "Groups for the laboratory activities have been posted. Please check the class folder and message your group leader before the next laboratory session.",
    author: INSTRUCTOR,
    postedAt: ago(96),
    pinned: false,
    read: true,
    attachments: [],
  },
  {
    id: "ann-4",
    classId: "it312",
    classCode: "IT312",
    title: "Quiz on normalization",
    body: "Review 1NF to BCNF before the quiz. Bring a pen and your answer sheet.",
    author: INSTRUCTOR,
    postedAt: ago(120),
    pinned: false,
    read: true,
    attachments: [],
  },
  {
    id: "ann-5",
    classId: "it313",
    classCode: "IT313",
    title: "Packet Tracer lab schedule",
    body: "Lab groups are posted in the class folder.",
    author: INSTRUCTOR,
    postedAt: ago(170),
    pinned: false,
    read: true,
    attachments: [],
  },
];

const material = (
  id: string,
  classId: string,
  title: string,
  kind: MaterialKind,
  size: string | null,
  url: string,
): Material => ({ id, classId, title, kind, size, url });

const materials: Material[] = [
  material(
    "mat-1",
    "it311",
    "Introduction to APIs",
    "pdf",
    "2.4 MB",
    "https://example.com/intro-to-apis.pdf",
  ),
  material(
    "mat-2",
    "it311",
    "Laravel REST API Guide",
    "pdf",
    "1.8 MB",
    "https://example.com/laravel-rest-api.pdf",
  ),
  material(
    "mat-3",
    "it311",
    "Axios Examples",
    "zip",
    "340 KB",
    "https://example.com/axios-examples.zip",
  ),
  material(
    "mat-4",
    "it311",
    "Expo Router Documentation",
    "link",
    null,
    "https://docs.expo.dev/router/introduction/",
  ),
  material(
    "mat-5",
    "it311",
    "UI Design Reference",
    "image",
    "1.2 MB",
    "https://example.com/ui-design-reference.png",
  ),
  material(
    "mat-6",
    "it311",
    "React Native Basics",
    "pdf",
    "3.1 MB",
    "https://example.com/rn-basics.pdf",
  ),
  material(
    "mat-7",
    "it311",
    "Starter Project Template",
    "zip",
    "1.2 MB",
    "https://example.com/starter.zip",
  ),
  material(
    "mat-8",
    "it311",
    "NativeWind Documentation",
    "link",
    null,
    "https://www.nativewind.dev/",
  ),
  material(
    "mat-9",
    "it312",
    "Relational Model Notes",
    "pdf",
    "1.1 MB",
    "https://example.com/relational-model.pdf",
  ),
  material(
    "mat-10",
    "it312",
    "SQL Cheat Sheet",
    "pdf",
    "640 KB",
    "https://example.com/sql-cheatsheet.pdf",
  ),
  material("mat-11", "it312", "MySQL Documentation", "link", null, "https://dev.mysql.com/doc/"),
  material(
    "mat-12",
    "it313",
    "OSI Model Reference",
    "pdf",
    "920 KB",
    "https://example.com/osi-model.pdf",
  ),
  material(
    "mat-13",
    "it313",
    "Cisco Packet Tracer",
    "link",
    null,
    "https://www.netacad.com/cisco-packet-tracer",
  ),
  material(
    "mat-14",
    "it310",
    "HTTP and the Web",
    "pdf",
    "1.5 MB",
    "https://example.com/http-and-the-web.pdf",
  ),
  material(
    "mat-15",
    "it310",
    "Final Review Notes",
    "pdf",
    "780 KB",
    "https://example.com/final-review.pdf",
  ),
];

const repoAssignment: Pick<Assignment, "submissionType" | "allowedFormats" | "maxFileSizeMb"> = {
  submissionType: "repository",
  allowedFormats: null,
  maxFileSizeMb: null,
};

const fileAssignment = (
  allowedFormats: string[],
  maxFileSizeMb: number,
): Pick<
  Assignment,
  "submissionType" | "requiresGroupMembers" | "allowedFormats" | "maxFileSizeMb"
> => ({
  submissionType: "file",
  requiresGroupMembers: false,
  allowedFormats,
  maxFileSizeMb,
});

// One assignment per state, so every badge, notice and form variant can be seen in the app.
const assignments: Assignment[] = [
  {
    id: "asg-1",
    classId: "it311",
    classCode: "IT311",
    className: "App Development",
    kind: "project",
    title: "Midterm Project",
    instructions: "Build an Expo app that connects to five Laravel JSON endpoints using Axios.",
    dueAt: at(4),
    status: "not_submitted",
    maxScore: 100,
    score: null,
    feedback: null,
    ...repoAssignment,
    requiresGroupMembers: true,
    allowResubmission: true,
    allowLate: true,
    attachments: [file("Project instructions.pdf", "2.4 MB")],
    submission: null,
  },
  {
    id: "asg-2",
    classId: "it311",
    classCode: "IT311",
    className: "App Development",
    kind: "lab",
    title: "Lab Exercise 5: Axios Requests",
    instructions:
      "Write a short report with screenshots of your Axios requests, including the loading and error states. Export it as a PDF or DOCX, or zip your project.",
    dueAt: at(9),
    status: "not_submitted",
    maxScore: 20,
    score: null,
    feedback: null,
    ...fileAssignment(["pdf", "docx", "zip"], 10),
    allowResubmission: true,
    allowLate: true,
    attachments: [],
    submission: null,
  },
  {
    id: "asg-3",
    classId: "it311",
    classCode: "IT311",
    className: "App Development",
    kind: "lab",
    title: "Lab Exercise 4: Routing",
    instructions: "Add file-based routing with Expo Router and a dynamic detail screen.",
    dueAt: at(-9),
    status: "graded",
    maxScore: 20,
    score: 18,
    feedback: "Clean file-based routes. Add a not-found screen next time.",
    ...repoAssignment,
    requiresGroupMembers: false,
    allowResubmission: false,
    allowLate: false,
    attachments: [],
    submission: {
      frontendRepo: "https://github.com/mika-santos/lab4-frontend",
      backendRepo: "https://github.com/mika-santos/lab4-backend",
      groupMembers: "",
      submittedAt: at(-10, 21, 10),
    },
  },
  {
    id: "asg-4",
    classId: "it311",
    classCode: "IT311",
    className: "App Development",
    kind: "lab",
    title: "Lab Exercise 3: State Management",
    instructions:
      "Move the shared state into a store and document your approach in a short report.",
    dueAt: at(-16),
    status: "late",
    maxScore: 20,
    score: null,
    feedback: null,
    ...fileAssignment(["pdf", "docx"], 10),
    allowResubmission: false,
    allowLate: true,
    attachments: [],
    submission: {
      file: { name: "lab3-report.pdf", size: Math.round(1.1 * MB) },
      submittedAt: at(-14, 9, 20),
    },
  },
  {
    id: "asg-5",
    classId: "it312",
    classCode: "IT312",
    className: "Database Management",
    kind: "quiz",
    title: "Quiz 2: Normalization",
    instructions:
      "Answer the normalization problems on paper, then upload a clear photo or PDF of your answer sheet.",
    dueAt: at(0),
    status: "not_submitted",
    maxScore: 30,
    score: null,
    feedback: null,
    ...fileAssignment(["pdf", "jpg", "png"], 5),
    allowResubmission: false,
    allowLate: false,
    attachments: [],
    submission: null,
  },
  {
    id: "asg-6",
    classId: "it312",
    classCode: "IT312",
    className: "Database Management",
    kind: "activity",
    title: "ERD Activity",
    instructions: "Draw the entity relationship diagram for the enrollment system case.",
    dueAt: at(-5),
    status: "submitted",
    maxScore: 20,
    score: null,
    feedback: null,
    ...fileAssignment(["pdf", "png"], 10),
    allowResubmission: true,
    allowLate: false,
    attachments: [],
    submission: {
      file: { name: "erd-activity.pdf", size: Math.round(0.8 * MB) },
      submittedAt: at(-6, 14, 5),
    },
  },
  {
    id: "asg-7",
    classId: "it313",
    classCode: "IT313",
    className: "Networking",
    kind: "lab",
    title: "Packet Tracer Lab 1",
    instructions: "Build the two-VLAN office network and submit your Packet Tracer file.",
    dueAt: at(-7),
    status: "returned",
    maxScore: 20,
    score: null,
    feedback: "Your topology is missing the second VLAN. Fix it and resubmit.",
    ...fileAssignment(["zip", "pkt"], 10),
    allowResubmission: true,
    allowLate: true,
    attachments: [],
    submission: {
      file: { name: "packet-lab-1.zip", size: Math.round(2.1 * MB) },
      submittedAt: at(-8, 16, 30),
    },
  },
  {
    id: "asg-8",
    classId: "it313",
    classCode: "IT313",
    className: "Networking",
    kind: "activity",
    title: "Network Topology Diagram",
    instructions: "Draw the campus network topology and label every device and link.",
    dueAt: at(-3),
    status: "overdue",
    maxScore: 20,
    score: null,
    feedback: null,
    ...fileAssignment(["pdf", "png"], 10),
    allowResubmission: true,
    allowLate: true,
    attachments: [],
    submission: null,
  },
  {
    id: "asg-9",
    classId: "it310",
    classCode: "IT310",
    className: "Web Systems and Technologies",
    kind: "project",
    title: "Final Project",
    instructions: "Deliver a complete web system with documentation.",
    dueAt: at(-40),
    status: "graded",
    maxScore: 100,
    score: 95,
    feedback: "Excellent work. Clear documentation and a polished interface.",
    ...repoAssignment,
    requiresGroupMembers: true,
    allowResubmission: false,
    allowLate: false,
    attachments: [],
    submission: {
      frontendRepo: "https://github.com/mika-santos/web-systems-frontend",
      backendRepo: "https://github.com/mika-santos/web-systems-backend",
      groupMembers: "Mika Santos, Ben Reyes, Ana Cruz",
      submittedAt: at(-41, 20, 45),
    },
  },
];

// Meetings over the last 30 days, following each class's weekday pattern.
const meetingDates = (cls: ClassRecord) =>
  cls.status === "upcoming"
    ? []
    : eachDayOfInterval({ start: subDays(NOW, 30), end: NOW })
        .filter((day) => cls.days.includes(getDay(day)))
        .map((day) => format(day, "yyyy-MM-dd"));

const attendance: Record<string, AttendanceRecord[]> = Object.fromEntries(
  classRecords.map((cls) => [
    cls.id,
    meetingDates(cls).map((date, index) => ({
      id: `${cls.id}-m${index + 1}`,
      date,
      status:
        cls.id === "it311"
          ? (["present", "late", "excused", "absent", "unmarked", "cancelled", "present"] as const)[
              index % 7
            ]
          : "present",
    })),
  ]),
);

// ---- Read models ---------------------------------------------------------

function toSummary(cls: ClassRecord): ClassSummary {
  const records = attendance[cls.id];
  return {
    id: cls.id,
    code: cls.code,
    title: cls.title,
    instructor: cls.instructor,
    section: cls.section,
    status: cls.status,
    schedule: cls.days.map((day) => WEEKDAYS[day]).join(" & "),
    time: cls.time,
    room: cls.room,
    icon: cls.icon,
    unreadAnnouncements: announcements.filter((a) => a.classId === cls.id && !a.read).length,
    tasksDue: assignments.filter((a) => a.classId === cls.id && TODO.includes(effectiveStatus(a)))
      .length,
    materialsCount: materials.filter((m) => m.classId === cls.id).length,
    attendance: summarizeAttendance(records),
    gradingPeriods: cls.gradingPeriods,
  };
}

// Classes meeting today, or the next class when nothing meets today.
function getSchedule(): HomeData["schedule"] {
  const ongoing = classRecords.filter((c) => c.status === "ongoing");
  const byStart = (a: ClassRecord, b: ClassRecord) => a.start.localeCompare(b.start);
  const today = getDay(new Date());

  const todays = ongoing.filter((c) => c.days.includes(today)).sort(byStart);
  if (todays.length > 0)
    return { kind: "today", whenLabel: "Today", classes: todays.map(toSummary) };

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (today + offset) % 7;
    const next = ongoing.filter((c) => c.days.includes(day)).sort(byStart);
    if (next.length > 0) {
      return {
        kind: "next",
        whenLabel: offset === 1 ? "Tomorrow" : WEEKDAY_NAMES[day],
        classes: [toSummary(next[0])],
      };
    }
  }
  return { kind: "none", whenLabel: "", classes: [] };
}

export function getHome(): HomeData {
  const { groups, counts } = summarizeTasks(assignments);

  return {
    student,
    hasUnreadNotifications: announcements.some((a) => !a.read),
    taskSummary: counts,
    taskGroups: {
      overdue: groups.overdue.slice(0, 3),
      needsRevision: groups.needsRevision.slice(0, 3),
      dueSoon: groups.dueSoon.slice(0, 3),
      upcoming: groups.upcoming.slice(0, 3),
    },
    schedule: getSchedule(),
    latestAnnouncement: [...announcements].sort(byNewest)[0] ?? null,
  };
}

export const getClasses = () =>
  classRecords
    .map((cls, index) => ({ cls, index }))
    .sort((a, b) => CLASS_RANK[a.cls.status] - CLASS_RANK[b.cls.status] || a.index - b.index)
    .map(({ cls }) => toSummary(cls));

export function getClass(id: string): ClassDetail | null {
  const cls = classRecords.find((c) => c.id === id);
  if (!cls) return null;
  const list = announcements.filter((a) => a.classId === id).sort(byNewest);
  return { ...toSummary(cls), highlight: list.find((a) => a.pinned) ?? list[0] ?? null };
}

export const getAnnouncements = (classId: string) =>
  announcements
    .filter((a) => a.classId === classId)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || byNewest(a, b));

export const getAllAnnouncements = () => [...announcements].sort(byNewest);

export const getMaterials = (classId: string) => materials.filter((m) => m.classId === classId);

export const getAssignments = (classId?: string) =>
  assignments.filter((a) => !classId || a.classId === classId).sort(byPriority);

export const getAssignment = (id: string) => assignments.find((a) => a.id === id) ?? null;

export const getAttendance = (classId: string) => attendance[classId] ?? [];

export const getGrades = (classId: string) => grades[classId] ?? [];

// ---- Writes --------------------------------------------------------------

export function markAnnouncementRead(id: string) {
  const item = announcements.find((a) => a.id === id);
  if (item) item.read = true;
  return item ?? null;
}

// Enforces the same rules the screen shows: graded work is final, late and repeat submissions
// follow the assignment's settings. Returns { item } or { error: [status, message] }.
export function submitAssignment(id: string, payload: SubmissionPayload): SubmitResult {
  const item = assignments.find((a) => a.id === id);
  if (!item) return { error: [404, "Assignment not found."] };

  const status = effectiveStatus(item);
  if (status === "graded") return { error: [403, "This assignment has already been graded."] };
  if (status === "overdue" && !item.allowLate) {
    return { error: [403, "Submissions are closed for this assignment."] };
  }
  if (["submitted", "late"].includes(status) && !item.allowResubmission) {
    return { error: [403, "Resubmission isn't allowed for this assignment."] };
  }
  if (item.submissionType === "file" && !payload.file) {
    return { error: [422, "Choose a file to upload."] };
  }

  const now = new Date();
  item.status = now > parseISO(item.dueAt) ? "late" : "submitted";
  item.feedback = null;
  item.submission =
    item.submissionType === "file"
      ? { file: { name: payload.file!.name, size: payload.file!.size }, submittedAt: iso(now) }
      : {
          frontendRepo: payload.frontendRepo,
          backendRepo: payload.backendRepo,
          groupMembers: payload.groupMembers ?? "",
          submittedAt: iso(now),
        };
  return { item };
}
