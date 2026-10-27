import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

export const greeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const longDate = (date = new Date()) => format(date, "EEEE, MMMM d");

/** "Oct 11, 11:59 PM" */
export const dueClock = (iso: string) => {
  const date = parseISO(iso);
  return `${format(date, "MMM d")}, ${format(date, "h:mm a")}`;
};

/** "Due Oct 11, 2026 · 11:59 PM" */
export const dueFull = (iso: string) => {
  const date = parseISO(iso);
  return `Due ${format(date, "MMM d, yyyy")} · ${format(date, "h:mm a")}`;
};

/** "Oct 7, 2026 · 2:00 PM" */
export const postedAt = (iso: string) => {
  const date = parseISO(iso);
  return `${format(date, "MMM d, yyyy")} · ${format(date, "h:mm a")}`;
};

export const timeAgo = (iso: string) =>
  formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });

export const meetingDate = (iso: string) => format(parseISO(iso), "EEE, MMM d");

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** 1153434 -> "1.1 MB" */
export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
