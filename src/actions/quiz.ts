"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function getSupabase() {
    const cookieStore = await cookies();
    return createClient(cookieStore);
}

async function getAuthUserId(): Promise<string> {
    const supabase = await getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    return user.id;
}

// ─── Response Types ──────────────────────────────────────────────────────────

type McqResponse = {
    inputType: "mcq";
    questionId: string;
    questionText: string;
    options: string[];
    selectedIndex: number | null;    // null = unanswered
    selectedAnswer: string | null;
    correctIndex: number;
    correctAnswer: string;
    isCorrect: boolean;
    timeTaken: number;               // seconds on this question
    explanation?: string | null;
};

type TextResponse = {
    inputType: "text";
    questionId: string;
    questionText: string;
    writtenAnswer: string | null;    // null = unanswered
    wordLimit?: number | null;
    explanation?: string | null;
    timeTaken: number;               // seconds on this question
    isCorrect: null;                 // self-graded — AI provides grade instead
    ai_grade: number | null;         // 0–100 from AI evaluation
    ai_feedback: string | null;      // one-line AI feedback
};

export type QuestionResponse = McqResponse | TextResponse;

export async function saveExamResult(data: {
    subject: string;
    score: number;
    totalQuestions: number;
    timerPerQuestion: number;
    totalTimeTaken: number;
    responses: QuestionResponse[];
    tomatoesEarned?: number;
}) {
    try {
        const supabase = await getSupabase();
        const userId = await getAuthUserId();

        const { data: result, error } = await supabase
            .from("exam_results")
            .insert({
                user_id: userId,
                subject: data.subject,
                score: data.score,
                total_questions: data.totalQuestions,
                timer_per_question: data.timerPerQuestion,
                total_time_taken: data.totalTimeTaken,
                responses: data.responses,
                tomatoes_earned: data.tomatoesEarned ?? 0,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        revalidatePath("/quiz");
        return result;
    } catch (error) {
        console.error("Error saving exam result:", error);
        return null;
    }
}

export async function getExamHistory() {
    try {
        const supabase = await getSupabase();
        const userId = await getAuthUserId();

        const { data, error } = await supabase
            .from("exam_results")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    } catch (error) {
        console.error("Error fetching exam history:", error);
        return [];
    }
}

export async function deleteExamResult(id: string) {
    try {
        const supabase = await getSupabase();
        const userId = await getAuthUserId();

        const { error } = await supabase
            .from("exam_results")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
        revalidatePath("/quiz");
    } catch (error) {
        console.error("Error deleting exam result:", error);
        throw error;
    }
}
