export type MaterialKind = "pdf" | "zip" | "link" | "image" | "video";

export interface Material {
  id: string;
  classId: string;
  title: string;
  kind: MaterialKind;
  size: string | null;
  url: string;
}
