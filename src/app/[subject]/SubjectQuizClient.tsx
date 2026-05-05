"use client";

import React, { useState, useEffect } from "react";
import type { Question } from "@/data/db";
import { BookOpen, Activity, Play, ChevronLeft, Timer, Target, History, Trash2, Calendar, Sparkles, Eye } from "lucide-react";
import Link from "next/link";
import QuizEngine from "@/components/QuizEngine";
import ExamAnalysisView from "@/components/ExamAnalysisView";
import { getExamHistory, deleteExamResult } from "@/actions/quiz";
import LoadingScreen from "@/components/LoadingScreen";

type Module = { id: number; title: string; questions: Question[] };
type SubjectData = {
    id: string;          // subject code e.g. "ES21X"
    subjectId: string;   // supabase UUID
    title: string;
    strictTimeLimit: number | null; // Total minutes
    calculatorEnabled: boolean;
    negativeMarking: boolean;
    negMarkingValue: string;
    modules: Module[];
    quizSets: { id: string; name: string }[];
};

export default function SubjectQuizClient({ data }: { data: SubjectData }) {
    const [activeTab, setActiveTab] = useState<"overview" | "quiz" | "history">("overview");
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
    const [quizMode, setQuizMode] = useState<"practice" | "exam">("practice");
    const [quizSubMode, setQuizSubMode] = useState<"practice" | "ai" | "exam-set">("practice");
    const [activeQuizSetId, setActiveQuizSetId] = useState<string | null>(null);

    // Module-level mode modal (Practice / AI only)
    const [showModeSelect, setShowModeSelect] = useState(false);
    const [pendingModuleId, setPendingModuleId] = useState<number | null>(null);
    const [examTimer, setExamTimer] = useState<number | undefined>(undefined);
    const [emptyMessageModuleId, setEmptyMessageModuleId] = useState<number | null>(null);
    const [resultToAnalyze, setResultToAnalyze] = useState<any | null>(null);

    // Subject-level exam set picker
    const [showExamSetPicker, setShowExamSetPicker] = useState(false);

    const [examHistory, setExamHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoadingHistory(true);
        try {
            const history = await getExamHistory();
            setExamHistory(history.filter((h: any) => h.subject === data.id));
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleDeleteRecord = async (id: string) => {
        if (!confirm("Are you sure you want to delete this result?")) return;
        try {
            await deleteExamResult(id);
            loadHistory();
        } catch {
            alert("Failed to delete record.");
        }
    };

    // Module click → only Practice/AI modal
    const handleStartQuiz = (moduleId: number) => {
        const selectedModule = data.modules.find((m) => m.id === moduleId);
        if (selectedModule && selectedModule.questions.filter(q => q.type !== "exam").length === 0) {
            setEmptyMessageModuleId(moduleId);
            setTimeout(() => setEmptyMessageModuleId(null), 3000);
            return;
        }
        setPendingModuleId(moduleId);
        setShowModeSelect(true);
    };

    // Practice / AI mode confirmation (module-scoped)
    const confirmPracticeMode = (subMode: "practice" | "ai") => {
        setQuizSubMode(subMode);
        setQuizMode("practice");
        setExamTimer(undefined);
        setActiveQuizSetId(null);
        setActiveModuleId(pendingModuleId);
        setActiveTab("quiz");
        setShowModeSelect(false);
    };

    // Exam set selected (subject-scoped, all modules)
    const confirmExamSet = (setId: string) => {
        setQuizSubMode("exam-set");
        setQuizMode("exam");
        setExamTimer(data.strictTimeLimit ? data.strictTimeLimit * 60 : 60 * 30); // minutes to seconds
        setActiveQuizSetId(setId);
        setActiveModuleId(null); // Not module-scoped
        setActiveTab("quiz");
        setShowExamSetPicker(false);
    };

    // All questions from the selected exam set across all modules
    // Deduplicate by id — a question with module_from:1 module_to:4 appears in 4 modules
    const allExamSetQuestions = activeQuizSetId
        ? Array.from(
            new Map(
                data.modules
                    .flatMap((m) => m.questions.filter((q) => q.type === "exam" && q.quiz_set_id === activeQuizSetId))
                    .map((q) => [q.id, q])
            ).values()
          )
        : [];

    const activeModule = data.modules.find((m) => m.id === activeModuleId);

    // Sets that have at least one question anywhere in the subject
    const setsWithQuestions = data.quizSets.filter((set) =>
        data.modules.some((m) => m.questions.some((q) => q.type === "exam" && q.quiz_set_id === set.id))
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Exam Analysis Modal */}
            {resultToAnalyze && (
                <div className="fixed inset-0 z-[300] bg-surface overflow-y-auto">
                    <ExamAnalysisView 
                        record={resultToAnalyze} 
                        subjectTitle={data.title}
                        quizSets={data.quizSets}
                        onClose={() => setResultToAnalyze(null)} 
                    />
                </div>
            )}

            {/* Quiz view — module practice/ai */}
            {activeTab === "quiz" && quizSubMode !== "exam-set" && activeModule && (
                <div className="fixed inset-0 z-[200] bg-surface flex flex-col p-4 animate-in fade-in duration-300">
                    <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-indigo-400 font-mono text-xs font-bold tracking-widest uppercase block mb-1">
                                    {quizSubMode === "ai" ? "AI Concept Builder" : "Practice Mode"}
                                </span>
                                <h1 className="text-2xl font-bold text-on-surface tracking-tight">{activeModule.title}</h1>
                            </div>
                        </div>
                        <QuizEngine
                            subjectId={data.id}
                            subjectTitle={data.title}
                            moduleId={activeModule.id}
                            moduleTitle={activeModule.title}
                            quizSubMode={quizSubMode}
                            questions={
                                quizSubMode === "ai"
                                    ? activeModule.questions.filter((q) => q.type === "practice")
                                    : activeModule.questions.filter((q) => q.type !== "exam" && q.type !== "practice")
                            }
                            mode="practice"
                            showCalculator={data.calculatorEnabled}
                            negativeMarking={false}
                            examDurationSeconds={undefined}
                            onComplete={() => {
                                setActiveTab("overview");
                                setActiveModuleId(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Quiz view — exam set (subject-scoped, all modules) */}
            {activeTab === "quiz" && quizSubMode === "exam-set" && activeQuizSetId && (
                <div className="fixed inset-0 z-[200] bg-surface flex flex-col p-4 animate-in fade-in duration-300">
                    <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-amber-400 font-mono text-xs font-bold tracking-widest uppercase">
                                        Exam Mode
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                        {data.strictTimeLimit}m TIMED
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                                    {data.quizSets.find((s) => s.id === activeQuizSetId)?.name ?? "Exam"}
                                </h1>
                                <p className="text-xs text-on-surface-variant font-medium mt-1">{allExamSetQuestions.length} questions · Full subject scope</p>
                            </div>
                        </div>
                        <QuizEngine
                            subjectId={data.id}
                            subjectTitle={data.title}
                            moduleId={0}
                            quizSetId={activeQuizSetId || undefined}
                            quizSubMode="exam-set"
                            questions={allExamSetQuestions}
                            mode="exam"
                            showCalculator={data.calculatorEnabled}
                            negativeMarking={data.negativeMarking}
                            negMarkingValue={data.negMarkingValue}
                            examDurationSeconds={examTimer}
                            onComplete={() => {
                                loadHistory(); // Refresh locks immediately
                                setActiveTab("overview");
                                setActiveQuizSetId(null);
                            }}
                        />
                    </div>
                </div>
            )}

            <Link href="/quiz" className="flex items-center text-sm font-bold text-on-surface-variant hover:text-primary transition-colors w-fit">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Subjects
            </Link>

            <header className="space-y-4 border-b border-outline-variant/10 pb-10">
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
                            {data.title}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab(activeTab === "history" ? "overview" : "history")}
                            className={`flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl transition-all shadow-sm border group hover-lift ${activeTab === "history" ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest text-on-surface border-outline-variant/20 hover:bg-surface-container"}`}
                        >
                            <History className="w-5 h-5 group-hover:rotate-[-20deg] transition-transform" />
                            {activeTab === "history" ? "Back to Modules" : "Performance Review"}
                        </button>

                        {/* Subject-level Exam Mode button — only if sets exist */}
                        {setsWithQuestions.length > 0 && (
                            <button
                                onClick={() => setShowExamSetPicker(true)}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-sm border border-amber-600/30 group hover-lift"
                            >
                                <Timer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Exam Mode
                            </button>
                        )}

                        <Link
                            href={`/dbe_notes/${data.subjectId}`}
                            className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl hover:bg-surface-container transition-all shadow-sm border border-outline-variant/20 group hover-lift"
                        >
                            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Access Notes
                        </Link>
                    </div>
                </div>
            </header>

            {activeTab === "history" ? (
                <section className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3">
                        <History className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">Exam History</h2>
                    </div>

                    {loadingHistory ? (
                        <LoadingScreen message="Fetching history..." type="list" fullScreen={false} />
                    ) : examHistory.length === 0 ? (
                        <div className="bg-surface-container rounded-[2rem] p-16 text-center border-2 border-dashed border-outline-variant/20">
                            <Target className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-on-surface mb-2">No Exam Records</h3>
                            <p className="text-on-surface-variant max-w-xs mx-auto">Complete an Exam Mode session to see your performance metrics here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                                {examHistory.map((record) => {
                                    if (!record) return null;
                                    let mistakesCount = 0;
                                    try {
                                        // Extremely defensive parsing
                                        let rawMistakes = record.mistakes;
                                        if (typeof rawMistakes === 'string' && rawMistakes.trim()) {
                                            try { rawMistakes = JSON.parse(rawMistakes); } catch { rawMistakes = null; }
                                        }
                                        
                                        if (Array.isArray(rawMistakes)) {
                                            mistakesCount = rawMistakes.length;
                                        } else {
                                            let rawRes = record.responses;
                                            if (typeof rawRes === 'string' && rawRes.trim()) {
                                                try { rawRes = JSON.parse(rawRes); } catch { rawRes = null; }
                                            }
                                            if (Array.isArray(rawRes)) {
                                                mistakesCount = rawRes.filter((r: any) => {
                                                    if (r.inputType === "mcq") return !r.isCorrect;
                                                    if (r.inputType === "text") return (r.ai_grade ?? 100) < 100;
                                                    return false;
                                                }).length;
                                            }
                                        }
                                    } catch (e) {
                                        mistakesCount = 0;
                                    }
                                    
                                    const score = Number(record.score) || 0;
                                    const totalQ = Number(record.total_questions) || 0;
                                    const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
                                    const setName = data.quizSets?.find(s => s.id === record.quiz_set_id)?.name || "Simulator Run";
                                    
                                    return (
                                        <div 
                                            key={record.id} 
                                            onClick={() => setResultToAnalyze(record)}
                                            className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all cursor-pointer group/card"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-amber-500" : "bg-error"}`}>
                                                            {percentage}%
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-on-surface font-headline uppercase tracking-tight group-hover/card:text-primary transition-colors">{setName}</p>
                                                            <p className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">
                                                                <Calendar className="w-3 h-3" /> {record.created_at ? new Date(record.created_at).toLocaleDateString() : 'Unknown Date'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="bg-surface p-3 rounded-xl border border-outline-variant/10 min-w-[100px]">
                                                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Score</p>
                                                            <p className="text-lg font-black text-on-surface">{score} / {totalQ}</p>
                                                        </div>
                                                        <div className="bg-surface p-3 rounded-xl border border-outline-variant/10 min-w-[100px]">
                                                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Timer</p>
                                                            <p className="text-lg font-black text-on-surface">{record.timer_per_question || 0}s/Q</p>
                                                        </div>
                                                        <div className="bg-surface p-3 rounded-xl border border-outline-variant/10 min-w-[100px]">
                                                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Mistakes</p>
                                                            <p className="text-lg font-black text-error">{mistakesCount}</p>
                                                        </div>
                                                        <div className="bg-surface p-3 rounded-xl border border-outline-variant/10 min-w-[100px]">
                                                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">🍅 Earned</p>
                                                            <p className="text-lg font-black text-secondary">{record.tomatoes_earned ?? 0}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row md:flex-col justify-end">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setResultToAnalyze(record);
                                                        }}
                                                        className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 flex items-center justify-center group-hover/card:scale-110 shadow-sm"
                                                        title="Analyse Performance"
                                                    >
                                                        <Eye className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </section>
            ) : (
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Practice Modules</h2>
                        <span className="text-xs font-black text-on-surface-variant/50 uppercase tracking-widest ml-2">· Practice & AI only</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.modules.length === 0 ? (
                            <p className="text-on-surface-variant italic col-span-full border border-dashed border-outline-variant/30 p-10 rounded-2xl text-center font-medium">
                                No quiz modules available for this subject.
                            </p>
                        ) : (
                            data.modules.map((mod) => {
                                const practiceCount = mod.questions.filter(q => q.type !== "exam").length;
                                return (
                                    <div
                                        key={mod.id}
                                        className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 hover:border-primary/50 transition-all hover:bg-surface-container flex flex-col cursor-pointer hover-lift shadow-sm hover:shadow-xl hover:shadow-primary/5"
                                        onClick={() => handleStartQuiz(mod.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors leading-snug truncate">{mod.title}</h3>
                                                {emptyMessageModuleId === mod.id ? (
                                                    <p className="text-xs text-amber-500 font-bold tracking-wider mt-1 animate-in fade-in slide-in-from-top-1 duration-300">Wait, questions will be available soon</p>
                                                ) : (
                                                    <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mt-1">{practiceCount} Questions</p>
                                                )}
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform flex-shrink-0 ml-4 shadow-sm border ${practiceCount === 0 ? "bg-surface-container-highest border-outline-variant/10 text-on-surface-variant/30" : "bg-surface-container-highest border-outline-variant/10 text-on-surface-variant group-hover:scale-110 group-hover:bg-primary group-hover:border-primary/20 group-hover:text-on-primary"}`}>
                                                <Play className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            )}

            {/* Practice / AI Mode Modal (module-scoped) */}
            {showModeSelect && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-surface/70 backdrop-blur-sm" onClick={() => setShowModeSelect(false)} />
                    <div className="relative w-full max-w-md bg-surface-container rounded-[2.5rem] border border-outline-variant/20 shadow-2xl p-8 animate-in zoom-in-95 fade-in duration-300">
                        <h3 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight">Choose Mode</h3>
                        <p className="text-on-surface-variant text-sm font-medium mb-8">Select your practice mode for this module.</p>

                        <div className="space-y-4">
                            <button
                                onClick={() => confirmPracticeMode("practice")}
                                className="w-full p-6 rounded-2xl border-2 border-outline-variant/10 hover:border-primary/50 bg-surface shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        <span className="font-black font-headline text-lg text-on-surface">Practice Mode</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-50">Untimed</span>
                                </div>
                                <p className="text-on-surface-variant text-xs font-medium ml-8 leading-relaxed italic">Relaxed approach. View all questions with no time limit.</p>
                            </button>

                            <button
                                onClick={() => confirmPracticeMode("ai")}
                                className="w-full p-6 rounded-2xl border-2 border-outline-variant/10 hover:border-purple-500/50 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        <span className="font-black font-headline text-lg text-on-surface">AI Concept Builder</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">New</span>
                                </div>
                                <p className="text-on-surface-variant text-xs font-medium ml-8 leading-relaxed italic">Master concepts with dynamically generated AI questions.</p>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowModeSelect(false)}
                            className="mt-6 w-full py-4 text-on-surface-variant hover:text-on-surface text-sm font-black uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Subject-level Exam Set Picker */}
            {showExamSetPicker && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-surface/70 backdrop-blur-sm" onClick={() => setShowExamSetPicker(false)} />
                    <div className="relative w-full max-w-md bg-surface-container rounded-[2.5rem] border border-outline-variant/20 shadow-2xl p-8 animate-in zoom-in-95 fade-in duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Timer className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Select Exam Set</h3>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium mb-2">Full subject-scope · Timed · {data.strictTimeLimit || 30} minutes total</p>
                        <p className="text-on-surface-variant/60 text-xs font-medium mb-8">Questions span all modules in this set.</p>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {setsWithQuestions.map((set) => {
                                // Deduplicate by id — same fix as allExamSetQuestions
                                const count = new Set(
                                    data.modules.flatMap((m) =>
                                        m.questions.filter(q => q.type === "exam" && q.quiz_set_id === set.id).map(q => q.id)
                                    )
                                ).size;
                                
                                const attemptedResult = examHistory.find(h => h.quiz_set_id === set.id);

                                if (attemptedResult) {
                                    return (
                                        <div
                                            key={set.id}
                                            className="w-full p-4 rounded-2xl border-2 border-outline-variant/10 bg-surface/50 shadow-sm flex items-center justify-between"
                                        >
                                            <div>
                                                <span className="font-black font-headline text-base text-on-surface/50 block line-through">{set.name}</span>
                                                <span className="text-xs text-on-surface-variant/50 font-mono">Attempted</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setResultToAnalyze(attemptedResult);
                                                    setShowExamSetPicker(false);
                                                }}
                                                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-xl font-bold text-xs flex items-center gap-2"
                                            >
                                                <History className="w-4 h-4" /> Analyze
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <button
                                        key={set.id}
                                        onClick={() => confirmExamSet(set.id)}
                                        className="w-full p-4 rounded-2xl border-2 border-outline-variant/10 hover:border-amber-500/50 bg-surface shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <span className="font-black font-headline text-base text-on-surface group-hover:text-amber-600 transition-colors block">{set.name}</span>
                                            <span className="text-xs text-on-surface-variant font-mono">{count} question{count !== 1 ? "s" : ""}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setShowExamSetPicker(false)}
                            className="mt-6 w-full py-4 text-on-surface-variant hover:text-on-surface text-sm font-black uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
