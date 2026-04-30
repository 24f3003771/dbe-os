import term2Data from './term2_quizDatabase.json';

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    type?: string;
    quiz_set_id?: string | null;
    input_type?: string;
    word_limit?: number | null;
    module_from?: number;
    module_to?: number;
}

export interface Module {
    id: number;
    title: string;
    questions: Question[];
}

export interface Subject {
    id: string;
    title: string;
    notesLink: string;
    modules: Module[];
}

// Extract matching type
export const db: Subject[] = term2Data as Subject[];

export function getAllSubjects(): Subject[] {
    return db;
}

export function getSubjectById(id: string): Subject | undefined {
    return db.find(s => s.id === id);
}

// Convert links from 'term2_data/notes/ID21x.md' to dynamic route '/dbe_notes/ID21x'
export function getNotesLink(id: string): string {
    return `/dbe_notes/${id}`;
}
