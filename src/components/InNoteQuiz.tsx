"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Save, Loader2, RotateCcw } from "lucide-react";
import { saveExamResult } from "@/actions/quiz";
import { recordTomatoEvent } from "@/actions/farm";
import { markModuleComplete } from "@/actions/progress";

type QuizQuestion = {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export default function InNoteQuiz({ 
    questions, 
    subjectId,
    moduleId,
    isAlreadyCompleted,
    onComplete
}: { 
    questions: QuizQuestion[];
    subjectId: string;
    moduleId: string | number;
    isAlreadyCompleted?: boolean;
    onComplete?: () => void;
}) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    const storageKey = `dbe-quiz-${subjectId}-${moduleId}`;

    React.useEffect(() => {

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.answers) setSelectedAnswers(parsed.answers);
                if (parsed.isSubmitted) {
                    setIsSubmitted(true);
                    setSaveStatus("saved");
                }
            } catch (e) {}
        }
    }, [storageKey, isAlreadyCompleted]);

    const handleSelect = (qIndex: number, optIndex: number) => {
        if (isSubmitted || selectedAnswers[qIndex] !== undefined) return;
        setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    };

    const handleSubmit = async () => {
        setIsSubmitted(true);
        setIsSaving(true);
        
        let score = 0;
        const responses: any[] = questions.map((q, i) => {
            const selectedIndex = selectedAnswers[i] ?? null;
            const isCorrect = selectedIndex === q.correctIndex;
            if (isCorrect) score++;
            
            return {
                inputType: "mcq",
                questionId: `note-quiz-${Date.now()}-${i}`,
                questionText: q.question,
                options: q.options,
                selectedIndex,
                selectedAnswer: selectedIndex !== null ? q.options[selectedIndex] : null,
                correctIndex: q.correctIndex,
                correctAnswer: q.options[q.correctIndex],
                isCorrect,
                timeTaken: 10, // approximate
                explanation: q.explanation,
            };
        });

        const totalTomatoes = score * 5;

        try {
            await saveExamResult({
                subject: subjectId,
                score,
                totalQuestions: questions.length,
                timerPerQuestion: 10,
                totalTimeTaken: questions.length * 10,
                responses,
                tomatoesEarned: totalTomatoes
            });
            
            if (totalTomatoes > 0) {
                await recordTomatoEvent({
                    actionType: "notes_quiz",
                    description: `Completed Notes Knowledge Check for ${subjectId}`,
                    tomatoes: totalTomatoes,
                });
            }

            if (typeof moduleId === 'number') {
                await markModuleComplete(subjectId, moduleId);
            } else if (moduleId === 'formula-sheet') {
                await markModuleComplete(subjectId, 98);
            } else if (moduleId === 'mind-maps') {
                await markModuleComplete(subjectId, 99);
            }
            
            setSaveStatus("saved");
            localStorage.setItem(storageKey, JSON.stringify({ answers: selectedAnswers, isSubmitted: true }));
            if (onComplete) onComplete();
        } catch (error) {
            console.error(error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        setSelectedAnswers({});
        setIsSubmitted(false);
        setSaveStatus("idle");
        localStorage.removeItem(storageKey);
    };

    const allAnswered = Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="my-10 border border-stone-200 p-8 rounded-3xl bg-white shadow-sm font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <h2 className="text-2xl font-black mb-8 text-stone-900 flex items-center gap-3">
                <span className="bg-indigo-50 text-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">🧠</span> 
                Quick Knowledge Check
            </h2>
            
            <div className="space-y-6">
                {questions.map((q, i) => {
                    const selected = selectedAnswers[i];
                    const isCorrect = selected === q.correctIndex;
                    
                    return (
                        <div key={i} className="bg-stone-50/50 p-6 rounded-2xl border border-stone-100 transition-all hover:border-stone-200">
                            <p className="font-bold text-stone-800 mb-4 text-base leading-relaxed">
                                <span className="text-indigo-500 font-black mr-2">Q{i + 1}.</span> {q.question}
                            </p>
                            <div className="space-y-2.5">
                                {q.options.map((opt, j) => {
                                    const isThisSelected = selected === j;
                                    const isThisCorrect = j === q.correctIndex;
                                    
                                    let btnClass = "w-full text-left p-3.5 rounded-xl border transition-all whitespace-normal break-words text-sm font-medium flex items-center justify-between gap-3 ";
                                    
                                    if (isSubmitted) {
                                        if (isThisCorrect) {
                                            btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-500/20";
                                        } else if (isThisSelected && !isThisCorrect) {
                                            btnClass += "bg-red-50 border-red-200 text-red-800";
                                        } else {
                                            btnClass += "bg-white border-stone-200 opacity-50";
                                        }
                                    } else {
                                        if (isThisSelected) {
                                            btnClass += "bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-2 ring-indigo-600/20";
                                        } else {
                                            btnClass += "bg-white border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-stone-600 hover:text-stone-900";
                                        }
                                    }
                                    
                                    return (
                                        <button 
                                            key={j} 
                                            onClick={() => handleSelect(i, j)}
                                            disabled={isSubmitted || selectedAnswers[i] !== undefined}
                                            className={btnClass}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isThisSelected && !isSubmitted ? 'border-white' : isSubmitted && isThisCorrect ? 'border-emerald-500' : isSubmitted && isThisSelected ? 'border-red-500' : 'border-stone-300'}`}>
                                                    {isThisSelected && !isSubmitted && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                                <span>{opt}</span>
                                            </div>
                                            {isSubmitted && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                            {isSubmitted && isThisSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {isSubmitted && (
                                <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3 ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />}
                                    <p className="text-sm">
                                        <strong className={isCorrect ? 'text-emerald-700 block mb-1' : 'text-red-700 block mb-1'}>
                                            {isCorrect ? 'Correct!' : 'Incorrect.'}
                                        </strong>
                                        <span className="text-stone-600 leading-relaxed">{q.explanation}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-10 text-center pt-6 border-t border-stone-100">
                {!isSubmitted ? (
                    <button 
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`px-8 py-3.5 rounded-2xl font-black tracking-wide text-sm uppercase transition-all shadow-sm flex items-center gap-2 mx-auto ${allAnswered ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md hover:scale-[1.02]' : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Check Answers & Save
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl font-bold">
                            {isSaving ? (
                                <span className="text-emerald-600 animate-pulse flex items-center gap-2 text-sm uppercase tracking-widest"><Loader2 className="w-4 h-4 animate-spin" /> Saving progress...</span>
                            ) : saveStatus === "saved" ? (
                                <span className="text-emerald-700 flex items-center gap-2 text-sm">
                                    <Save className="w-4 h-4" /> Progress Saved! 
                                    {Object.entries(selectedAnswers).filter(([qIdx, ans]) => ans === questions[Number(qIdx)]?.correctIndex).length > 0 && 
                                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black ml-2 flex items-center gap-1.5">
                                            🍅 +{Object.entries(selectedAnswers).filter(([qIdx, ans]) => ans === questions[Number(qIdx)]?.correctIndex).length * 5} Tomatoes
                                        </span>
                                    }
                                </span>
                            ) : saveStatus === "error" ? (
                                <span className="text-red-600 flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save progress</span>
                            ) : (
                                <span className="text-emerald-700 flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                            )}
                        </div>
                        <button 
                            onClick={handleClear}
                            className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-bold flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
