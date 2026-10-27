import type { Attachment } from "../../types/files";

export interface Announcement {
  id: string;
  classId: string;
  classCode: string;
  title: string;
  body: string;
  author: string;
  postedAt: string;
  pinned: boolean;
  read: boolean;
  attachments: Attachment[];
}
