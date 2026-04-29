"use client";

import { useState, useEffect, useTransition } from "react";
import {
    BookOpen, Plus, ToggleLeft, ToggleRight, ChevronRight,
    Trash2, Loader2, X, Check, Clock, Layers, Pencil
} from "lucide-react";
import Link from "next/link";
import {
    getTerms, updateTerm, getSubjects, createSubject, updateSubject, deleteSubject,
    type Term, type Subject
} from "@/actions/curriculum";

const BATCHES = ["Batch 1", "Batch 2"];

function TermCard({ term, subjectCount, onToggle, onAssignBatch }: {
    term: Term; subjectCount: number; onToggle: () => void; onAssignBatch: (b: string | null) => void;
}) {
    return (
        <div className={`rounded-2xl border p-4 transition-all bg-white ${term.is_active ? "border-red-200 shadow-sm shadow-red-100" : "border-stone-200"}`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Term {term.id}</p>
                    <p className="text-base font-black text-stone-800">{term.name}</p>
                </div>
                <span className="text-[10px] font-black bg-stone-100 text-stone-500 px-2 py-0.5 rounded-lg border border-stone-200">
                    {subjectCount}
                </span>
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500">Active</span>
                <button onClick={onToggle} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                    term.is_active
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300"
                }`}>
                    {term.is_active ? <><ToggleRight className="w-3 h-3" /> On</> : <><ToggleLeft className="w-3 h-3" /> Off</>}
                </button>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Batch</span>
                <select
                    value={term.assigned_batch ?? ""}
                    onChange={(e) => onAssignBatch(e.target.value || null)}
                    className="bg-white border border-stone-200 text-stone-700 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-red-300 transition-all appearance-none cursor-pointer"
                >
                    <option value="">—</option>
                    {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
        </div>
    );
}

function AddSubjectModal({ terms, onClose, onSaved }: { terms: Term[]; onClose: () => void; onSaved: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", code: "", term_id: "", module_count: "4", strict_time_limit: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError(null);
        if (!form.name || !form.code || !form.term_id) { setError("Name, code, and term are required."); return; }
        startTransition(async () => {
            try {
                await createSubject({ name: form.name, code: form.code, term_id: parseInt(form.term_id), module_count: parseInt(form.module_count) as 4 | 8, strict_time_limit: form.strict_time_limit ? parseInt(form.strict_time_limit) : null });
                onSaved(); onClose();
            } catch (err: any) { setError(err.message); }
        });
    };

    const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-800 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all";

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-stone-800">Add Subject</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Subject Name</label>
                            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Micro Economics" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Subject Code</label>
                            <input required type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ES21X" className={inputCls + " font-mono"} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Term</label>
                        <select required value={form.term_id} onChange={(e) => setForm({ ...form, term_id: e.target.value })} className={inputCls + " appearance-none"}>
                            <option value="">Select term...</option>
                            {terms.map((t) => <option key={t.id} value={t.id}>{t.name}{t.assigned_batch ? ` — ${t.assigned_batch}` : ""}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Modules</label>
                            <select value={form.module_count} onChange={(e) => setForm({ ...form, module_count: e.target.value })} className={inputCls + " appearance-none"}>
                                <option value="4">4 Modules</option>
                                <option value="8">8 Modules</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Strict Time (min)</label>
                            <input type="number" value={form.strict_time_limit} onChange={(e) => setForm({ ...form, strict_time_limit: e.target.value })} placeholder="30" min={1} className={inputCls} />
                        </div>
                    </div>
                    <button type="submit" disabled={isPending} className="w-full py-3 bg-red-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Add Subject</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

function EditSubjectModal({ subject, terms, onClose, onSaved }: { subject: Subject; terms: Term[]; onClose: () => void; onSaved: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: subject.name,
        code: subject.code,
        term_id: String(subject.term_id),
        module_count: String(subject.module_count),
        strict_time_limit: subject.strict_time_limit ? String(subject.strict_time_limit) : ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError(null);
        startTransition(async () => {
            try {
                await updateSubject(subject.id, {
                    name: form.name,
                    code: form.code,
                    term_id: parseInt(form.term_id),
                    module_count: parseInt(form.module_count) as 4 | 8,
                    strict_time_limit: form.strict_time_limit ? parseInt(form.strict_time_limit) : null
                });
                onSaved(); onClose();
            } catch (err: any) { setError(err.message); }
        });
    };

    const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-800 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all";

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-stone-800">Edit Subject</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Subject Name</label>
                            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Subject Code</label>
                            <input required type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputCls + " font-mono"} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Term</label>
                        <select required value={form.term_id} onChange={(e) => setForm({ ...form, term_id: e.target.value })} className={inputCls + " appearance-none"}>
                            {terms.map((t) => <option key={t.id} value={t.id}>{t.name}{t.assigned_batch ? ` — ${t.assigned_batch}` : ""}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Modules</label>
                            <select value={form.module_count} onChange={(e) => setForm({ ...form, module_count: e.target.value })} className={inputCls + " appearance-none"}>
                                <option value="4">4 Modules</option>
                                <option value="8">8 Modules</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Strict Time (min)</label>
                            <input type="number" value={form.strict_time_limit} onChange={(e) => setForm({ ...form, strict_time_limit: e.target.value })} placeholder="30" min={1} className={inputCls} />
                        </div>
                    </div>
                    <button type="submit" disabled={isPending} className="w-full py-3 bg-stone-800 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function CurriculumPage() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [editSubject, setEditSubject] = useState<Subject | null>(null);
    const [filterTermId, setFilterTermId] = useState<number | null>(null);
    const [, startTransition] = useTransition();

    const load = async () => {
        setLoading(true);
        const [t, s] = await Promise.all([getTerms(), getSubjects()]);
        setTerms(t); setSubjects(s); setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleToggleTerm = (term: Term) => {
        startTransition(async () => {
            await updateTerm(term.id, { is_active: !term.is_active });
            setTerms((prev) => prev.map((t) => t.id === term.id ? { ...t, is_active: !t.is_active } : t));
        });
    };

    const handleAssignBatch = (term: Term, batch: string | null) => {
        startTransition(async () => {
            await updateTerm(term.id, { assigned_batch: batch });
            setTerms((prev) => prev.map((t) => t.id === term.id ? { ...t, assigned_batch: batch } : t));
        });
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Delete this subject and all its notes and questions?")) return;
        await deleteSubject(id);
        setSubjects((prev) => prev.filter((s) => s.id !== id));
    };

    const filteredSubjects = filterTermId ? subjects.filter((s) => s.term_id === filterTermId) : subjects;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <BookOpen className="w-5 h-5 text-stone-400" />
                    <h1 className="text-2xl font-black text-stone-800 tracking-tight">Curriculum</h1>
                </div>
                <p className="text-sm font-bold text-stone-500">Manage academic terms, subjects, notes, and questions.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                </div>
            ) : (
                <>
                    {/* ── SECTION 1: Terms ── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Terms (1–9)</p>
                            <p className="text-[10px] font-bold text-stone-400">Toggle active · Assign batch</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {terms.map((term) => (
                                <TermCard key={term.id} term={term}
                                    subjectCount={subjects.filter((s) => s.term_id === term.id).length}
                                    onToggle={() => handleToggleTerm(term)}
                                    onAssignBatch={(batch) => handleAssignBatch(term, batch)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* ── SECTION 2: Subjects ── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                                Subjects ({filteredSubjects.length})
                            </p>
                            <div className="flex items-center gap-3">
                                <select value={filterTermId ?? ""} onChange={(e) => setFilterTermId(e.target.value ? parseInt(e.target.value) : null)}
                                    className="bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-stone-300 appearance-none">
                                    <option value="">All Terms</option>
                                    {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <button onClick={() => setShowAddSubject(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-sm">
                                    <Plus className="w-3.5 h-3.5" /> Add Subject
                                </button>
                            </div>
                        </div>

                        {filteredSubjects.length === 0 ? (
                            <div className="border-2 border-dashed border-stone-200 rounded-2xl py-16 text-center bg-white">
                                <Layers className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-stone-400">No subjects yet.</p>
                                <p className="text-xs font-bold text-stone-300 mt-1">Click "Add Subject" to get started.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
                                {filteredSubjects.map((subject, i) => {
                                    const term = terms.find((t) => t.id === subject.term_id);
                                    return (
                                        <div key={subject.id} className={`flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-all group ${i !== 0 ? "border-t border-stone-100" : ""}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-xs font-black text-stone-500 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200">
                                                    {subject.code}
                                                </span>
                                                <div>
                                                    <p className="font-black text-sm text-stone-800">{subject.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{term?.name}</span>
                                                        <span className="text-stone-300">·</span>
                                                        <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                                                            <Layers className="w-2.5 h-2.5" /> {subject.module_count} Modules
                                                        </span>
                                                        {subject.strict_time_limit && (<>
                                                            <span className="text-stone-300">·</span>
                                                            <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                                                                <Clock className="w-2.5 h-2.5" /> {subject.strict_time_limit}min
                                                            </span>
                                                        </>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => setEditSubject(subject)}
                                                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all" title="Edit">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteSubject(subject.id)}
                                                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <Link href={`/hq-admin/curriculum/${subject.id}`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-800 hover:bg-stone-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                                    Manage <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </>
            )}

            {showAddSubject && (
                <AddSubjectModal terms={terms} onClose={() => setShowAddSubject(false)} onSaved={load} />
            )}
            {editSubject && (
                <EditSubjectModal subject={editSubject} terms={terms} onClose={() => setEditSubject(null)} onSaved={load} />
            )}
        </div>
    );
}
