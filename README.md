# Student Portal (Expo prototype)

Mobile prototype of the Student Portal: Login, Home, My Classes, Class Overview, Announcements, Materials, and Assignment & Submission.

Expo SDK 57 · Expo Router · NativeWind · React Query · Axios. TypeScript / TSX, no backend needed: a mock API answers every request.

## Run

```bash
npm install
npx expo start        # scan the QR code with Expo Go, or press i / a for a simulator
```

The app opens on the Login screen. Use **Explore demo** for immediate access, or enter a student ID/email and password then tap **Log in**. Fields are validated for presence; credentials are not verified in this prototype. Other scripts: `npm run typecheck`, `npm run lint`, `npm test`, `npm run format`.

TypeScript uses Expo’s base configuration with strict checking and the `@/*` source alias. Screens and components use `.tsx`; supporting app modules use `.ts`. Each feature owns its data models in `types.ts`; shared attachment types live in `src/types/files.ts`. The CommonJS theme palettes remain `.js` because Tailwind also loads them. NativeWind types are declared in `nativewind-env.d.ts`.

`npm test` imports TypeScript directly using Node’s built-in type stripping; use Node.js 22.18 or newer.

Using a development build (`npx expo run:android` / `run:ios`)? `expo-document-picker` is a native module, so rebuild once after pulling this version.

## Screens

| Screen                     | Route                                   | File                                                        |
| -------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Login (prototype)          | `/login`                                | `src/app/login.tsx`                                         |
| 01 Home                    | `/`                                     | `src/app/(tabs)/index.tsx`                                  |
| 02 My Classes              | `/classes`                              | `src/app/(tabs)/classes.tsx`                                |
| Tasks                      | `/tasks`                                | `src/app/(tabs)/tasks.tsx`                                  |
| Profile                    | `/profile`                              | `src/app/(tabs)/profile.tsx`                                |
| 03 Class Overview          | `/class/it311`                          | `src/app/class/[classId]/index.tsx`                         |
| 04 Announcements           | `/class/it311/announcements`            | `src/app/class/[classId]/announcements.tsx`                 |
| Announcement (full)        | `/class/it311/announcement/ann-1`       | `src/app/class/[classId]/announcement/[announcementId].tsx` |
| 05 Materials               | `/class/it311/materials`                | `src/app/class/[classId]/materials.tsx`                     |
| Assignments list           | `/class/it311/assignments`              | `src/app/class/[classId]/assignments/index.tsx`             |
| 06 Assignment & Submission | `/class/it311/assignments/asg-1`        | `src/app/class/[classId]/assignments/[assignmentId].tsx`    |
| Attendance, Grades         | `/class/it311/attendance`, `.../grades` | `src/app/class/[classId]/attendance.tsx`, `grades.tsx`      |

## Structure

```
src/
├── app/                      Expo route entries, layouts, and providers
│   ├── _layout.tsx           Providers + protected navigation
│   ├── (tabs)/               Thin Home, Classes, Tasks, Profile route entries
│   └── class/                Nested class route entries and layout
├── features/                 auth, home, classes, announcements, materials, assignments, profile
│   └── <feature>/
│       ├── screens/          Screen implementations rendered by route entries
│       ├── components/       Feature components and their skeleton layouts
│       ├── api.ts            Typed API requests
│       ├── hooks.ts          Feature queries and actions
│       └── types.ts          Feature data models; rules/schema files where needed
├── components/ui/            Shared UI and generic skeleton primitives/layout helpers
├── lib/                      HTTP/query infrastructure, formatting, file actions, cn(), constants
├── store/                    Shared Zustand session and persisted submission drafts
├── mocks/                    In-memory data + axios-mock-adapter handlers
├── types/                    Shared attachment types and asset declarations
└── theme/                    Palette and appearance provider; palettes also used by Tailwind
```

The screen table above lists Expo route entries. Each entry re-exports a screen from its feature's `screens/` folder. Layout files continue to own navigation and providers.

Assignment rules and task grouping live in `features/assignments`; grade and attendance calculations live in `features/classes`. Domain types and calculations do not depend on UI component types. Badge, notice, and icon presentation types stay with their shared UI components.

Screens pass their feature-owned skeleton through `QueryBoundary`'s `loadingFallback`. Shared UI contains generic skeleton shapes and animation, and has no feature registry or feature imports. Cross-feature consumers import from the owning feature directly.

## Behaviour worth knowing

- **Assignment states.** `not_submitted`, `overdue`, `submitted`, `late`, `graded`, `returned`. Rules live in `src/features/assignments/rules.ts`: deadlines inside 3 days show "N days left", past-due work with no submission reads Overdue, and the form appears only when the assignment's settings allow it (`allowLate`, `allowResubmission`). After submitting, the screen shows a confirmation with the submitted date and time.
- **Submission type.** `repository` assignments ask for frontend and backend links (plus group members when `requiresGroupMembers`). `file` assignments show a file picker that enforces `allowedFormats` and `maxFileSizeMb`. Validation is built per assignment in `src/features/assignments/schema.ts`.
- **Filters** only appear when the data supports them: class status, announcement unread/pinned, and material types present in the class.
- **Home** summarizes Overdue, Needs revision, Due soon (today through the next seven calendar days), and Upcoming in its banner. Only Due soon previews up to three assignments, keeping Home compact. The banner counts all outstanding assignments and says “You’re all caught up” only when there are none, including overdue and returned work. It refreshes each minute while active and after submissions. “View tasks” opens the full task list.
- **Class navigation** uses one resource menu with live counts. The duplicate horizontal shortcuts have been removed. Attendance and task counts agree with their detail screens.
- **Task rows** allow two title lines, let the full deadline wrap, and place the status underneath instead of squeezing it beside the title.
- **Announcement shortcuts** open the selected announcement directly. The Home section's “View all” action still opens its class announcement list.
- **Attendance** keeps Present, Late, Absent, Excused, Unmarked, and Cancelled distinct. `Counted = Present + Late + Absent`; `Attended = Present + Late`; percentage is `Attended / Counted × 100`, rounded for display. Excused, Unmarked, cancelled and unknown marks never become absences. With no counted meetings, the screen shows a dash rather than 0% or 100%.
- **Grades** have expandable Midterm/Final cards with grade equivalent, whole percentage, category weights, individual assessment scores, pooled category totals, and exam contributions. Class Standing contributes 70%, Exam 30%. Category weights total 100% within Class Standing. A term without all required scores has no final percentage/equivalent; a real zero remains zero. Unreleased terms display no scores.
- **Grade conversion** keeps precision through category and term calculations, rounds the completed term percentage once, then applies the OCC scale: 95+ → 1.0; 94 → 1.1; each percentage point below that adds 0.1 through 75 → 3.0; 74 and below → 5.0. Grades up to 3.0 are passing. Rules live in `src/features/classes/grades.ts`; attendance rules live in `src/features/classes/attendance.ts`.
- **Accessibility.** Text and badge colours meet WCAG AA contrast, interactive rows are 44 pt or taller, and buttons carry labels and roles. Appearance follows the System, Light, or Dark preference selected in Profile.
- **States.** Initial content loads use skeletons that match each screen. They pulse gently, respect Reduce Motion, and leave cached content visible during refresh. Every list also handles empty and error cases, and a lost connection shows its own "You’re offline" message.

## Libraries

| Library                                          | Used for                                  |
| ------------------------------------------------ | ----------------------------------------- |
| expo-router                                      | File-based navigation (tabs + stack)      |
| nativewind + tailwindcss 3.4                     | Tailwind classes in React Native          |
| @tanstack/react-query, axios, axios-mock-adapter | Data fetching, caching, mock backend      |
| react-hook-form, zod, @hookform/resolvers        | Submission form and validation            |
| expo-document-picker                             | File uploads for file-based assignments   |
| zustand + async-storage                          | Session state, persisted drafts           |
| lucide-react-native, react-native-svg            | Icons                                     |
| sonner-native                                    | Toasts                                    |
| date-fns, clsx, tailwind-merge                   | Dates, class merging (`cn`)               |
| expo-haptics, expo-web-browser                   | Haptic feedback, in-app browser for links |
| reanimated, worklets, gesture-handler            | Required by NativeWind and sonner-native  |

## Login (prototype)

Login provides inline field errors, password visibility, keyboard navigation, and a separate **Explore demo** action. `signIn()` in `src/store/session.ts` stores a placeholder token; credentials are not sent to a backend. The session is not persisted, so every fresh launch starts at Login. Profile → **Sign out** asks for confirmation, clears the session and cached data, and returns to Login.

**Forgot password?** opens `/forgot-password`. The form validates and normalizes the email, submits `POST /forgot-password`, and handles loading, connection errors, retry, and confirmation. Mock responses include `demo: true`; the confirmation explicitly states that no email is sent and no password changes. A real backend must deliver reset links and omit the demo flag. Recovery is also available from Profile, with the registered email filled in and a return path to Profile.

The Home bell and Profile's Notifications action open `/notifications`, an inbox across all classes. It starts with **Unread** and also offers **All updates**. Opening an announcement marks it read and refreshes the inbox, Home indicator, and class unread counts. A failed read receipt can be retried by refreshing the announcement.

Profile groups student identity, academic details, appearance, and account actions. Its Light/Dark/System selectors use the existing persisted appearance preference.

## Mock API to real backend

Copy `.env.example` to `.env`, then set `EXPO_PUBLIC_USE_MOCK=false` and `EXPO_PUBLIC_API_URL` (Android emulator: `http://10.0.2.2:8000/api`). To add real login, replace `signIn` with a login request that stores the returned token; the axios client already sends it as a Bearer header and signs the user out on any 401. The app expects these endpoints. Payload shapes are in `src/mocks/db.ts`.

| Method | Path                           | Returns                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/me`                          | Student                                                                                                                                                                                                                                                                                                                                                                    |
| GET    | `/announcements`               | All class announcements, newest first, with the same announcement shape as the class feed. Used by the notification inbox. |
| POST   | `/forgot-password`             | Body: `{ email }`. Returns `{ message, demo? }`; mock responses set `demo: true` and do not send email. A real backend should send a reset link, respond generically for unknown accounts, and omit `demo`. |
| GET    | `/home`                        | `{ student, hasUnreadNotifications, taskSummary, taskGroups, schedule: { kind, whenLabel, classes[] }, latestAnnouncement }`. `taskSummary` contains `overdue`, `needsRevision`, `dueToday`, `dueSoon`, `upcoming`, `total`. `taskGroups` contains up to three assignments per `overdue`, `needsRevision`, `dueSoon`, `upcoming` key. `dueToday` is a subset of `dueSoon`. |
| GET    | `/classes`                     | Class summaries: `status` (`ongoing`/`upcoming`/`completed`), schedule, room, unread, tasks due, materials, attendance                                                                                                                                                                                                                                                     |
| GET    | `/classes/{id}`                | Class summary + `highlight` announcement                                                                                                                                                                                                                                                                                                                                   |
| GET    | `/classes/{id}/announcements`  | Announcements with full `body`, `pinned`, `read`, `attachments[]`                                                                                                                                                                                                                                                                                                          |
| POST   | `/announcements/{id}/read`     | Announcement. Called when a student opens one                                                                                                                                                                                                                                                                                                                              |
| GET    | `/classes/{id}/materials`      | Materials: `kind` is `pdf`, `zip`, `image` or `link`; others get a generic badge                                                                                                                                                                                                                                                                                           |
| GET    | `/classes/{id}/assignments`    | Assignments for one class                                                                                                                                                                                                                                                                                                                                                  |
| GET    | `/assignments`                 | Assignments across all classes                                                                                                                                                                                                                                                                                                                                             |
| GET    | `/assignments/{id}`            | Assignment: `status`, `dueAt`, `maxScore`, `score`, `feedback`, `submissionType`, `requiresGroupMembers`, `allowedFormats`, `maxFileSizeMb`, `allowResubmission`, `allowLate`, `attachments[]`, `submission`                                                                                                                                                               |
| POST   | `/assignments/{id}/submission` | Updated assignment. Body: `{ frontendRepo, backendRepo, groupMembers? }` or `{ file: { name, size, mimeType } }`. Rule violations return 403/422 with `{ message }`, shown in a toast                                                                                                                                                                                      |
| GET    | `/classes/{id}/attendance`     | `[{ id, date, status, topic?, cancelled? }]`. Status: `present`, `late`, `absent`, `excused`, `unmarked`, or `cancelled`. Class summaries include the same status counts plus `total`, `attended`, `counted`, and nullable `percentage`.                                                                                                                                   |
| GET    | `/classes/{id}/grades`         | `[{ period, released, classStandingWeight, examWeight, categories: [{ id, name, weight, assessments: [{ id, name, score, maxScore }] }], exam: { score, maxScore } }]`. Use `null` for missing scores. For unreleased terms, return only `{ period, released: false }`.                                                                                                    |

Keys are camelCase. If your Laravel resources return snake_case, map them in `src/features/*/api.ts`. The mock sends only file metadata for uploads; for a real API, send a `FormData` body from `submitAssignment` in `src/features/assignments/api.ts`.

The Home and Grades response shapes changed in this revision; update those Laravel resources together with the client. The real backend must authorize the student and enforce grade release; hiding a score in the UI is not access control. Use the same attendance policy and grade rounding on the server. Demo grade examples live in `src/mocks/grades.ts` and include passed, failed, incomplete, and unreleased terms; they are not student records.

## Checks

```bash
npm test            # Academic calculations, submission counts, notification read state and recovery validation
npm run typecheck
npm run lint
npx expo export --platform android --output-dir dist-android
```

Automated checks cover 18 tests, strict TypeScript checking, ESLint, and an Android JavaScript/assets export. Additional mock API integration checks cover the global inbox, read-state synchronization, and recovery success/error responses. No new dependencies are required.

The Android export is a bundle check, not an APK build or a native-device test. On a device, check Home → overdue/revision task → submission, Home → announcement, Classes → attendance, and the expandable grade cards. The mock data resets after reloading.

## Prototype shortcuts

- Previews and downloads show a toast. Add `expo-file-system` + `expo-sharing` in `src/lib/files.ts` to make them real.
- Mock data resets on reload and its dates are relative to when the app starts. Unsent repository links persist on the device.
- Password recovery is demonstrated through the mock API; it does not deliver email until connected to a real backend.
- NativeWind 4 is the stable release. NativeWind 5 is at release candidate and uses Tailwind 4.
