import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ConceptBuilderClient from "./ConceptBuilderClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ConceptBuilderPage({
    params,
}: {
    params: Promise<{ subjectId: string }>;
}) {
    const { subjectId } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch subject (need module_count for module list)
    const { data: subject } = await supabase
        .from("subjects")
        .select("id, name, code, module_count")
        .eq("id", subjectId)
        .single();

    if (!subject) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <h1 className="text-5xl font-black text-on-surface/10 mb-4">404</h1>
                <p className="text-on-surface-variant">Subject not found.</p>
                <Link href="/quiz" className="mt-6 text-primary flex items-center gap-1 font-bold">
                    <ChevronLeft className="w-4 h-4" /> Back to Quiz
                </Link>
            </div>
        );
    }

    // Fetch ONLY concept builder questions (is_concept_builder = true)
    // This keeps them completely separate from practice questions
    const { data: allQuestions, error: qError } = await supabase
        .from("questions")
        .select("id, question, options, correct_index, explanation, difficulty, module_from, module_to, type")
        .eq("subject_id", subjectId)
        .eq("input_type", "mcq")
        .eq("is_concept_builder", true)
        .order("module_from", { ascending: true });

    const questions = (qError ? [] : (allQuestions ?? [])) as any[];

    // Build module structure — one entry per module number
    const moduleCount = subject.module_count as number;
    const modules = Array.from({ length: moduleCount }, (_, i) => {
        const modNum = i + 1;
        // A question belongs to this module if module_from <= modNum <= module_to
        const modQuestions = questions.filter(
            (q) => q.module_from <= modNum && q.module_to >= modNum
        );
        return {
            number: modNum,
            title: `Module ${modNum}`,
            // Bucket by difficulty
            easy:   modQuestions.filter(q => q.difficulty === "easy"   || !q.difficulty),
            medium: modQuestions.filter(q => q.difficulty === "medium"),
            hard:   modQuestions.filter(q => q.difficulty === "hard"),
        };
    });

    // Fetch per-module progress for this user
    let progressMap: Record<string, any> = {};
    try {
        const { data: progressRows } = await supabase
            .from("concept_builder_progress")
            .select("module_number, difficulty, completed, best_score, attempts")
            .eq("user_id", user.id)
            .eq("subject_id", subjectId);

        (progressRows ?? []).forEach((p) => {
            // Key: "module-difficulty", e.g. "1-easy", "2-medium"
            progressMap[`${p.module_number}-${p.difficulty}`] = p;
        });
    } catch {
        progressMap = {};
    }

    return (
        <ConceptBuilderClient
            subject={{ id: subject.id, name: subject.name, code: subject.code }}
            modules={modules}
            progress={progressMap}
            userId={user.id}
            migrationPending={!!qError}
        />
    );
}
