import React from "react";
import { Check, X, Clock, Target, Eye, RotateCcw, CheckCircle2 } from "lucide-react";
import { QuestionResponse } from "@/actions/quiz";

interface ExamAnalysisViewProps {
    record: any; // The exam_result object from the database
    subjectTitle?: string;
    quizSets?: { id: string; name: string }[];
    onClose: () => void;
}

export default function ExamAnalysisView({ record, subjectTitle, quizSets, onClose }: ExamAnalysisViewProps) {
    const rawResponses = record.responses;
    const responses: QuestionResponse[] = Array.isArray(rawResponses) ? rawResponses : [];
    const score = record.score;
    const totalQuestions = record.total_questions;
    const percentage = Math.round((score / totalQuestions) * 100);
    const totalTimeSpent = record.total_time_taken;
    const tomatoesEarned = record.tomatoes_earned;

    // Calculate mistakes based on actual logic in QuizEngine
    // In QuizEngine, it maps over all questions. Even correct ones are in the 'mistakes' array 
    // but filtered visually or shown with green borders.
    const mistakes = responses.map((r, i) => ({
        id: i + 1,
        text: r.questionText,
        isText: r.inputType === "text",
        your: r.inputType === "text" ? (r.writtenAnswer || "No Answer") : (r.selectedAnswer || "No Answer"),
        correct: r.inputType === "text" ? (r.explanation || "See model answer") : r.correctAnswer,
        explanation: r.inputType === "text" ? r.ai_feedback : r.explanation,
        isCorrect: r.inputType === "text" ? null : r.isCorrect,
        aiGrade: r.inputType === "text" ? r.ai_grade : null,
        timeTaken: r.timeTaken || 0,
    }));

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Recalculate incorrect count (for MCQ only here, or simply total - raw score if we want an estimate)
    // Actually, record.mistakes might be an array we can just count.
    let mistakesCount = 0;
    try {
        if (record.mistakes && typeof record.mistakes === "string") {
            const parsed = JSON.parse(record.mistakes);
            mistakesCount = Array.isArray(parsed) ? parsed.length : 0;
        }
    } catch {
        // Fallback
        mistakesCount = totalQuestions - score; // Rough estimate
    }

    return (
        <div className="fixed inset-0 z-[70] bg-surface flex flex-col animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
                {/* Summary Card */}
                <div className="bg-surface-container rounded-[2.5rem] p-8 text-center border-4 border-primary/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-primary text-on-primary text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">Historical Analysis</span>
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                            <Eye className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                        <div className="mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{subjectTitle || record.subject}</span>
                            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tighter italic leading-none mt-1">
                                {quizSets?.find(s => s.id === record.quiz_set_id)?.name || "Exam Mode Review"}
                            </h2>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-[10px] font-black">
                                <Clock className="w-3.5 h-3.5 text-primary" /> {formatTime(totalTimeSpent)}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10 text-[10px] font-black">
                                <Target className="w-3.5 h-3.5 text-amber-500" /> {totalQuestions} Q
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-500/5 rounded-full border border-stone-500/10 text-[10px] font-black">
                                {new Date(record.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                <p className="text-xl font-black text-green-500 leading-none">{score}</p>
                                <p className="text-[7px] font-black uppercase tracking-widest mt-1">Score</p>
                            </div>
                            <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                <p className="text-xl font-black text-error leading-none">{mistakesCount}</p>
                                <p className="text-[7px] font-black uppercase tracking-widest mt-1">Mistakes</p>
                            </div>
                            <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                <p className="text-xl font-black text-primary leading-none">{percentage}%</p>
                                <p className="text-[7px] font-black uppercase tracking-widest mt-1">Accuracy</p>
                            </div>
                        </div>

                        <div className="bg-surface-container-highest/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border-2 border-outline-variant/10 mb-4">
                            <p className="text-[8px] text-secondary font-black uppercase tracking-[0.3em] leading-none">Scholar Harvest</p>
                            <div className="text-3xl font-black font-headline text-secondary tracking-tighter flex items-center gap-2">
                                 <span className="text-xl opacity-50">+</span>{tomatoesEarned} 🍅
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onClose} className="w-full py-3 bg-primary text-on-primary font-black text-sm rounded-xl shadow-lg shadow-primary/10 uppercase tracking-widest">
                                Close Analysis
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detailed Solutions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black font-headline text-on-surface tracking-tighter italic">Detailed Review</h3>
                        <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-3 py-1 rounded-full">
                            {totalQuestions} items
                        </span>
                    </div>
                    
                    <div className="space-y-4 pb-12">
                        {mistakes.length === 0 ? (
                            <div className="pt-10 flex flex-col items-center justify-center text-center opacity-40">
                                <p className="text-lg font-black uppercase tracking-widest">No detailed responses found.</p>
                            </div>
                        ) : (
                            mistakes.map((m) => (
                                <div key={m.id} className={`p-6 rounded-[2rem] border-2 relative overflow-hidden bg-surface-container shadow-sm ${m.isCorrect === true ? "border-green-500/10" : m.isCorrect === false ? "border-error/10" : "border-primary/10"}`}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${m.isCorrect === true ? "bg-green-500 text-white" : m.isCorrect === false ? "bg-error text-white" : "bg-primary/20 text-primary"}`}>
                                            {m.id}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                                <p className="text-base font-bold text-on-surface leading-snug tracking-tight">{m.text}</p>
                                                <div className="flex items-center gap-1 shrink-0 text-[10px] font-black text-primary/70 bg-primary/5 border border-primary/10 px-2 py-1 rounded-lg w-fit">
                                                    <Clock className="w-3 h-3" /> {m.timeTaken}s
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 mb-4">
                                        {/* MCQ: show selected wrong answer */}
                                        {m.isCorrect === false && (
                                            <div className="p-4 rounded-xl bg-error/5 border border-error/10 text-error">
                                                <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Your Incorrect Response</p>
                                                <p className="text-xs font-bold italic">{m.your}</p>
                                            </div>
                                        )}
                                        {/* MCQ: show correct but selected answer */}
                                        {m.isCorrect === true && !m.isText && (
                                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-green-700">
                                                <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Your Correct Response</p>
                                                <p className="text-xs font-bold italic">{m.your}</p>
                                            </div>
                                        )}
                                        {/* Text: show written answer */}
                                        {m.isText && (
                                            <div className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/20">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Your Written Answer</p>
                                                    {m.aiGrade !== null && (
                                                        <span className="text-[8px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">AI Grade: {m.aiGrade}%</span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium italic text-on-surface-variant">{m.your}</p>
                                            </div>
                                        )}
                                        {/* MCQ: show correct option (if they got it wrong) | Text: show model answer */}
                                        {(!m.isCorrect || m.isText) && (
                                            <div className={`p-4 rounded-xl ${m.isText ? "bg-primary/5 border border-primary/10 text-primary" : "bg-green-500/5 border border-green-500/20 text-green-700"}`}>
                                                <p className={`text-[7px] font-black uppercase tracking-widest mb-1 ${m.isText ? "text-primary/60" : "text-green-600/60"}`}>{m.isText ? "Model Answer" : "Correct Solution"}</p>
                                                <p className="text-xs font-black">{m.correct}</p>
                                            </div>
                                        )}
                                    </div>

                                    {m.explanation && (
                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Eye className="w-3.5 h-3.5 text-primary" />
                                                <p className="text-[8px] font-black uppercase tracking-widest text-primary">{m.isText ? "AI Feedback" : "Scholar's Explanation"}</p>
                                            </div>
                                            <p className="text-[12px] font-medium text-on-surface-variant leading-relaxed italic">{m.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
