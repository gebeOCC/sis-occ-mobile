import type { ClassSummary } from "@/features/classes/types";

/** "IT311 · App Development", shown under screen titles. Undefined while the class loads. */
export const classSubtitle = (cls: Pick<ClassSummary, "code" | "title"> | null | undefined) =>
  cls ? `${cls.code} · ${cls.title}` : undefined;
