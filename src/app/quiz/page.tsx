import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";
const QuizDashboard = dynamic(() => import("./QuizDashboard"), {
    loading: () => <div className="animate-pulse bg-white rounded-3xl h-[600px] w-full" />
});

export default async function GlobalQuizPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    const batch = user?.user_metadata?.batch as string | undefined;

    let subjects: { id: string; name: string; code: string; module_count: number }[] = [];
    let termName = "";

    if (batch) {
        const { data: term } = await supabase
            .from("terms")
            .select("id, name")
            .eq("assigned_batch", batch)
            .eq("is_active", true)
            .single();

        if (term) {
            termName = term.name;
            const { data } = await supabase
                .from("subjects")
                .select("id, name, code, module_count")
                .eq("term_id", term.id)
                .order("created_at", { ascending: true });
            subjects = data ?? [];
        }
    }

    // Fetch question counts and concept builder progress per subject
    const subjectIds = subjects.map((s) => s.id);
    const questionCounts: Record<string, number> = {};
    let progressRows: { subject_id: string; module_number: number; difficulty: string; completed: boolean; best_score: number; attempts: number }[] = [];

    if (subjectIds.length > 0) {
        const { data: counts } = await supabase
            .from("questions")
            .select("subject_id")
            .in("subject_id", subjectIds);

        if (counts) {
            counts.forEach(({ subject_id }) => {
                questionCounts[subject_id] = (questionCounts[subject_id] ?? 0) + 1;
            });
        }

        if (user) {
            const { data: cbpData } = await supabase
                .from("concept_builder_progress")
                .select("subject_id, module_number, difficulty, completed, best_score, attempts")
                .eq("user_id", user.id)
                .in("subject_id", subjectIds);
            progressRows = (cbpData ?? []) as any[];
        }
    }

    const subjectProgressMap: Record<string, { completedLevels: number; totalLevels: number; progressPercent: number; accuracy: number }> = {};

    subjects.forEach((s) => {
        const totalLevels = (s.module_count || 4) * 3;
        const sRows = progressRows.filter((p) => p.subject_id === s.id);
        const completedLevels = sRows.filter((p) => p.completed).length;
        const attemptedRows = sRows.filter((p) => p.attempts > 0 || p.completed);

        const progressPercent = totalLevels > 0 ? Math.min(100, Math.round((completedLevels / totalLevels) * 100)) : 0;
        const accuracy = attemptedRows.length > 0
            ? Math.round(attemptedRows.reduce((acc, curr) => acc + (Number(curr.best_score) || 0), 0) / attemptedRows.length)
            : 0;

        subjectProgressMap[s.id] = {
            completedLevels,
            totalLevels,
            progressPercent,
            accuracy,
        };
    });

    const totalQuestions = Object.values(questionCounts).reduce((acc, curr) => acc + curr, 0);
    const totalAttemptedCount = progressRows.reduce((acc, curr) => acc + (curr.attempts || 0), 0);
    const attemptedLevelsAll = progressRows.filter((p) => p.attempts > 0 || p.completed);
    const overallAccuracy = attemptedLevelsAll.length > 0
        ? Math.round(attemptedLevelsAll.reduce((acc, curr) => acc + (Number(curr.best_score) || 0), 0) / attemptedLevelsAll.length)
        : 0;

    const totalQuestionsAnswered = totalAttemptedCount * 10;
    const totalCorrect = Math.round((totalQuestionsAnswered * overallAccuracy) / 100);
    const totalIncorrect = Math.max(0, totalQuestionsAnswered - totalCorrect);

    const userStats = {
        totalQuestions,
        overallAccuracy,
        totalAttempted: totalQuestionsAnswered,
        totalCorrect,
        totalIncorrect,
        hasProgress: progressRows.length > 0,
    };

    return (
        <QuizDashboard
            subjects={subjects.map((s) => ({
                ...s,
                questionCount: questionCounts[s.id] ?? 0,
                completedLevels: subjectProgressMap[s.id]?.completedLevels ?? 0,
                totalLevels: subjectProgressMap[s.id]?.totalLevels ?? 12,
                progressPercent: subjectProgressMap[s.id]?.progressPercent ?? 0,
                accuracy: subjectProgressMap[s.id]?.accuracy ?? 0,
            }))}
            userStats={userStats}
            termName={termName}
            batch={batch ?? ""}
        />
    );
}

