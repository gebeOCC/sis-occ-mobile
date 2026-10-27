import assert from "node:assert/strict";
import test from "node:test";
import { attendanceStatus, summarizeAttendance } from "../src/features/classes/attendance.ts";
import { calculateTermGrade, gradeEquivalent } from "../src/features/classes/grades.ts";
import { summarizeTasks } from "../src/features/assignments/taskSummary.ts";
import {
  getAssignment,
  getAssignments,
  getClass,
  getHome,
  getAttendance,
  getGrades,
  submitAssignment,
} from "../src/mocks/db.ts";

const now = new Date("2026-10-12T12:00:00");
const task = (id, dueAt, status = "not_submitted") => ({ id, dueAt, status });
const term = (score = 87, examScore = 100) => ({
  released: true,
  classStandingWeight: 70,
  examWeight: 30,
  categories: [
    {
      id: "lab",
      name: "Laboratory",
      weight: 100,
      assessments: [{ id: "lab-1", score, maxScore: 100 }],
    },
  ],
  exam: { score: examScore, maxScore: 100 },
});

test("Home includes overdue and returned work even when there are no future deadlines", () => {
  const { groups, counts } = summarizeTasks(
    [
      task("missed", "2026-10-11T23:59:00"),
      task("revision", "2026-10-08T23:59:00", "returned"),
      task("done", "2026-10-09T23:59:00", "submitted"),
      task("late", "2026-10-08T23:59:00", "late"),
      task("graded", "2026-10-08T23:59:00", "graded"),
    ],
    now,
  );
  assert.equal(counts.total, 2);
  assert.equal(counts.dueSoon, 0);
  assert.deepEqual(
    groups.overdue.map((item) => item.id),
    ["missed"],
  );
  assert.deepEqual(
    groups.needsRevision.map((item) => item.id),
    ["revision"],
  );
});

test("Home groups deadlines disjointly, sorts them and includes today in due soon", () => {
  const { groups, counts } = summarizeTasks(
    [
      task("future", "2026-10-23T23:59:00"),
      task("soon", "2026-10-15T23:59:00"),
      task("today", "2026-10-12T23:59:00"),
      task("already-past", "2026-10-12T11:00:00"),
      task("revision", "2026-10-13T23:59:00", "returned"),
    ],
    now,
  );
  assert.equal(counts.dueToday, 1);
  assert.equal(counts.dueSoon, 2);
  assert.equal(counts.total, 5);
  assert.deepEqual(
    groups.dueSoon.map((item) => item.id),
    ["today", "soon"],
  );
  const ids = Object.values(groups)
    .flat()
    .map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(
    summarizeTasks([task("done", "2026-10-11T23:59:00", "submitted")], now).counts.total,
    0,
  );
});

test("attendance excludes six unmarked meetings: one Present + one Absent remains 50%", () => {
  const result = summarizeAttendance(
    ["present", "absent", ...Array(6).fill("unmarked")].map((status) => ({ status })),
  );
  assert.equal(result.counted, 2);
  assert.equal(result.attended, 1);
  assert.equal(result.percentage, 50);
  assert.equal(result.unmarked, 6);
});

test("Late counts as attended; Excused, Unmarked and cancelled records do not", () => {
  const result = summarizeAttendance([
    { status: "present" },
    { status: "late" },
    { status: "absent" },
    { status: "excused" },
    { status: "unmarked" },
    { status: "cancelled" },
    { status: "present", cancelled: true },
    { status: "unknown" },
    {},
  ]);
  assert.equal(result.attended, 2);
  assert.equal(result.counted, 3);
  assert.equal(result.percentage, 67);
  assert.equal(result.absent, 1);
  assert.equal(result.cancelled, 2);
  assert.equal(result.unmarked, 3);
  assert.equal(attendanceStatus({ status: "excused" }), "excused");
});

test("attendance without counted meetings has no fabricated percentage", () => {
  assert.equal(summarizeAttendance([]).percentage, null);
  assert.equal(summarizeAttendance([{ status: "excused" }, { status: null }]).percentage, null);
});

test("grade conversion follows every OCC threshold and rounds at the pass boundary", () => {
  for (let percent = 75; percent <= 95; percent += 1)
    assert.equal(gradeEquivalent(percent), (105 - percent) / 10);
  assert.equal(gradeEquivalent(100), 1);
  assert.equal(gradeEquivalent(74.49), 5);
  assert.equal(gradeEquivalent(74.5), 3);
  assert.equal(gradeEquivalent(null), null);
});

test("Class Standing 87% and Exam 100% produce 90.9%, rounded to 91%, equivalent 1.4", () => {
  const result = calculateTermGrade(term());
  assert.ok(result.complete);
  assert.ok(Math.abs(result.percentage - 90.9) < 1e-8);
  assert.equal(result.roundedPercentage, 91);
  assert.equal(result.equivalent, 1.4);
});

test("rounding happens after contributions, not before", () => {
  const input = term();
  input.categories[0].assessments = [{ score: 437, maxScore: 500 }];
  input.exam = { score: 442, maxScore: 500 };
  const result = calculateTermGrade(input);
  assert.ok(Math.abs(result.percentage - 87.7) < 1e-8);
  assert.equal(result.roundedPercentage, 88);
  assert.equal(result.equivalent, 1.7);
});

test("a category pools points rather than averaging assessment percentages", () => {
  const input = term();
  input.categories[0].assessments = [
    { score: 1, maxScore: 10 },
    { score: 90, maxScore: 100 },
  ];
  const category = calculateTermGrade(input).categories[0];
  assert.equal(category.earned, 91);
  assert.equal(category.possible, 110);
  assert.ok(Math.abs(category.percentage - (91 / 110) * 100) < 1e-8);
});

test("missing scores withhold the term grade while an actual zero is a valid score", () => {
  assert.equal(calculateTermGrade(term(null)).equivalent, null);
  assert.equal(calculateTermGrade(term(87, null)).percentage, null);
  assert.equal(calculateTermGrade(term(0, 0)).equivalent, 5);
  const input = term();
  input.categories[0].assessments.push({ score: null, maxScore: 20 });
  const result = calculateTermGrade(input);
  assert.equal(result.categories[0].possible, 100);
  assert.equal(result.categories[0].pending, 1);
  assert.equal(result.equivalent, null);
});

test("unreleased grades and invalid weighting do not expose a final equivalent", () => {
  const result = calculateTermGrade({ ...term(), released: false });
  assert.deepEqual(result.categories, []);
  assert.equal(result.equivalent, null);
  const input = term();
  input.categories[0].weight = 30;
  assert.equal(calculateTermGrade(input).complete, false);
  assert.equal(calculateTermGrade({ ...term(), examWeight: 50 }).complete, false);
});

test("class summary and attendance detail use the same calculation", () => {
  assert.deepEqual(getClass("it311").attendance, summarizeAttendance(getAttendance("it311")));
  assert.ok(getGrades("it311").some((row) => calculateTermGrade(row).complete));
  assert.equal(calculateTermGrade(getGrades("it312")[1]).equivalent, null);
  assert.equal(calculateTermGrade(getGrades("it313")[0]).equivalent, 5);
});

test("submitting overdue and returned work updates Home and class counts", () => {
  const before = getHome().taskSummary;
  for (const id of ["asg-7", "asg-8"]) {
    const result = submitAssignment(id, { file: { name: "work.zip", size: 1024 } });
    assert.equal(result.error, undefined);
    assert.equal(getAssignment(id).status, "late");
  }
  const after = getHome();
  assert.equal(after.taskSummary.total, before.total - 2);
  assert.equal(after.taskSummary.overdue, before.overdue - 1);
  assert.equal(after.taskSummary.needsRevision, before.needsRevision - 1);
  assert.equal(getClass("it313").tasksDue, 0);
  assert.equal(after.taskSummary.total, summarizeTasks(getAssignments()).counts.total);
});
