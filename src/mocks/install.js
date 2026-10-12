// Answers the app's axios calls with data from ./db, so the prototype runs without a backend.
// The URLs and payloads here are the contract a Laravel API needs to match (see README).
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/api";
import * as db from "./db";

let installed = false;

const idFrom = (config, pattern) => pattern.exec(config.url ?? "")?.[1] ?? "";
const notFound = (what) => [404, { message: `${what} not found.` }];

export function installMockApi() {
  if (installed) return;
  installed = true;

  const mock = new MockAdapter(api, { delayResponse: 450 });

  mock.onGet("/me").reply(() => [200, db.student]);
  mock.onGet("/home").reply(() => [200, db.getHome()]);
  mock.onGet("/classes").reply(() => [200, db.getClasses()]);

  mock.onGet(/^\/classes\/[^/]+$/).reply((config) => {
    const cls = db.getClass(idFrom(config, /^\/classes\/([^/]+)$/));
    return cls ? [200, cls] : notFound("Class");
  });
  mock
    .onGet(/^\/classes\/[^/]+\/announcements$/)
    .reply((config) => [200, db.getAnnouncements(idFrom(config, /^\/classes\/([^/]+)\//))]);
  mock
    .onGet(/^\/classes\/[^/]+\/materials$/)
    .reply((config) => [200, db.getMaterials(idFrom(config, /^\/classes\/([^/]+)\//))]);
  mock
    .onGet(/^\/classes\/[^/]+\/assignments$/)
    .reply((config) => [200, db.getAssignments(idFrom(config, /^\/classes\/([^/]+)\//))]);
  mock
    .onGet(/^\/classes\/[^/]+\/attendance$/)
    .reply((config) => [200, db.getAttendance(idFrom(config, /^\/classes\/([^/]+)\//))]);
  mock
    .onGet(/^\/classes\/[^/]+\/grades$/)
    .reply((config) => [200, db.getGrades(idFrom(config, /^\/classes\/([^/]+)\//))]);

  mock.onGet("/assignments").reply(() => [200, db.getAssignments()]);
  mock.onGet(/^\/assignments\/[^/]+$/).reply((config) => {
    const item = db.getAssignment(idFrom(config, /^\/assignments\/([^/]+)$/));
    return item ? [200, item] : notFound("Assignment");
  });

  mock.onPost(/^\/announcements\/[^/]+\/read$/).reply((config) => {
    const item = db.markAnnouncementRead(idFrom(config, /^\/announcements\/([^/]+)\//));
    return item ? [200, item] : notFound("Announcement");
  });
  mock.onPost(/^\/assignments\/[^/]+\/submission$/).reply((config) => {
    const result = db.submitAssignment(
      idFrom(config, /^\/assignments\/([^/]+)\//),
      JSON.parse(config.data ?? "{}"),
    );
    return result.error ? [result.error[0], { message: result.error[1] }] : [200, result.item];
  });
}
