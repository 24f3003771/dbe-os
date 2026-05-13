"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Zap, Search, Loader2, CheckCircle2, ChevronDown, BarChart2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

type Question = {
    id: string;
    question: string;
    subject_id: string;
    difficulty: "easy" | "medium" | "hard" | null;
    is_concept_builder: boolean;
    module_from: number;
    type: string;
};
type Subject = { id: string; name: string; code: string };

const D_COLORS = {
    easy:   { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
    medium: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-300"   },
    hard:   { bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-300"    },
};

export default function ConceptBuilderAdminPanel({ subjects }: { subjects: Subject[] }) {
    const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "cb" | "practice">("all");
    const supabase = createClient();

    const fetchQuestions = async (sid: string) => {
        if (!sid) return;
        setLoading(true);
        const { data } = await supabase
            .from("questions")
            .select("id, question, subject_id, difficulty, is_concept_builder, module_from, type")
            .eq("subject_id", sid)
            .eq("input_type", "mcq")
            .order("module_from", { ascending: true });
        setQuestions((data ?? []) as Question[]);
        setLoading(false);
    };

    useEffect(() => { fetchQuestions(subjectId); }, [subjectId]);

    const toggleCB = async (q: Question) => {
        setSaving(q.id);
        const newVal = !q.is_concept_builder;
        await supabase.from("questions").update({ is_concept_builder: newVal }).eq("id", q.id);
        setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, is_concept_builder: newVal } : x));
        setSaving(null);
    };

    const setDifficulty = async (q: Question, diff: "easy" | "medium" | "hard") => {
        setSaving(q.id + diff);
        await supabase.from("questions").update({ difficulty: diff }).eq("id", q.id);
        setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, difficulty: diff } : x));
        setSaving(null);
    };

    const filtered = questions
        .filter(q => filter === "all" ? true : filter === "cb" ? q.is_concept_builder : !q.is_concept_builder)
        .filter(q => q.question.toLowerCase().includes(search.toLowerCase()));

    const cbQs = questions.filter(q => q.is_concept_builder);
    const stats = {
        cb: cbQs.length,
        practice: questions.length - cbQs.length,
        easy: cbQs.filter(q => q.difficulty === "easy").length,
        medium: cbQs.filter(q => q.difficulty === "medium").length,
        hard: cbQs.filter(q => q.difficulty === "hard").length,
        unset: cbQs.filter(q => !q.difficulty).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black font-headline text-on-surface flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-500" /> Concept Builder — Question Manager
                    </h2>
                    <p className="text-sm font-bold text-on-surface-variant mt-1">
                        Toggle questions as <strong>Concept Builder</strong> (separated from practice). Then tag difficulty: 🌱 Easy → ⚡ Medium → 🔥 Hard.
                    </p>
                </div>
                <div className="relative">
                    <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
                        className="appearance-none bg-surface-container border border-outline-variant/20 rounded-2xl px-4 py-2.5 pr-10 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: "⚡ Concept Builder", count: stats.cb,       color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
                    { label: "📚 Practice Only",   count: stats.practice, color: "bg-surface-container border-outline-variant/20 text-on-surface-variant" },
                    { label: "🌱 Easy",            count: stats.easy,     color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                    { label: "⚡ Medium",           count: stats.medium,   color: "bg-amber-50 border-amber-200 text-amber-700" },
                    { label: "🔥 Hard",            count: stats.hard,     color: "bg-rose-50 border-rose-200 text-rose-700" },
                ].map(s => (
                    <div key={s.label} className={`border rounded-2xl p-3 text-center ${s.color}`}>
                        <p className="text-2xl font-black">{s.count}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Level readiness */}
            {(stats.easy < 10 || stats.medium < 10 || stats.hard < 10) && stats.cb > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 font-medium">
                        <span className="font-black">Need ≥10 Concept Builder questions per level.</span>
                        {stats.easy < 10 && ` Easy needs ${10 - stats.easy} more.`}
                        {stats.medium < 10 && ` Medium needs ${10 - stats.medium} more.`}
                        {stats.hard < 10 && ` Hard needs ${10 - stats.hard} more.`}
                    </p>
                </div>
            )}

            {/* Filter + Search */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex rounded-2xl border border-outline-variant/20 overflow-hidden">
                    {(["all", "cb", "practice"] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${filter === f ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>
                            {f === "all" ? "All" : f === "cb" ? "⚡ CB Only" : "📚 Practice Only"}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                    <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
            </div>

            {/* Question list */}
            {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((q, i) => {
                        const isCB = q.is_concept_builder;
                        const dc = q.difficulty ? D_COLORS[q.difficulty] : null;
                        const isSavingCB = saving === q.id;

                        return (
                            <motion.div key={q.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                                className={`border rounded-2xl p-4 transition-all ${isCB ? "bg-indigo-50/30 border-indigo-200/50" : "bg-surface-container-lowest border-outline-variant/15"}`}>
                                <div className="flex items-start gap-3">
                                    {/* CB Toggle */}
                                    <button onClick={() => toggleCB(q)} disabled={isSavingCB}
                                        title={isCB ? "Remove from Concept Builder" : "Add to Concept Builder"}
                                        className={`mt-0.5 shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${isCB ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-indigo-400"}`}>
                                        {isSavingCB ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Mod {q.module_from} · {q.type}</span>
                                            {isCB && <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700">⚡ Concept Builder</span>}
                                            {!isCB && <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-surface-container text-on-surface-variant">📚 Practice</span>}
                                            {dc && isCB && <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${dc.bg} ${dc.text}`}>{q.difficulty}</span>}
                                        </div>
                                        <p className="text-sm font-medium text-on-surface line-clamp-2">{q.question}</p>
                                    </div>

                                    {/* Difficulty buttons — only for CB questions */}
                                    {isCB && (
                                        <div className="flex items-center gap-1 shrink-0">
                                            {(["easy", "medium", "hard"] as const).map(level => {
                                                const ldc = D_COLORS[level];
                                                const isSavingDiff = saving === q.id + level;
                                                return (
                                                    <button key={level} onClick={() => setDifficulty(q, level)} disabled={!!saving}
                                                        className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${q.difficulty === level ? `${ldc.bg} ${ldc.text} ${ldc.border}` : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"}`}>
                                                        {isSavingDiff ? <Loader2 className="w-3 h-3 animate-spin" /> : level === "easy" ? "🌱" : level === "medium" ? "⚡" : "🔥"}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && !loading && (
                        <div className="text-center py-16 text-on-surface-variant font-medium">
                            {search ? `No questions matching "${search}"` : "No MCQ questions for this subject."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
