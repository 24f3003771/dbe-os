"use client";

import React, { useState } from "react";
import { getSubjectById, getNotesLink } from "@/data/db";
import { BookOpen, Activity, Play, ChevronLeft, CheckCircle2, Timer, Target, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import QuizEngine from "@/components/QuizEngine";

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
    const { subject } = React.use(params);
    const data = getSubjectById(subject);
    const [activeTab, setActiveTab] = useState<"overview" | "quiz">("overview");
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
    const [quizMode, setQuizMode] = useState<"practice" | "exam">("practice");
    const [showModeSelect, setShowModeSelect] = useState(false);
    const [pendingModuleId, setPendingModuleId] = useState<number | null>(null);
    
    // Mocks for simplified OS
    const isLoaded = true;
    const progress: any = {};
    const historyLoaded = false;
    const getModuleStats = (s:string, m:number) => ({ attempts: 0, bestAccuracy: 0, totalTimeSpent: 0 });
    const subjectProgress = { total: 0, completed: 0, percentage: 0 };

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
                <h1 className="text-7xl font-black text-white/5 mb-4 tracking-tighter">404</h1>
                <p className="text-gray-400 text-lg">Subject <span className="text-white font-mono">{subject}</span> not found.</p>
                <Link href="/" className="mt-8 text-indigo-400 hover:text-indigo-300 flex items-center font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Return to Dashboard
                </Link>
            </div>
        );
    }

    const handleStartQuiz = (moduleId: number) => {
        setPendingModuleId(moduleId);
        setShowModeSelect(true);
    };

    const confirmMode = (mode: "practice" | "exam") => {
        setQuizMode(mode);
        setActiveModuleId(pendingModuleId);
        setActiveTab("quiz");
        setShowModeSelect(false);
    };

    const activeModule = data.modules.find((m) => m.id === activeModuleId);

    if (activeTab === "quiz" && activeModule) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1600px] mx-auto min-h-screen">
                <button
                    onClick={() => {
                        setActiveTab("overview");
                        setActiveModuleId(null);
                    }}
                    className="mb-6 flex items-center text-sm font-bold text-on-surface hover:text-primary transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Dashboard
                </button>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-400 font-mono text-xs font-bold tracking-widest uppercase">
                                {quizMode === "exam" ? "Exam Mode" : "Practice Mode"}
                            </span>
                            {quizMode === "exam" && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                    TIMED
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{activeModule.title}</h1>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-white/5 text-gray-300 text-sm font-medium border border-white/10 flex-shrink-0 w-fit">
                        {activeModule.questions.length} Questions
                    </span>
                </div>
                <QuizEngine
                    subjectId={subject}
                    moduleId={activeModule.id}
                    questions={activeModule.questions}
                    mode={quizMode}
                    onComplete={() => {
                        setActiveTab("overview");
                        setActiveModuleId(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-10">
            <Link href="/" className="flex items-center text-sm font-bold text-on-surface-variant hover:text-primary transition-colors w-fit">
                <ChevronLeft className="w-5 h-5 mr-1" /> Dashboard
            </Link>

            <header className="space-y-4 border-b border-white/5 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-xs tracking-widest font-bold rounded border border-primary/20 shadow-sm">
                                {data.id}
                            </span>
                            <span className="text-on-surface-variant font-mono text-sm">|</span>
                            <span className="text-on-surface-variant text-sm font-bold">{data.modules.length} Modules</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headline text-on-surface tracking-tight leading-tight pt-2">
                            {data.title || "Subject"}
                        </h1>
                    </div>
                    <a
                        href={getNotesLink(data.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl hover:bg-surface-container transition-all shadow-sm border border-outline-variant/20 group hover-lift"
                    >
                        <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Access Notes
                    </a>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-8">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Quiz Modules</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.modules.length === 0 ? (
                        <p className="text-gray-500 italic col-span-full border border-dashed border-white/10 p-10 rounded-2xl text-center">No quiz modules available for this subject.</p>
                    ) : (
                        data.modules.map((mod) => {
                            const isCompleted = isLoaded && progress[subject]?.[mod.id]?.completed;
                            const prevScore = progress[subject]?.[mod.id]?.score;
                            const stats = historyLoaded ? getModuleStats(subject, mod.id) : null;

                            return (
                                <div
                                    key={mod.id}
                                    className={`group p-5 rounded-2xl bg-[#0a0a0a] border hover:border-indigo-500/50 transition-all hover:bg-[#0f0f0f] flex flex-col cursor-pointer hover-lift shadow-lg shadow-transparent hover:shadow-indigo-500/5 ${isCompleted ? 'border-indigo-500/30' : 'border-white/5'}`}
                                    onClick={() => handleStartQuiz(mod.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug truncate">{mod.title}</h3>
                                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{mod.questions.length} Questions</p>
                                                {isCompleted && prevScore !== undefined && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                        Score: {prevScore}/{mod.questions.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 flex-shrink-0 ml-4 shadow-sm ${isCompleted ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-400 text-gray-400 group-hover:text-white'}`}>
                                            <Play className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>

                                    {/* Analytics row */}
                                    {stats && stats.attempts > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4 text-[11px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                {stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                Best: {stats.bestAccuracy}%
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {Math.round(stats.totalTimeSpent / 60)}m total
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Mode Selection Modal */}
            {showModeSelect && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-surface/70 backdrop-blur-sm" onClick={() => setShowModeSelect(false)} />
                    <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl border border-outline-variant/10 shadow-2xl p-8 animate-in zoom-in-95 fade-in duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">Choose Mode</h3>
                        <p className="text-gray-400 text-sm mb-6">Select how you&apos;d like to attempt this quiz.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => confirmMode("practice")}
                                className="w-full p-5 rounded-xl border border-white/10 hover:border-indigo-500/40 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left group"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <BookOpen className="w-5 h-5 text-indigo-400" />
                                    <span className="font-bold text-white">Practice Mode</span>
                                </div>
                                <p className="text-gray-500 text-sm ml-8">No timer. Take your time and learn.</p>
                            </button>

                            <button
                                onClick={() => confirmMode("exam")}
                                className="w-full p-5 rounded-xl border border-white/10 hover:border-amber-500/40 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left group"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <Timer className="w-5 h-5 text-amber-400" />
                                    <span className="font-bold text-white">Exam Mode</span>
                                </div>
                                <p className="text-gray-500 text-sm ml-8">60 seconds per question. Simulate the real exam.</p>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowModeSelect(false)}
                            className="mt-4 w-full py-2.5 text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
