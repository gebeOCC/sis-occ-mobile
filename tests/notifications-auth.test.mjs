import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema, passwordResetSchema } from "../src/features/auth/schema.ts";
import { passwordResetReply } from "../src/mocks/auth.ts";
import {
  getAllAnnouncements,
  getAnnouncements,
  getClass,
  getHome,
  markAnnouncementRead,
} from "../src/mocks/db.ts";

test("notification inbox contains every class announcement in newest-first order", () => {
  const items = getAllAnnouncements();
  assert.ok(items.length > 0);
  assert.ok(new Set(items.map((item) => item.classId)).size > 1);
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  for (let index = 1; index < items.length; index += 1) {
    assert.ok(items[index - 1].postedAt >= items[index].postedAt);
  }
  for (const classId of new Set(items.map((item) => item.classId))) {
    assert.deepEqual(
      items
        .filter((item) => item.classId === classId)
        .map((item) => item.id)
        .sort(),
      getAnnouncements(classId)
        .map((item) => item.id)
        .sort(),
    );
  }
});

test("opening unread announcements clears inbox, class and Home unread indicators consistently", () => {
  const unread = getAllAnnouncements().filter((item) => !item.read);
  assert.ok(unread.length > 0);
  assert.equal(getHome().hasUnreadNotifications, true);
  for (const item of unread) {
    const before = getClass(item.classId).unreadAnnouncements;
    assert.equal(markAnnouncementRead(item.id).read, true);
    assert.equal(getClass(item.classId).unreadAnnouncements, before - 1);
    assert.equal(getAnnouncements(item.classId).find((row) => row.id === item.id).read, true);
    markAnnouncementRead(item.id);
    assert.equal(getClass(item.classId).unreadAnnouncements, before - 1);
  }
  assert.equal(getAllAnnouncements().filter((item) => !item.read).length, 0);
  assert.equal(getHome().hasUnreadNotifications, false);
});

test("login requires both fields while allowing student IDs and email addresses", () => {
  assert.equal(loginSchema.safeParse({ identifier: " ", password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ identifier: "student-1", password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ identifier: "student-1", password: "demo" }).success, true);
  assert.equal(
    loginSchema.safeParse({ identifier: "student@school.edu", password: "demo" }).success,
    true,
  );
});

test("recovery normalizes email and rejects missing or invalid addresses", () => {
  assert.deepEqual(passwordResetSchema.parse({ email: "  STUDENT@school.edu  " }), {
    email: "student@school.edu",
  });
  for (const email of ["", "student", "student@", "student @school.edu"]) {
    assert.equal(passwordResetSchema.safeParse({ email }).success, false);
    assert.equal(passwordResetReply({ email })[0], 422);
  }
  assert.equal(passwordResetReply({})[0], 422);
  assert.equal(passwordResetReply("not json")[0], 400);
});

test("demo recovery responds generically for registered and unknown addresses without claiming email delivery", () => {
  const known = passwordResetReply({ email: "mika.santos@example.edu" });
  const unknown = passwordResetReply(JSON.stringify({ email: "unknown@school.edu" }));
  assert.deepEqual(known, unknown);
  assert.equal(known[0], 200);
  assert.equal(known[1].demo, true);
});
