import data from './officialChecklist.json';

export interface OfficialTask {
    id: string;
    title: string;
    subject: string;
    type: "assignment" | "quiz" | "exam" | "module" | "live-session";
    dueDate: string; // ISO string
}

export const OFFICIAL_SUBJECT_CHECKLISTS: Record<string, OfficialTask[]> = data as Record<string, OfficialTask[]>;
