"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Save } from "lucide-react";
import { saveExamResult } from "@/actions/quiz";
import { recordTomatoEvent } from "@/actions/farm";

type QuizQuestion = {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export default function InNoteQuiz({ 
    questions, 
    subjectId 
}: { 
    questions: QuizQuestion[];
    subjectId: string;
}) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    const handleSelect = (qIndex: number, optIndex: number) => {
        if (isSubmitted) return;
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
                responses
            });
            
            if (totalTomatoes > 0) {
                await recordTomatoEvent({
                    actionType: "notes_quiz",
                    description: `Completed Notes Knowledge Check for ${subjectId}`,
                    tomatoes: totalTomatoes,
                });
            }
            
            setSaveStatus("saved");
        } catch (error) {
            console.error(error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const allAnswered = Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="my-8 border-2 border-dashed border-[#34495e] p-6 rounded-2xl bg-[#f8f9f9] text-[#2c3e50] shadow-sm font-sans">
            <h2 className="text-xl font-bold text-center mb-6 text-[#2c3e50] flex items-center justify-center gap-2">
                <span>🧠</span> Quick Knowledge Check
            </h2>
            
            <div className="space-y-6">
                {questions.map((q, i) => {
                    const selected = selectedAnswers[i];
                    const isCorrect = selected === q.correctIndex;
                    
                    return (
                        <div key={i} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                            <p className="font-bold text-[#2980b9] mb-3">Q{i + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((opt, j) => {
                                    const isThisSelected = selected === j;
                                    const isThisCorrect = j === q.correctIndex;
                                    
                                    let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                                    
                                    if (isSubmitted) {
                                        if (isThisCorrect) {
                                            btnClass += "bg-green-50 border-green-500 text-green-800 font-bold";
                                        } else if (isThisSelected && !isThisCorrect) {
                                            btnClass += "bg-red-50 border-red-500 text-red-800";
                                        } else {
                                            btnClass += "bg-stone-50 border-stone-200 opacity-60";
                                        }
                                    } else {
                                        if (isThisSelected) {
                                            btnClass += "bg-[#2980b9] border-[#2980b9] text-white font-bold shadow-md";
                                        } else {
                                            btnClass += "bg-white border-stone-200 hover:border-[#2980b9] hover:bg-blue-50";
                                        }
                                    }
                                    
                                    return (
                                        <button 
                                            key={j} 
                                            onClick={() => handleSelect(i, j)}
                                            disabled={isSubmitted}
                                            className={btnClass}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {isSubmitted && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                                {isSubmitted && isThisSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {isSubmitted && (
                                <div className={`mt-4 p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <p className="text-sm">
                                        <strong className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                            {isCorrect ? '✅ Correct! ' : '❌ Incorrect. '}
                                        </strong>
                                        <span className="text-stone-700">{q.explanation}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 text-center">
                {!isSubmitted ? (
                    <button 
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-md ${allAnswered ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-white hover:scale-105' : 'bg-stone-300 text-stone-500 cursor-not-allowed'}`}
                    >
                        Check Answers & Save Progress
                    </button>
                ) : (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-xl font-bold">
                        {isSaving ? (
                            <span className="text-stone-500 animate-pulse flex items-center gap-2">Saving progress...</span>
                        ) : saveStatus === "saved" ? (
                            <span className="text-green-600 flex items-center gap-2">
                                <Save className="w-5 h-5" /> Progress Saved! 
                                {Object.values(selectedAnswers).filter((ans, idx) => ans === questions[idx].correctIndex).length > 0 && 
                                    <span className="text-[#e74c3c] ml-2 font-black">🍅 +{Object.values(selectedAnswers).filter((ans, idx) => ans === questions[idx].correctIndex).length * 5} Tomatoes!</span>
                                }
                            </span>
                        ) : saveStatus === "error" ? (
                            <span className="text-red-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Failed to save progress</span>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
