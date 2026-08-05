"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, CheckCircle2, XCircle, Trophy, AlertTriangle, Layers, TrendingUp, Sparkles, Zap, Flame, Eye } from "lucide-react";
import Link from "next/link";
import { recordTomatoEvent } from "@/actions/farm";
import { useFarmStore } from "@/hooks/useFarmStore";

const LEVELS = [
    { key: "easy",   label: "Easy",   Icon: Sparkles, gradient: "from-emerald-400 to-teal-500",  bg: "bg-emerald-50",  border: "border-emerald-300", text: "text-emerald-700", bar: "bg-emerald-500" },
    { key: "medium", label: "Medium", Icon: Zap,      gradient: "from-amber-400 to-orange-500",  bg: "bg-amber-50",   border: "border-amber-300",   text: "text-amber-700",   bar: "bg-amber-500"   },
    { key: "hard",   label: "Hard",   Icon: Flame,    gradient: "from-rose-500 to-pink-600",     bg: "bg-rose-50",    border: "border-rose-300",    text: "text-rose-700",    bar: "bg-rose-500"    },
] as const;

const PASS = 80;
const QS_PER_LEVEL = 10;
const MIN_QUESTION_MS = 5000; // Minimum 5 seconds reading required per question

type Q = { id: string; question: string; options: string[]; correct_index: number; explanation: string; difficulty: string };
type Mod = { number: number; title: string; easy: Q[]; medium: Q[]; hard: Q[] };
type Props = {
    subject: { id: string; name: string; code: string };
    modules: Mod[];
    progress: Record<string, any>;
    userId: string;
    migrationPending?: boolean;
};
type Phase = "modules" | "quiz" | "result" | "review";

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function ConceptBuilderClient({ subject, modules, progress: initialProgress, userId, migrationPending }: Props) {
    const [phase, setPhase] = useState<Phase>("modules");
    const [localProgress, setLocalProgress] = useState(initialProgress);
    const [activeMod, setActiveMod] = useState<Mod | null>(null);
    const [activeLevel, setActiveLevel] = useState<"easy" | "medium" | "hard">("easy");

    // Quiz state
    const [questions, setQuestions] = useState<Q[]>([]);
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [answers, setAnswers] = useState<{ correct: boolean; skipped: boolean }[]>([]);
    const [skipCount, setSkipCount] = useState(0);
    const [cheatWarn, setCheatWarn] = useState(false);
    const [warnMessage, setWarnMessage] = useState("");
    const [lastEarnedTomatoes, setLastEarnedTomatoes] = useState(0);
    const startTime = useRef(Date.now());
    const supabase = createClient();

    const progKey = (mod: number, diff: string) => `${mod}-${diff}`;
    const getProg = (mod: number, diff: string) => localProgress[progKey(mod, diff)];

    // Auto-detect user's current level for a module
    const getCurrentLevel = (mod: Mod): "easy" | "medium" | "hard" => {
        if (getProg(mod.number, "hard")?.completed) return "hard";   // all done, still replay hard
        if (getProg(mod.number, "medium")?.completed) return "hard"; // easy+medium done → go hard
        if (getProg(mod.number, "easy")?.completed) return "medium"; // easy done → go medium
        return "easy"; // fresh start
    };

    const getLevelIndex = (lk: string) => LEVELS.findIndex(l => l.key === lk);

    // Launch module or start review mode if level already completed
    const launchModule = (mod: Mod) => {
        const level = getCurrentLevel(mod);
        startLevelSession(mod, level);
    };

    const startLevelSession = (mod: Mod, level: "easy" | "medium" | "hard") => {
        const pool = mod[level];
        if (pool.length === 0) return;

        const isCompleted = getProg(mod.number, level)?.completed ?? false;
        setActiveMod(mod);
        setActiveLevel(level);

        if (isCompleted) {
            // 1-Time Attempt Rule: Completed levels launch directly in Review Mode
            setQuestions(pool);
            setIdx(0);
            setPhase("review");
        } else {
            // Fresh uncompleted attempt
            setQuestions(shuffle(pool).slice(0, QS_PER_LEVEL));
            setIdx(0);
            setSelected(null);
            setConfirmed(false);
            setAnswers([]);
            setSkipCount(0);
            setLastEarnedTomatoes(0);
            setPhase("quiz");
            startTime.current = Date.now();
        }
    };

    const handleConfirm = useCallback(() => {
        if (confirmed) return;
        const elapsed = Date.now() - startTime.current;
        if (elapsed < MIN_QUESTION_MS) {
            const remaining = Math.ceil((MIN_QUESTION_MS - elapsed) / 1000);
            setWarnMessage(`Please read the question thoroughly! Wait ${remaining} second(s) before submitting.`);
            setCheatWarn(true);
            setTimeout(() => setCheatWarn(false), 3000);
            return;
        }

        const isSkip = selected === null;
        const correct = !isSkip && selected === questions[idx]?.correct_index;
        setAnswers(p => [...p, { correct, skipped: isSkip }]);
        if (isSkip) setSkipCount(s => s + 1);
        setConfirmed(true);
    }, [confirmed, selected, questions, idx]);

    const handleNext = async () => {
        if (idx < questions.length - 1) {
            setIdx(i => i + 1);
            setSelected(null);
            setConfirmed(false);
            startTime.current = Date.now();
        } else {
            const correct = answers.filter(a => a.correct).length;
            const score = Math.round((correct / questions.length) * 100);
            const passed = score >= PASS;
            const modNum = activeMod!.number;
            const key = progKey(modNum, activeLevel);
            const existing = localProgress[key];
            const newBest = Math.max(score, existing?.best_score ?? 0);

            // Tomato reward economy: +5 per correct question, +20 bonus for 10 questions
            const questionTomatoes = correct * 5;
            const bonusTomatoes = questions.length >= 10 ? 20 : 0;
            const totalEarned = questionTomatoes + bonusTomatoes;
            setLastEarnedTomatoes(totalEarned);

            if (totalEarned > 0) {
                try {
                    await recordTomatoEvent({
                        actionType: "concept_builder",
                        description: `Concept Builder · ${subject.name} (${activeMod!.title} ${activeLevel})`,
                        tomatoes: totalEarned,
                    });
                    useFarmStore.getState().earnTomatoes({
                        actionType: "concept_builder",
                        description: `Concept Builder · ${subject.name}`,
                        tomatoes: totalEarned,
                    });
                } catch (err) {
                    console.error("Error saving tomatoes:", err);
                }
            }

            const upsertData = {
                user_id: userId, subject_id: subject.id,
                module_number: modNum, difficulty: activeLevel,
                completed: passed || (existing?.completed ?? false),
                best_score: newBest,
                attempts: (existing?.attempts ?? 0) + 1,
                last_attempt: new Date().toISOString(),
            };
            await supabase.from("concept_builder_progress").upsert(upsertData, { onConflict: "user_id,subject_id,module_number,difficulty" });
            setLocalProgress(p => ({ ...p, [key]: { completed: upsertData.completed, best_score: newBest, attempts: upsertData.attempts } }));
            setPhase("result");
        }
    };

    // ── MODULE SELECTOR ───────────────────────────────────────────────────────────
    if (phase === "modules") {
        const totalCB = modules.reduce((s, m) => s + m.easy.length + m.medium.length + m.hard.length, 0);
        return (
            <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href="/quiz" className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                        <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
                    </Link>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60">Concept Builder</p>
                        <h1 className="text-2xl font-black text-on-surface">{subject.name}</h1>
                    </div>
                </div>

                {/* Migration warning */}
                {migrationPending && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-black text-rose-800">Database setup required</p>
                            <p className="text-xs text-rose-700 mt-0.5">Run <code className="bg-rose-100 px-1 rounded">20260512200000_concept_builder_v2.sql</code> in Supabase.</p>
                        </div>
                    </div>
                )}

                {/* No questions */}
                {!migrationPending && totalCB === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-black text-amber-800">No questions available yet</p>
                            <p className="text-xs text-amber-700 mt-0.5">Add MCQ questions in HQ Admin for this subject to populate Concept Builder.</p>
                        </div>
                    </div>
                )}

                {/* Info banner */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-5 h-5 text-violet-200" />
                        <h2 className="text-base font-black uppercase tracking-wide">Adaptive Level-by-Level Learning</h2>
                    </div>
                    <p className="text-violet-100 text-sm leading-relaxed">
                        Each module has 3 levels — Easy, Medium, Hard. Score <strong>≥80%</strong> to advance. Cleared levels enter <strong>Review Mode</strong>. Earn <strong>+5 🍅 per correct answer</strong> & <strong>+20 🍅 bonus</strong> per 10 questions!
                    </p>
                </div>

                {/* Module grid */}
                <div className="space-y-3">
                    {modules.map((mod, i) => {
                        const currentLevel = getCurrentLevel(mod);
                        const lv = LEVELS.find(l => l.key === currentLevel)!;
                        const allDone = getProg(mod.number, "hard")?.completed ?? false;
                        const totalQs = mod.easy.length + mod.medium.length + mod.hard.length;
                        const hasQuestions = totalQs > 0;

                        return (
                            <motion.div key={mod.number}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => hasQuestions && launchModule(mod)}
                                className={`rounded-2xl border-2 p-5 transition-all ${hasQuestions ? "cursor-pointer hover:shadow-md hover:scale-[1.005] bg-surface-container-lowest border-outline-variant/15 hover:border-primary/25" : "bg-surface-container/50 border-outline-variant/10 opacity-50 cursor-not-allowed"}`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-black text-on-surface text-base">{mod.title}</h3>
                                            {allDone ? (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                                                    <CheckCircle2 className="w-3 h-3" /> Completed
                                                </span>
                                            ) : hasQuestions ? (
                                                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${lv.bg} ${lv.text} border ${lv.border}`}>
                                                    <lv.Icon className="w-3 h-3" /> {lv.label} Level
                                                </span>
                                            ) : null}
                                        </div>
                                        {hasQuestions ? (
                                            <p className="text-xs text-on-surface-variant font-medium">
                                                {allDone ? "All 3 levels cleared · Tap to review questions" : `Continue at ${lv.label} · ${mod[currentLevel].length} questions available`}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-on-surface-variant font-medium">No questions added for this module yet</p>
                                        )}
                                    </div>

                                    {/* 3 progress bars */}
                                    <div className="flex items-end gap-1.5 shrink-0 h-10">
                                        {LEVELS.map((lvl, lvIdx) => {
                                            const p = getProg(mod.number, lvl.key);
                                            const done = p?.completed ?? false;
                                            const best = p?.best_score ?? 0;
                                            const isActive = lvl.key === currentLevel && !allDone;
                                            return (
                                                <div key={lvl.key}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (mod[lvl.key as "easy"|"medium"|"hard"].length > 0) {
                                                            startLevelSession(mod, lvl.key as "easy"|"medium"|"hard");
                                                        }
                                                    }}
                                                    className="flex flex-col items-center gap-1 cursor-pointer group/bar"
                                                    title={`${lvl.label}: ${done ? "Cleared (Tap to Review)" : best > 0 ? best + "% Best" : "Locked"}`}
                                                >
                                                    <div className="w-2.5 h-8 rounded-full bg-surface-container-high overflow-hidden relative group-hover/bar:ring-2 ring-primary/40">
                                                        <div
                                                            className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${done ? lvl.bar : best > 0 ? lvl.bar + " opacity-40" : ""}`}
                                                            style={{ height: done ? "100%" : best > 0 ? `${best}%` : "0%" }}
                                                        />
                                                    </div>
                                                    <lvl.Icon className={`w-3 h-3 ${isActive ? lvl.text : "text-on-surface-variant/40"}`} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── REVIEW MODE ───────────────────────────────────────────────────────────────
    if (phase === "review" && activeMod) {
        const lv = LEVELS.find(l => l.key === activeLevel)!;
        const currentQ = questions[idx];
        const prog = getProg(activeMod.number, activeLevel);

        return (
            <div className="max-w-2xl mx-auto py-8 px-4 space-y-5 font-body">
                {/* Review Header */}
                <div className="flex items-center justify-between">
                    <button onClick={() => setPhase("modules")} className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                        <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
                    </button>
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60">{activeMod.title} · Review Mode</p>
                        <p className={`text-sm font-black ${lv.text} flex items-center justify-center gap-1 mt-0.5`}>
                            <lv.Icon className="w-4 h-4" /> {lv.label} Level (Cleared: {prog?.best_score ?? 100}%)
                        </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Review Only
                    </span>
                </div>

                {/* Question counter */}
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                    <span>Question {idx + 1} of {questions.length}</span>
                    <span className="text-emerald-600 font-bold">1-Time Attempted · Level Cleared</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${lv.gradient} rounded-full transition-all duration-300`}
                        style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
                </div>

                {/* Question Card */}
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-on-surface leading-relaxed mb-6">{currentQ?.question}</h3>

                    <div className="space-y-3">
                        {currentQ?.options?.map((opt, i) => {
                            const isCorrect = i === currentQ.correct_index;
                            let cls = "w-full text-left p-4 rounded-2xl border-2 font-medium text-sm transition-all ";
                            if (isCorrect) cls += "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold";
                            else cls += "bg-surface-container border-outline-variant/10 text-on-surface-variant opacity-60";

                            return (
                                <div key={i} className={cls}>
                                    <span className="flex items-center gap-3">
                                        <span className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center text-xs font-black shrink-0 ${isCorrect ? "bg-emerald-500 border-emerald-500 text-white" : "border-outline-variant/30 text-on-surface-variant"}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {currentQ?.explanation && (
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-sm text-indigo-800">
                            <p className="font-black text-indigo-900 mb-1">Explanation</p>
                            {currentQ.explanation}
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setIdx(i => Math.max(0, i - 1))}
                        disabled={idx === 0}
                        className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border transition-all ${idx > 0 ? "bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-high" : "opacity-40 cursor-not-allowed bg-surface-container"}`}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => idx < questions.length - 1 ? setIdx(i => i + 1) : setPhase("modules")}
                        className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${lv.gradient} text-white font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-transform`}
                    >
                        {idx < questions.length - 1 ? "Next →" : "Finish Review"}
                    </button>
                </div>
            </div>
        );
    }

    // ── RESULT ───────────────────────────────────────────────────────────────────
    if (phase === "result" && activeMod) {
        const correct = answers.filter(a => a.correct).length;
        const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
        const passed = score >= PASS;
        const lv = LEVELS.find(l => l.key === activeLevel)!;
        const lvIdx = getLevelIndex(activeLevel);
        const nextLv = LEVELS[lvIdx + 1];
        const canAdvance = passed && nextLv && !(getProg(activeMod.number, nextLv.key)?.completed);
        const allComplete = passed && activeLevel === "hard";

        return (
            <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-8">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br ${lv.gradient} shadow-xl mb-4`}>
                        {allComplete ? <Trophy className="w-10 h-10 text-white" /> : passed ? <TrendingUp className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
                    </div>
                    <h2 className="text-3xl font-black text-on-surface">
                        {allComplete ? "Module Complete! 🏆" : passed ? "Level Cleared! 🎉" : "Keep Going..."}
                    </h2>
                    <p className="text-on-surface-variant font-medium mt-1 text-sm flex items-center justify-center gap-1.5">
                        {activeMod.title} · <lv.Icon className={`w-4 h-4 ${lv.text}`} /> <span className={lv.text}>{lv.label} Level</span>
                    </p>
                    <p className="text-on-surface-variant text-sm mt-1">
                        {allComplete ? "You've mastered all 3 levels for this module!" :
                            passed ? `${score}% — Next level unlocked!` :
                                `${score}% — Need ${PASS}% to advance. Try again!`}
                    </p>
                </motion.div>

                {/* Tomato reward banner */}
                {lastEarnedTomatoes > 0 && (
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-5 rounded-3xl flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl animate-bounce">🍅</span>
                            <div className="text-left">
                                <p className="font-black text-lg leading-tight">+ {lastEarnedTomatoes} Tomatoes Earned!</p>
                                <p className="text-xs text-rose-100 font-medium mt-0.5">
                                    +{correct * 5} from correct answers {questions.length >= 10 ? "+ 20 set bonus" : ""}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-full">
                            Added to Farm
                        </span>
                    </motion.div>
                )}

                {/* Score breakdown */}
                <div className={`rounded-3xl p-6 ${lv.bg} border-2 ${lv.border}`}>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div><p className="text-3xl font-black text-on-surface">{correct}</p><p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Correct</p></div>
                        <div><p className="text-3xl font-black text-on-surface">{questions.length - correct - skipCount}</p><p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Wrong</p></div>
                        <div><p className="text-3xl font-black text-on-surface">{skipCount}</p><p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Skipped</p></div>
                    </div>
                    <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${lv.gradient} rounded-full transition-all`} style={{ width: `${score}%` }} />
                    </div>
                    <p className={`text-center font-black text-2xl mt-2 ${lv.text}`}>{score}%</p>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                    {canAdvance && nextLv && (
                        <button onClick={() => startLevelSession(activeMod, nextLv.key as "easy" | "medium" | "hard")}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2">
                            <nextLv.Icon className="w-4 h-4" /> Go to {nextLv.label}
                        </button>
                    )}
                    <button onClick={() => startLevelSession(activeMod, activeLevel)}
                        className="px-5 py-3 rounded-2xl bg-surface-container border border-outline-variant/20 font-black text-sm uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Review Level Questions
                    </button>
                    <button onClick={() => setPhase("modules")}
                        className="px-5 py-3 rounded-2xl bg-surface-container border border-outline-variant/20 font-black text-sm uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-colors">
                        All Modules
                    </button>
                </div>
            </div>
        );
    }

    // ── QUIZ ─────────────────────────────────────────────────────────────────────
    const lv = LEVELS.find(l => l.key === activeLevel)!;
    const currentQ = questions[idx];
    const correct = answers.filter(a => a.correct).length;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-5">
            {/* Header — NO question number, only module + level */}
            <div className="flex items-center justify-between">
                <button onClick={() => { if (confirm("Exit? Your current attempt progress will be lost.")) setPhase("modules"); }}
                    className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                    <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
                </button>
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60">{activeMod?.title}</p>
                    <p className={`text-sm font-black ${lv.text} flex items-center justify-center gap-1 mt-0.5`}>
                        <lv.Icon className="w-4 h-4" /> {lv.label} Level
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-xl ${lv.bg} ${lv.text} text-xs font-black`}>{correct}/{idx} ✓</div>
            </div>

            {/* Progress bar — no number label */}
            <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${lv.gradient} rounded-full transition-all duration-300`}
                    style={{ width: `${((idx + (confirmed ? 1 : 0)) / questions.length) * 100}%` }} />
            </div>

            {/* Anti-cheat / 5-second timer warning */}
            <AnimatePresence>
                {cheatWarn && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-2xl text-sm font-bold shadow-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {warnMessage || "Please read the question thoroughly! You must spend at least 5 seconds on each question before answering."}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}
                    className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-6 shadow-sm">
                    {/* Question text — no number prefix */}
                    <h3 className="text-base font-bold text-on-surface leading-relaxed mb-6">{currentQ?.question}</h3>

                    <div className="space-y-3">
                        {currentQ?.options?.map((opt, i) => {
                            const isSel = selected === i;
                            const isCorrect = i === currentQ.correct_index;
                            let cls = "w-full text-left p-4 rounded-2xl border-2 font-medium text-sm transition-all ";
                            if (!confirmed) cls += isSel ? `${lv.bg} ${lv.border} ${lv.text} font-bold` : "bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-high";
                            else if (isCorrect) cls += "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold";
                            else if (isSel) cls += "bg-rose-50 border-rose-400 text-rose-800 font-bold";
                            else cls += "bg-surface-container border-outline-variant/10 text-on-surface-variant opacity-50";
                            return (
                                <button key={i} className={cls} onClick={() => !confirmed && setSelected(i)} disabled={confirmed}>
                                    <span className="flex items-center gap-3">
                                        <span className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center text-xs font-black shrink-0
                                            ${confirmed && isCorrect ? "bg-emerald-400 border-emerald-400 text-white"
                                            : confirmed && isSel && !isCorrect ? "bg-rose-400 border-rose-400 text-white"
                                            : isSel ? `${lv.border} ${lv.text}` : "border-outline-variant/30 text-on-surface-variant"}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {confirmed && currentQ?.explanation && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-sm text-indigo-800">
                            <p className="font-black text-indigo-900 mb-1">Explanation</p>
                            {currentQ.explanation}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Action */}
            <div className="flex gap-3">
                {!confirmed ? (
                    <>
                        <button onClick={() => { setSelected(null); handleConfirm(); }}
                            className="flex-1 py-3 rounded-2xl bg-surface-container border border-outline-variant/20 text-on-surface-variant font-black text-sm uppercase tracking-widest hover:bg-surface-container-high transition-colors">
                            Skip
                        </button>
                        <button onClick={handleConfirm} disabled={selected === null}
                            className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg transition-all ${selected !== null ? `bg-gradient-to-r ${lv.gradient} hover:scale-[1.01]` : "bg-outline-variant/20 text-on-surface-variant cursor-not-allowed"}`}>
                            Confirm
                        </button>
                    </>
                ) : (
                    <button onClick={handleNext}
                        className={`w-full py-3 rounded-2xl bg-gradient-to-r ${lv.gradient} text-white font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-transform`}>
                        {idx < questions.length - 1 ? "Next →" : "See Results"}
                    </button>
                )}
            </div>
        </div>
    );
}
