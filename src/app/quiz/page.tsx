import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import QuizDashboard from "./QuizDashboard";

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

    // Fetch question counts per subject
    const subjectIds = subjects.map((s) => s.id);
    let questionCounts: Record<string, number> = {};

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
    }

    return (
        <QuizDashboard
            subjects={subjects.map((s) => ({ ...s, questionCount: questionCounts[s.id] ?? 0 }))}
            termName={termName}
            batch={batch ?? ""}
        />
    );
}
