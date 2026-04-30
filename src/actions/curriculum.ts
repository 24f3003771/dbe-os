"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// ─── Supabase client (server-side) ───────────────────────────────────────────

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Term = {
    id: number;
    name: string;
    is_active: boolean;
    assigned_batch: string | null;
};

export type Subject = {
    id: string;
    term_id: number;
    name: string;
    code: string;
    module_count: 4 | 8;
    strict_time_limit: number | null; // Represents total exam duration in minutes
    calculator_enabled: boolean;
    negative_marking: boolean;
    neg_marking_value: "1/3" | "1/2" | "1/4";
    created_at: string;
};

export type Topic = {
    id: string;
    subject_id: string;
    name: string;
    created_at: string;
};

export type Note = {
    id: string;
    subject_id: string;
    module_number: number;
    topic_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;
};

export type QuizSet = {
    id: string;
    subject_id: string;
    name: string;
    created_at: string;
};

export type Question = {
    id: string;
    subject_id: string;
    type: "cla" | "midterm" | "practice" | "exam";
    input_type: "mcq" | "text";
    module_from: number;
    module_to: number;
    topic_id: string | null;
    quiz_set_id: string | null;
    question: string;
    options: string[] | null;
    correct_index: number | null;
    word_limit: number | null;
    created_at: string;
};

export type BulkQuestion = Omit<Question, "id" | "subject_id" | "created_at">;

// ─── TERMS ───────────────────────────────────────────────────────────────────

export async function getTerms(): Promise<Term[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("terms")
        .select("*")
        .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Term[];
}

export async function updateTerm(
    id: number,
    updates: Partial<Pick<Term, "is_active" | "assigned_batch">>
) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("terms").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/hq-admin/curriculum");
}

// ─── SUBJECTS ────────────────────────────────────────────────────────────────

export async function getSubjects(termId?: number): Promise<Subject[]> {
    const supabase = await getSupabase();
    let query = supabase.from("subjects").select("*").order("created_at", { ascending: false });
    if (termId) query = query.eq("term_id", termId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Subject[];
}

export async function getSubjectById(id: string): Promise<Subject | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();
    if (error) return null;
    return data as Subject;
}

export async function createSubject(data: {
    term_id: number;
    name: string;
    code: string;
    module_count: 4 | 8;
    strict_time_limit?: number | null;
    calculator_enabled?: boolean;
    negative_marking?: boolean;
    neg_marking_value?: string;
}) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("subjects").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/hq-admin/curriculum");
}

export async function updateSubject(
    id: string,
    data: Partial<Pick<Subject, "name" | "code" | "module_count" | "strict_time_limit" | "term_id" | "calculator_enabled" | "negative_marking" | "neg_marking_value">>
) {
    const supabase = await getSupabase();
    const { error } = await supabase
        .from("subjects")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/hq-admin/curriculum");
}

export async function deleteSubject(id: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/hq-admin/curriculum");
}

// ─── TOPICS ──────────────────────────────────────────────────────────────────

export async function getTopics(subjectId: string): Promise<Topic[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Topic[];
}

export async function createTopic(subjectId: string, name: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("topics").insert({ subject_id: subjectId, name });
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
    revalidatePath("/hq-admin/topics");
}

export async function deleteTopic(id: string, subjectId: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
    revalidatePath("/hq-admin/topics");
}

// ─── NOTES ───────────────────────────────────────────────────────────────────

export async function getNotesForSubject(subjectId: string): Promise<Note[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("subject_id", subjectId)
        .order("module_number", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Note[];
}

export async function getNoteForModule(
    subjectId: string,
    moduleNumber: number
): Promise<Note | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("module_number", moduleNumber)
        .single();
    if (error) return null;
    return data as Note;
}

export async function upsertNote(
    subjectId: string,
    moduleNumber: number,
    data: { content: string; topic_id?: string | null }
) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("notes").upsert(
        {
            subject_id: subjectId,
            module_number: moduleNumber,
            content: data.content,
            topic_id: data.topic_id ?? null,
            updated_at: new Date().toISOString(),
        },
        { onConflict: "subject_id,module_number" }
    );
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
    revalidatePath(`/dbe_notes/${subjectId}`);
}

export async function deleteNote(subjectId: string, moduleNumber: number) {
    const supabase = await getSupabase();
    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("subject_id", subjectId)
        .eq("module_number", moduleNumber);
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
}

// ─── QUIZ SETS ───────────────────────────────────────────────────────────────

export async function getQuizSets(subjectId: string): Promise<QuizSet[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("quiz_sets")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as QuizSet[];
}

export async function createQuizSet(subjectId: string, name: string): Promise<QuizSet> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("quiz_sets")
        .insert([{ subject_id: subjectId, name }])
        .select()
        .single();
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
    return data as QuizSet;
}

export async function deleteQuizSet(id: string, subjectId: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("quiz_sets").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
}

// ─── QUESTIONS ───────────────────────────────────────────────────────────────

export async function getQuestions(
    subjectId: string,
    filters?: {
        type?: string;
        module?: number;
        input_type?: string;
    }
): Promise<Question[]> {
    const supabase = await getSupabase();
    let query = supabase
        .from("questions")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: false });

    if (filters?.type) query = query.eq("type", filters.type);
    if (filters?.input_type) query = query.eq("input_type", filters.input_type);
    if (filters?.module) {
        // module falls within the module_from → module_to range
        query = query
            .lte("module_from", filters.module)
            .gte("module_to", filters.module);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Question[];
}

export async function createQuestion(
    subjectId: string,
    data: Omit<Question, "id" | "subject_id" | "created_at">
) {
    const supabase = await getSupabase();
    const { error } = await supabase
        .from("questions")
        .insert({ ...data, subject_id: subjectId });
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
}

export async function updateQuestion(
    id: string,
    subjectId: string,
    data: Partial<Omit<Question, "id" | "subject_id" | "created_at">>
) {
    const supabase = await getSupabase();
    const { error } = await supabase
        .from("questions")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
}

export async function deleteQuestion(id: string, subjectId: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
}

// ─── BULK IMPORT ─────────────────────────────────────────────────────────────

export type BulkImportResult = {
    success: boolean;
    imported: number;
    errors: string[];
};

export async function bulkImportQuestions(
    subjectId: string,
    rawJson: string,
    defaultTopicId?: string,
    defaultQuizSetId?: string
): Promise<BulkImportResult> {
    const errors: string[] = [];

    // Parse JSON
    let parsed: any[];
    try {
        parsed = JSON.parse(rawJson);
        if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
    } catch (e: any) {
        return { success: false, imported: 0, errors: [`JSON parse error: ${e.message}`] };
    }

    const validTypes = ["cla", "midterm", "practice", "exam"];
    const validInputTypes = ["mcq", "text"];

    const rows: any[] = [];

    parsed.forEach((q, i) => {
        const label = `Question ${i + 1}`;

        if (!validTypes.includes(q.type))
            errors.push(`${label}: invalid type "${q.type}"`);
        if (!validInputTypes.includes(q.input_type))
            errors.push(`${label}: invalid input_type "${q.input_type}"`);
        if (typeof q.module_from !== "number" || typeof q.module_to !== "number")
            errors.push(`${label}: module_from and module_to must be numbers`);
        else if (q.module_from > q.module_to)
            errors.push(`${label}: module_from cannot be greater than module_to`);
        if (!q.question || typeof q.question !== "string")
            errors.push(`${label}: question text is required`);
        if (q.input_type === "mcq") {
            if (!Array.isArray(q.options) || q.options.length !== 4)
                errors.push(`${label}: MCQ requires exactly 4 options`);
            else if (typeof q.correct_index !== "number" || q.correct_index < 0 || q.correct_index > 3)
                errors.push(`${label}: correct_index must be 0–3`);
        } else if (q.input_type === "text") {
            if (q.word_limit !== undefined && typeof q.word_limit !== "number") {
                errors.push(`${label}: word_limit must be a number`);
            }
        }
        
        if (q.type === "exam" && !q.quiz_set_id && !defaultQuizSetId)
            errors.push(`Row ${i + 1}: Exam questions must have a quiz_set_id (or select an Exam Set override above)`);

        if (errors.length === 0 || !errors.some((e) => e.startsWith(label))) {
            // If admin selected an Exam Set override, force type → "exam" and apply the set ID
            const effectiveType = defaultQuizSetId ? "exam" : q.type;
            const effectiveQuizSetId = defaultQuizSetId
                ? (q.quiz_set_id || defaultQuizSetId)
                : (q.type === "exam" ? (q.quiz_set_id || null) : null);

            rows.push({
                subject_id: subjectId,
                type: effectiveType,
                input_type: q.input_type,
                module_from: q.module_from,
                module_to: q.module_to,
                topic_id: q.topic_id || defaultTopicId || null,
                quiz_set_id: effectiveQuizSetId,
                question: q.question,
                options: q.input_type === "mcq" ? q.options : null,
                correct_index: q.input_type === "mcq" ? q.correct_index : null,
                explanation: (q as any).explanation || null,
                word_limit: q.input_type === "text" ? (q.word_limit ?? null) : null,
            });
        }
    });

    if (errors.length > 0) {
        return { success: false, imported: 0, errors };
    }

    const supabase = await getSupabase();
    const { error } = await supabase.from("questions").insert(rows);
    if (error) return { success: false, imported: 0, errors: [error.message] };

    revalidatePath(`/hq-admin/curriculum/${subjectId}`);
    return { success: true, imported: rows.length, errors: [] };
}

// ─── PUBLIC: Batch-aware subject fetching ─────────────────────────────────────

export async function getSubjectsForBatch(batch: string): Promise<Subject[]> {
    const supabase = await getSupabase();
    // Find term assigned to this batch
    const { data: term, error: termError } = await supabase
        .from("terms")
        .select("id")
        .eq("assigned_batch", batch)
        .eq("is_active", true)
        .single();

    if (termError || !term) return [];

    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("term_id", term.id)
        .order("created_at", { ascending: true });

    if (error) return [];
    return data as Subject[];
}

// ─── AI PROMPT GENERATOR ──────────────────────────────────────────────────────
