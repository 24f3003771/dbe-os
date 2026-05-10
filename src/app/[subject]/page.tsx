import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import SubjectQuizClient from "./SubjectQuizClient";
import type { Question } from "@/data/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Map Supabase question → QuizEngine Question shape
function mapQuestion(q: any): Question {
    return {
        id: q.id,
        text: q.question,
        options: q.options ?? ["(no options)"],
        correctAnswer: q.correct_index ?? 0,
        explanation: q.explanation ?? "",
        type: q.type,
        quiz_set_id: q.quiz_set_id,
        batch: q.batch ?? null,
        input_type: q.input_type,
        word_limit: q.word_limit,
        module_from: q.module_from,
        module_to: q.module_to,
    };
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
    const { subject: subjectId } = await params;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch subject
    const { data: subject } = await supabase
        .from("subjects")
        .select("id, name, code, module_count, strict_time_limit, calculator_enabled, negative_marking, neg_marking_value")
        .eq("id", subjectId)
        .single();

    if (!subject) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
                <h1 className="text-7xl font-black text-white/5 mb-4 tracking-tighter">404</h1>
                <p className="text-gray-400 text-lg">
                    Subject <span className="text-white font-mono">{subjectId}</span> not found.
                </p>
                <Link href="/quiz" className="mt-8 text-indigo-400 hover:text-indigo-300 flex items-center font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Return to Simulator
                </Link>
            </div>
        );
    }

    // Fetch all questions for this subject
    const { data: rawQuestions } = await supabase
        .from("questions")
        .select("*")
        .eq("subject_id", subjectId)
        .order("module_from", { ascending: true });

    const { data: quizSetsData } = await supabase
        .from("quiz_sets")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: false });

    const questions = rawQuestions ?? [];
    const quizSets = quizSetsData ?? [];

    // Group questions into modules by module_from
    const moduleCount = subject.module_count as number;
    const modules = Array.from({ length: moduleCount }, (_, i) => {
        const modNum = i + 1;
        const modQuestions = questions
            .filter((q: any) => q.module_from <= modNum && q.module_to >= modNum)
            .map(mapQuestion);
        return {
            id: modNum,
            title: `Module ${modNum}`,
            questions: modQuestions,
        };
    });

    const data = {
        id: subject.code,
        subjectId: subject.id,
        title: subject.name,
        strictTimeLimit: subject.strict_time_limit,
        calculatorEnabled: subject.calculator_enabled ?? false,
        negativeMarking: subject.negative_marking ?? false,
        negMarkingValue: subject.neg_marking_value ?? "1/3",
        modules,
        quizSets,
    };

    return <SubjectQuizClient data={data} />;
}
