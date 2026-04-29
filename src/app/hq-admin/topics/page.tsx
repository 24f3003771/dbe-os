"use client";

import { useState, useEffect, useTransition } from "react";
import { Hash, Plus, Trash2, Loader2, X } from "lucide-react";
import { getTerms, getSubjects, getTopics, createTopic, deleteTopic, type Term, type Subject, type Topic } from "@/actions/curriculum";

export default function TopicsPage() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTermId, setSelectedTermId] = useState<string>("");
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const [newTopicName, setNewTopicName] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Load terms + all subjects on mount
    useEffect(() => {
        (async () => {
            const [t, s] = await Promise.all([getTerms(), getSubjects()]);
            setTerms(t);
            setSubjects(s);
            setLoading(false);
        })();
    }, []);

    // Load topics when subject changes
    useEffect(() => {
        if (!selectedSubjectId) { setTopics([]); return; }
        setLoadingTopics(true);
        getTopics(selectedSubjectId).then((t) => { setTopics(t); setLoadingTopics(false); });
    }, [selectedSubjectId]);

    const filteredSubjects = selectedTermId
        ? subjects.filter((s) => s.term_id === parseInt(selectedTermId))
        : subjects;

    const handleAddTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicName.trim() || !selectedSubjectId) return;
        startTransition(async () => {
            await createTopic(selectedSubjectId, newTopicName.trim());
            const updated = await getTopics(selectedSubjectId);
            setTopics(updated);
            setNewTopicName("");
        });
    };

    const handleDeleteTopic = (id: string) => {
        if (!confirm("Delete this topic? It will be unlinked from all questions and notes.")) return;
        startTransition(async () => {
            await deleteTopic(id, selectedSubjectId);
            setTopics((prev) => prev.filter((t) => t.id !== id));
        });
    };

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <Hash className="w-5 h-5 text-stone-400" />
                    <h1 className="text-2xl font-black text-stone-800 tracking-tight">Topics</h1>
                </div>
                <p className="text-sm font-bold text-stone-500">
                    Manage topics per subject. Used for future SWOT analysis.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Cascading selectors */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                                Step 1 — Select Term
                            </label>
                            <select
                                value={selectedTermId}
                                onChange={(e) => { setSelectedTermId(e.target.value); setSelectedSubjectId(""); setTopics([]); }}
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all appearance-none"
                            >
                                <option value="">All Terms</option>
                                {terms.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                                Step 2 — Select Subject
                            </label>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={filteredSubjects.length === 0}
                            >
                                <option value="">Select a subject...</option>
                                {filteredSubjects.map((s) => (
                                    <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Topics panel */}
                    {selectedSubjectId && (
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-widest text-stone-500">
                                Topics ({topics.length})
                            </p>

                            {/* Add topic form */}
                            <form onSubmit={handleAddTopic} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTopicName}
                                    onChange={(e) => setNewTopicName(e.target.value)}
                                    placeholder="e.g. Demand Forecasting"
                                    className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending || !newTopicName.trim()}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-40 shadow-sm"
                                >
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" />Add</>}
                                </button>
                            </form>

                            {/* Topics list */}
                            {loadingTopics ? (
                                <div className="py-8 flex justify-center">
                                    <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
                                </div>
                            ) : topics.length === 0 ? (
                                <p className="text-sm font-bold text-stone-400 text-center py-8">
                                    No topics yet. Add one above.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {topics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className="flex items-center justify-between bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 group hover:bg-stone-100 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Hash className="w-3.5 h-3.5 text-stone-400" />
                                                <span className="text-sm font-bold text-stone-700">{topic.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTopic(topic.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
