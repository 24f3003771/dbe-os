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
    const [viewMode, setViewMode] = useState<"selection" | "practice" | "ai" | "exam">("selection");
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
    const [quizMode, setQuizMode] = useState<"practice" | "exam">("practice");
    const [quizSubMode, setQuizSubMode] = useState<"practice" | "ai" | "exam-set">("practice");
    const [activeQuizSetId, setActiveQuizSetId] = useState<string | null>(null);

    // Module-level mode selection state
    const [pendingModuleId, setPendingModuleId] = useState<number | null>(null);
    const [examTimer, setExamTimer] = useState<number | undefined>(undefined);
    const [emptyMessageModuleId, setEmptyMessageModuleId] = useState<number | null>(null);
    const [resultToAnalyze, setResultToAnalyze] = useState<any | null>(null);

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

    // Module click (either Practice or AI mode)
    const handleStartModuleQuiz = (moduleId: number, mode: "practice" | "ai") => {
        const selectedModule = data.modules.find((m) => m.id === moduleId);
        if (selectedModule && selectedModule.questions.filter(q => q.type !== "exam").length === 0) {
            setEmptyMessageModuleId(moduleId);
            setTimeout(() => setEmptyMessageModuleId(null), 3000);
            return;
        }
        
        setQuizSubMode(mode);
        setQuizMode("practice");
        setExamTimer(undefined);
        setActiveQuizSetId(null);
        setActiveModuleId(moduleId);
        setActiveTab("quiz");
    };

    // Exam set selected (subject-scoped, all modules)
    const confirmExamSet = (setId: string) => {
        setQuizSubMode("exam-set");
        setQuizMode("exam");
        setExamTimer(data.strictTimeLimit ? data.strictTimeLimit * 60 : 60 * 30); // minutes to seconds
        setActiveQuizSetId(setId);
        setActiveModuleId(null); // Not module-scoped
        setActiveTab("quiz");
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

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant/10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Link href="/quiz" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant hover:text-primary">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <span className="w-fit px-2 py-0.5 bg-primary/10 text-primary font-mono text-[10px] tracking-widest font-bold rounded border border-primary/20 shadow-sm">
                        {data.id}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black font-headline text-on-surface tracking-tight leading-tight">
                        {data.title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setActiveTab(activeTab === "history" ? "overview" : "history");
                            if (activeTab !== "history") setViewMode("selection");
                        }}
                        className={`flex items-center gap-2 px-5 py-2 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm border group ${activeTab === "history" ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" : "bg-surface-container-lowest text-on-surface border-outline-variant/20 hover:bg-surface-container"}`}
                    >
                        <History className="w-3.5 h-3.5 group-hover:rotate-[-20deg] transition-transform" />
                        {activeTab === "history" ? "Return to Selection" : "Performance Review"}
                    </button>
                    {activeTab !== "overview" || viewMode !== "selection" ? (
                        <button 
                            onClick={() => {
                                setActiveTab("overview");
                                setViewMode("selection");
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-container-highest/30 px-4 py-2 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-all"
                        >
                            Reset
                        </button>
                    ) : null}
                </div>
            </div>

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
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {viewMode === "selection" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {/* Block 1: Practice */}
                            <button
                                onClick={() => setViewMode("practice")}
                                className="group relative aspect-[4/5] bg-surface-container-lowest border-2 border-outline-variant/10 rounded-[2rem] p-6 flex flex-col items-start text-left hover:border-primary/40 hover:bg-surface-container transition-all hover-lift shadow-sm hover:shadow-2xl hover:shadow-primary/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">Practice</h3>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70">
                                    Untimed sessions to master each module at your own pace. Ideal for initial learning and revision.
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore Modules <ArrowRight className="w-3 h-3" />
                                </div>
                                <div className="absolute top-4 right-4 opacity-5 font-black text-5xl select-none group-hover:opacity-10 transition-opacity">01</div>
                            </button>

                            {/* Block 2: Concept Builder */}
                            <button
                                onClick={() => setViewMode("ai")}
                                className="group relative aspect-[4/5] bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] bg-surface-container-lowest border-2 border-outline-variant/10 rounded-[2rem] p-6 flex flex-col items-start text-left hover:border-purple-500/40 hover:bg-surface-container transition-all hover-lift shadow-sm hover:shadow-2xl hover:shadow-purple-500/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight group-hover:text-purple-600 transition-colors">Concept Builder</h3>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70">
                                    AI-powered adaptive questions designed to bridge your knowledge gaps and build core intuition.
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Bridge Gaps <ArrowRight className="w-3 h-3" />
                                </div>
                                <div className="absolute top-4 right-4 opacity-5 font-black text-5xl select-none group-hover:opacity-10 transition-opacity">02</div>
                            </button>

                            {/* Block 3: PYQs and Mocks */}
                            <button
                                onClick={() => setViewMode("exam")}
                                className="group relative aspect-[4/5] bg-surface-container-lowest border-2 border-outline-variant/10 rounded-[2rem] p-6 flex flex-col items-start text-left hover:border-amber-500/40 hover:bg-surface-container transition-all hover-lift shadow-sm hover:shadow-2xl hover:shadow-amber-500/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Timer className="w-6 h-6 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight group-hover:text-amber-600 transition-colors">PYQs & MOCK</h3>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70">
                                    Full subject-scope timed mocks. The ultimate test for your preparation before the actual exam.
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Simulate Exam <ArrowRight className="w-3 h-3" />
                                </div>
                                <div className="absolute top-4 right-4 opacity-5 font-black text-5xl select-none group-hover:opacity-10 transition-opacity">03</div>
                            </button>
                        </div>
                    ) : viewMode === "practice" || viewMode === "ai" ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {viewMode === "practice" ? <BookOpen className="w-6 h-6 text-primary" /> : <Sparkles className="w-6 h-6 text-purple-600" />}
                                    <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">
                                        {viewMode === "practice" ? "Practice Modules" : "Concept Builder Modules"}
                                    </h2>
                                </div>
                                <button onClick={() => setViewMode("selection")} className="text-xs font-bold text-on-surface-variant hover:text-primary">Cancel</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.modules.length === 0 ? (
                                    <p className="text-on-surface-variant italic col-span-full border border-dashed border-outline-variant/30 p-10 rounded-2xl text-center font-medium">
                                        No modules available.
                                    </p>
                                ) : (
                                    data.modules.map((mod) => {
                                        const practiceCount = mod.questions.filter(q => q.type !== "exam").length;
                                        return (
                                            <div
                                                key={mod.id}
                                                className={`group p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/15 hover:border-${viewMode === 'practice' ? 'primary' : 'purple-500'}/50 transition-all hover:bg-surface-container flex flex-col cursor-pointer hover-lift shadow-sm`}
                                                onClick={() => handleStartModuleQuiz(mod.id, viewMode)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`font-black text-lg text-on-surface group-hover:text-${viewMode === 'practice' ? 'primary' : 'purple-600'} transition-colors leading-tight truncate uppercase tracking-tight`}>{mod.title}</h3>
                                                        {emptyMessageModuleId === mod.id ? (
                                                            <p className="text-xs text-amber-500 font-bold tracking-wider mt-1 animate-in fade-in slide-in-from-top-1 duration-300">Wait, questions will be available soon</p>
                                                        ) : (
                                                            <p className="text-xs text-on-surface-variant font-black uppercase tracking-widest mt-1 opacity-50">{practiceCount} Questions</p>
                                                        )}
                                                    </div>
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform flex-shrink-0 ml-4 shadow-sm border ${practiceCount === 0 ? "bg-surface-container-highest border-outline-variant/10 text-on-surface-variant/30" : `bg-surface-container-highest border-outline-variant/10 text-on-surface-variant group-hover:scale-110 group-hover:bg-${viewMode === 'practice' ? 'primary' : 'purple-600'} group-hover:border-transparent group-hover:text-white`}`}>
                                                        <Play className="w-5 h-5 ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Timer className="w-6 h-6 text-amber-500" />
                                    <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">Select Exam Set</h2>
                                </div>
                                <button onClick={() => setViewMode("selection")} className="text-xs font-bold text-on-surface-variant hover:text-primary">Cancel</button>
                            </div>
                            
                            {setsWithQuestions.length === 0 ? (
                                <div className="bg-surface-container rounded-[2rem] p-16 text-center border-2 border-dashed border-outline-variant/20">
                                    <Timer className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-on-surface mb-2">No Exam Sets</h3>
                                    <p className="text-on-surface-variant max-w-xs mx-auto">Mocks and PYQs for this subject will be available here soon.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {setsWithQuestions.map((set) => {
                                        const count = new Set(data.modules.flatMap((m) => m.questions.filter(q => q.type === "exam" && q.quiz_set_id === set.id).map(q => q.id))).size;
                                        const attemptedResult = examHistory.find(h => h.quiz_set_id === set.id);

                                        return (
                                            <div
                                                key={set.id}
                                                className={`group p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/15 hover:border-amber-500/50 transition-all hover:bg-surface-container flex flex-col cursor-pointer hover-lift shadow-sm ${attemptedResult ? 'opacity-80' : ''}`}
                                                onClick={() => attemptedResult ? setResultToAnalyze(attemptedResult) : confirmExamSet(set.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`font-black text-lg text-on-surface ${attemptedResult ? 'line-through opacity-50' : 'group-hover:text-amber-600'} transition-colors leading-tight truncate uppercase tracking-tight`}>{set.name}</h3>
                                                        <p className="text-xs text-on-surface-variant font-black uppercase tracking-widest mt-1 opacity-50">
                                                            {attemptedResult ? 'Attempted · Analysis Available' : `${count} Questions · Timed`}
                                                        </p>
                                                    </div>
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform flex-shrink-0 ml-4 shadow-sm border bg-surface-container-highest border-outline-variant/10 text-on-surface-variant group-hover:scale-110 ${attemptedResult ? 'group-hover:bg-primary group-hover:text-white' : 'group-hover:bg-amber-500 group-hover:text-white'} group-hover:border-transparent`}>
                                                        {attemptedResult ? <History className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === "selection" && (
                        <div className="pt-10">
                            <Link
                                href={`/dbe_notes/${data.subjectId}`}
                                className="group flex items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-[2rem] hover:bg-surface-container hover:border-primary/20 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-on-surface text-surface flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-on-surface uppercase tracking-tight">Need to Study First?</p>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Access all curriculum notes for this subject</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-xl group-hover:bg-primary group-hover:text-on-primary transition-all">
                                    Open Notes <ChevronRight className="w-3 h-3 ml-1" />
                                </div>
                            </Link>
                        </div>
                    )}
                </section>
            )}

        </div>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
