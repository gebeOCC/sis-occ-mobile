# Student Portal (Expo prototype)

Mobile prototype of the Student Portal: Login, Home, My Classes, Class Overview, Announcements, Materials, and Assignment & Submission.

Expo SDK 57 · Expo Router · NativeWind · React Query · Axios. JavaScript, no backend needed: a mock API answers every request.

## Run

```bash
npm install
npx expo start        # scan the QR code with Expo Go, or press i / a for a simulator
```

The app opens on the Login screen. Tap **Log in** (no credentials are checked) to enter. Other scripts: `npm run lint`, `npm run format`.

Using a development build (`npx expo run:android` / `run:ios`)? `expo-document-picker` is a native module, so rebuild once after pulling this version.

## Screens

| Screen                     | Route                                   | File                                                        |
| -------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Login (prototype)          | `/login`                                | `src/app/login.jsx`                                         |
| 01 Home                    | `/`                                     | `src/app/(tabs)/index.jsx`                                  |
| 02 My Classes              | `/classes`                              | `src/app/(tabs)/classes.jsx`                                |
| Tasks                      | `/tasks`                                | `src/app/(tabs)/tasks.jsx`                                  |
| Profile                    | `/profile`                              | `src/app/(tabs)/profile.jsx`                                |
| 03 Class Overview          | `/class/it311`                          | `src/app/class/[classId]/index.jsx`                         |
| 04 Announcements           | `/class/it311/announcements`            | `src/app/class/[classId]/announcements.jsx`                 |
| Announcement (full)        | `/class/it311/announcement/ann-1`       | `src/app/class/[classId]/announcement/[announcementId].jsx` |
| 05 Materials               | `/class/it311/materials`                | `src/app/class/[classId]/materials.jsx`                     |
| Assignments list           | `/class/it311/assignments`              | `src/app/class/[classId]/assignments/index.jsx`             |
| 06 Assignment & Submission | `/class/it311/assignments/asg-1`        | `src/app/class/[classId]/assignments/[assignmentId].jsx`    |
| Attendance, Grades         | `/class/it311/attendance`, `.../grades` | `src/app/class/[classId]/attendance.jsx`, `grades.jsx`      |

## Structure

```
src/
├── app/                      Routes only (Expo Router). Screens stay thin.
│   ├── _layout.jsx           Providers + route guard (Stack.Protected): signed out sees only Login
│   ├── login.jsx             Login screen
│   ├── (tabs)/               Home, Classes, Tasks, Profile + tab bar
│   └── class/                _layout.jsx + [classId]/ (overview, announcements, materials, attendance, grades, assignments)
├── features/                 One folder per domain: api.js, hooks.js, components/
│   ├── auth/  home/  classes/  announcements/  materials/  assignments/  profile/
├── components/ui/            Design-system primitives (Card, Badge, Button, TextField, Notice, Screen, ...)
├── lib/                      axios client, cn(), formatters, assignment status rules, query client + keys
├── store/                    Zustand: session (signIn / signOut), persisted submission drafts
├── mocks/                    In-memory data + axios-mock-adapter handlers
└── theme/colors.js           Palette shared by tailwind.config.js and components
```

## Behaviour worth knowing

- **Assignment states.** `not_submitted`, `overdue`, `submitted`, `late`, `graded`, `returned`. Rules live in `src/lib/assignment.js`: deadlines inside 3 days show "N days left", past-due work with no submission reads Overdue, and the form appears only when the assignment's settings allow it (`allowLate`, `allowResubmission`). After submitting, the screen shows a confirmation with the submitted date and time.
- **Submission type.** `repository` assignments ask for frontend and backend links (plus group members when `requiresGroupMembers`). `file` assignments show a file picker that enforces `allowedFormats` and `maxFileSizeMb`. Validation is built per assignment in `src/features/assignments/schema.js`.
- **Filters** only appear when the data supports them: class status, announcement unread/pinned, and material types present in the class.
- **Home** separates Overdue, Needs revision, Due soon (today through the next seven calendar days), and Upcoming. Each group previews up to three items. The banner counts all outstanding assignments and says “You’re all caught up” only when there are none, including overdue and returned work. It refreshes each minute while active and after submissions. “View tasks” opens the full task list.
- **Class navigation** uses one resource menu with live counts. The duplicate horizontal shortcuts have been removed. Attendance and task counts agree with their detail screens.
- **Task rows** allow two title lines, let the full deadline wrap, and place the status underneath instead of squeezing it beside the title.
- **Announcement shortcuts** open the selected announcement directly. The Home section's “View all” action still opens its class announcement list.
- **Attendance** keeps Present, Late, Absent, Excused, Unmarked, and Cancelled distinct. `Counted = Present + Late + Absent`; `Attended = Present + Late`; percentage is `Attended / Counted × 100`, rounded for display. Excused, Unmarked, cancelled and unknown marks never become absences. With no counted meetings, the screen shows a dash rather than 0% or 100%.
- **Grades** have expandable Midterm/Final cards with grade equivalent, whole percentage, category weights, individual assessment scores, pooled category totals, and exam contributions. Class Standing contributes 70%, Exam 30%. Category weights total 100% within Class Standing. A term without all required scores has no final percentage/equivalent; a real zero remains zero. Unreleased terms display no scores.
- **Grade conversion** keeps precision through category and term calculations, rounds the completed term percentage once, then applies the OCC scale: 95+ → 1.0; 94 → 1.1; each percentage point below that adds 0.1 through 75 → 3.0; 74 and below → 5.0. Grades up to 3.0 are passing. Rules live in `src/lib/grades.js`; attendance rules live in `src/lib/attendance.js`.
- **Accessibility.** Text and badge colours meet WCAG AA contrast, interactive rows are 44 pt or taller, and buttons carry labels and roles. There is no dark mode because the app theme is light only.
- **States.** Every list handles loading, empty and error cases, and a lost connection shows its own "You’re offline" message.

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

Login is a stub. `signIn()` in `src/store/session.js` stores a placeholder token and the route guard in `src/app/_layout.jsx` lets the user in. The session is not persisted, so every fresh launch starts at Login. To skip Login while developing, set `token: MOCK_TOKEN` in that store. Profile → **Sign out** clears the session and cached data and returns to Login.

## Mock API to real backend

Copy `.env.example` to `.env`, then set `EXPO_PUBLIC_USE_MOCK=false` and `EXPO_PUBLIC_API_URL` (Android emulator: `http://10.0.2.2:8000/api`). To add real login, replace `signIn` with a login request that stores the returned token; the axios client already sends it as a Bearer header and signs the user out on any 401. The app expects these endpoints. Payload shapes are in `src/mocks/db.js`.

| Method | Path                           | Returns                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/me`                          | Student                                                                                                                                                                                                                                                                                                                                                                    |
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

Keys are camelCase. If your Laravel resources return snake_case, map them in `src/features/*/api.js`. The mock sends only file metadata for uploads; for a real API, send a `FormData` body from `submitAssignment` in `src/features/assignments/api.js`.

The Home and Grades response shapes changed in this revision; update those Laravel resources together with the client. The real backend must authorize the student and enforce grade release; hiding a score in the UI is not access control. Use the same attendance policy and grade rounding on the server. Demo grade examples live in `src/mocks/grades.js` and include passed, failed, incomplete, and unreleased terms; they are not student records.

## Checks

```bash
npm test            # Home grouping, attendance, grade boundaries and submission-count updates
npm run lint
npx expo export --platform android --output-dir dist-android
```

Verified with Node 24.19.0: all 13 regression tests pass, lint passes, and the Android JavaScript/assets export succeeds. Phone-width web checks at 320 px and 390 px cover direct announcement navigation, the class menu, attendance, expanded grades, and an incomplete term, with no browser runtime errors. Web previews used a temporary `react-native-web` installation; the native project's dependency list and lockfile are unchanged.

The Android export is a bundle check, not an APK build or a native-device test. On a device, check Home → overdue/revision task → submission, Home → announcement, Classes → attendance, and the expandable grade cards. The mock data resets after reloading.

## Prototype shortcuts

- Previews and downloads show a toast. Add `expo-file-system` + `expo-sharing` in `src/lib/files.js` to make them real.
- Mock data resets on reload and its dates are relative to when the app starts. Unsent repository links persist on the device.
- The notification bell shows a toast; there is no notifications screen yet.
- NativeWind 4 is the stable release. NativeWind 5 is at release candidate and uses Tailwind 4.
