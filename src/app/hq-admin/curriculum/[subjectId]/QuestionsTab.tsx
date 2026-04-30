"use client";

import { useState, useTransition } from "react";
import {
    Plus, Trash2, Loader2, X, Upload, CheckCircle2, AlertCircle,
    Filter, Pencil, Check
} from "lucide-react";
import { createQuestion, updateQuestion, deleteQuestion, bulkImportQuestions, createQuizSet, deleteQuizSet, getNoteForModule, type Question, type Subject, type Topic, type QuizSet } from "@/actions/curriculum";

const TYPE_LABELS: Record<string, string> = { cla: "CLA", midterm: "Midterm", practice: "Practice", exam: "Exam Set" };
const TYPE_COLORS: Record<string, string> = {
    cla: "bg-blue-50 text-blue-600 border-blue-200",
    midterm: "bg-purple-50 text-purple-600 border-purple-200",
    practice: "bg-emerald-50 text-emerald-600 border-emerald-200",
    exam: "bg-rose-50 text-rose-600 border-rose-200",
};

function QuestionRow({ q, onDelete, onUpdated, topics, subject, quizSets }: { q: Question; onDelete: () => void; onUpdated: (q: Question) => void; topics: Topic[]; subject: Subject; quizSets: QuizSet[] }) {
    const topic = topics.find((t) => t.id === q.topic_id);
    const setName = q.type === "exam" ? quizSets.find(s => s.id === q.quiz_set_id)?.name : null;
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <EditQuestionForm
                subject={subject}
                topics={topics}
                quizSets={quizSets}
                initial={q}
                onSaved={(updated) => { onUpdated(updated); setEditing(false); }}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="flex items-start justify-between bg-white border border-stone-200 rounded-2xl px-5 py-4 gap-4 group hover:bg-stone-50 transition-all">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${TYPE_COLORS[q.type]}`}>
                        {TYPE_LABELS[q.type]}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-stone-100 text-stone-500 border-stone-200">
                        {q.input_type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400">
                        Mod {q.module_from === q.module_to ? q.module_from : `${q.module_from}–${q.module_to}`}
                    </span>
                    {topic && <span className="text-[10px] font-bold text-stone-400"># {topic.name}</span>}
                    {q.type === "exam" && setName && (
                        <span className="text-[10px] font-bold text-rose-600">
                            {setName}
                        </span>
                    )}
                </div>
                <p className="text-sm font-bold text-stone-800 leading-relaxed line-clamp-2">{q.question}</p>
                {q.input_type === "mcq" && q.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {q.options.map((opt, i) => (
                            <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${i === q.correct_index ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
                                {String.fromCharCode(65 + i)}. {opt}
                            </span>
                        ))}
                    </div>
                )}
                {q.input_type === "text" && q.word_limit && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg">
                        <span className="text-[10px] font-bold text-stone-500">Word Limit: {q.word_limit}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <button
                    onClick={() => setEditing(true)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                    title="Edit"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

function EditQuestionForm({ subject, topics, quizSets, initial, onSaved, onCancel }: {
    subject: Subject; topics: Topic[]; quizSets: QuizSet[]; initial: Question; onSaved: (q: Question) => void; onCancel: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        type: initial.type,
        input_type: initial.input_type,
        module_from: String(initial.module_from),
        module_to: String(initial.module_to),
        topic_id: initial.topic_id ?? "",
        quiz_set_id: initial.quiz_set_id ?? "",
        question: initial.question,
        options: initial.options ?? ["", "", "", ""],
        correct_index: initial.correct_index ?? 0,
        explanation: (initial as any).explanation ?? "",
        word_limit: initial.word_limit ? String(initial.word_limit) : "",
    });

    const mods = Array.from({ length: subject.module_count }, (_, i) => i + 1);
    const isRange = form.type === "midterm" || form.type === "exam";
    const setOption = (i: number, val: string) => { const opts = [...form.options]; opts[i] = val; setForm({ ...form, options: opts }); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError(null);
        startTransition(async () => {
            try {
                const data: Omit<Question, "id" | "subject_id" | "created_at"> = {
                    type: form.type, input_type: form.input_type,
                    module_from: parseInt(form.module_from), module_to: parseInt(form.module_to),
                    topic_id: form.topic_id || null,
                    quiz_set_id: form.type === "exam" ? (form.quiz_set_id || null) : null,
                    question: form.question,
                    options: form.input_type === "mcq" ? form.options : null,
                    correct_index: form.input_type === "mcq" ? form.correct_index : null,
                    explanation: form.explanation || null,
                    word_limit: form.input_type === "text" && form.word_limit ? parseInt(form.word_limit) : null,
                } as any;
                await updateQuestion(initial.id, subject.id, data);
                onSaved({ ...data, id: initial.id, subject_id: initial.subject_id, created_at: initial.created_at });
            } catch (err: any) { setError(err.message); }
        });
    };

    const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-800 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all";
    const selectCls = inputCls + " appearance-none";

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-black text-stone-800">Edit Question</p>
                <button onClick={onCancel} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Type</label>
                        <select value={form.type} onChange={(e) => { const v = e.target.value as Question["type"]; setForm({ ...form, type: v, module_to: (v === "cla" || v === "practice") ? form.module_from : form.module_to }); }} className={selectCls}>
                            {["cla", "midterm", "exam", "practice"].map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Input</label>
                        <select value={form.input_type} onChange={(e) => setForm({ ...form, input_type: e.target.value as Question["input_type"] })} className={selectCls}>
                            <option value="mcq">MCQ</option><option value="text">Text</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">{isRange ? "Mod From" : "Module"}</label>
                        <select value={form.module_from} onChange={(e) => setForm({ ...form, module_from: e.target.value, module_to: isRange ? form.module_to : e.target.value })} className={selectCls}>
                            {mods.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    {isRange && (
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Mod To</label>
                            <select value={form.module_to} onChange={(e) => setForm({ ...form, module_to: e.target.value })} className={selectCls}>
                                {mods.filter((m) => m >= parseInt(form.module_from)).map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                {form.input_type === "text" && (
                    <div><label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Word Limit</label><input type="number" value={form.word_limit} onChange={(e) => setForm({ ...form, word_limit: e.target.value })} placeholder="250" className={inputCls} /></div>
                )}
                {form.type === "exam" && (
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Exam Set*</label>
                        <select required value={form.quiz_set_id} onChange={(e) => setForm({ ...form, quiz_set_id: e.target.value })} className={selectCls}>
                            <option value="">Select an exam set...</option>
                            {quizSets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                )}
                {topics.length > 0 && (
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Topic</label>
                        <select value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })} className={selectCls + " w-56"}>
                            <option value="">No topic</option>
                            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                )}
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Question*</label>
                    <textarea required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={3} className={inputCls + " resize-none"} />
                </div>
                {form.input_type === "mcq" && (
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block">Options (click circle = correct)</label>
                        {form.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <button type="button" onClick={() => setForm({ ...form, correct_index: i })} className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${form.correct_index === i ? "bg-emerald-500 border-emerald-500" : "border-stone-300"}`} />
                                <span className="text-xs font-black text-stone-400 w-4">{String.fromCharCode(65 + i)}.</span>
                                <input type="text" required value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} className={inputCls} />
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Explanation</label>
                    <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} className={inputCls + " resize-none"} />
                </div>
                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Cancel</button>
                    <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-stone-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
}

function AddQuestionForm({ subject, topics, quizSets, onSaved, onCancel }: {
    subject: Subject; topics: Topic[]; quizSets: QuizSet[]; onSaved: (q: Question) => void; onCancel: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        type: "cla" as Question["type"],
        input_type: "mcq" as Question["input_type"],
        module_from: "1", module_to: "1",
        topic_id: "", question: "",
        quiz_set_id: "",
        options: ["", "", "", ""],
        correct_index: 0,
        explanation: "",
        word_limit: "",
    });

    const mods = Array.from({ length: subject.module_count }, (_, i) => i + 1);
    const isRange = form.type === "midterm" || form.type === "exam";

    const setOption = (i: number, val: string) => {
        const opts = [...form.options]; opts[i] = val; setForm({ ...form, options: opts });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError(null);
        startTransition(async () => {
            try {
                const data: Omit<Question, "id" | "subject_id" | "created_at"> = {
                    type: form.type, input_type: form.input_type,
                    module_from: parseInt(form.module_from), module_to: parseInt(form.module_to),
                    topic_id: form.topic_id || null,
                    quiz_set_id: form.type === "exam" ? (form.quiz_set_id || null) : null,
                    question: form.question,
                    options: form.input_type === "mcq" ? form.options : null,
                    correct_index: form.input_type === "mcq" ? form.correct_index : null,
                    explanation: form.explanation || null,
                    word_limit: form.input_type === "text" && form.word_limit ? parseInt(form.word_limit) : null,
                } as any;
                await createQuestion(subject.id, data);
                onSaved({ ...data, id: "", subject_id: subject.id, created_at: "" });
            } catch (err: any) { setError(err.message); }
        });
    };

    const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-800 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all";
    const selectCls = inputCls + " appearance-none";

    return (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-black text-stone-800">Add Question</p>
                <button onClick={onCancel} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Type + Input Type + Modules */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Type</label>
                        <select value={form.type} onChange={(e) => { const v = e.target.value as Question["type"]; const same = v === "cla" || v === "practice"; setForm({ ...form, type: v, module_to: same ? form.module_from : form.module_to }); }} className={selectCls}>
                            {["cla", "midterm", "exam", "practice"].map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Input</label>
                        <select value={form.input_type} onChange={(e) => setForm({ ...form, input_type: e.target.value as Question["input_type"] })} className={selectCls}>
                            <option value="mcq">MCQ</option><option value="text">Text</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">{isRange ? "Mod From" : "Module"}</label>
                        <select value={form.module_from} onChange={(e) => setForm({ ...form, module_from: e.target.value, module_to: isRange ? form.module_to : e.target.value })} className={selectCls}>
                            {mods.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    {isRange && (
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Mod To</label>
                            <select value={form.module_to} onChange={(e) => setForm({ ...form, module_to: e.target.value })} className={selectCls}>
                                {mods.filter((m) => m >= parseInt(form.module_from)).map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Text fields */}
                {form.input_type === "text" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Word Limit (Optional)</label><input type="number" placeholder="250" value={form.word_limit} onChange={(e) => setForm({ ...form, word_limit: e.target.value })} className={inputCls} /></div>
                    </div>
                )}

                {/* Exam Set field */}
                {form.type === "exam" && (
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Exam Set*</label>
                        <select required value={form.quiz_set_id} onChange={(e) => setForm({ ...form, quiz_set_id: e.target.value })} className={selectCls}>
                            <option value="">Select an exam set...</option>
                            {quizSets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                )}

                {/* Topic */}
                {topics.length > 0 && (
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Topic (optional)</label>
                        <select value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })} className={selectCls + " w-56"}>
                            <option value="">No topic</option>
                            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                )}

                {/* Question */}
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Question*</label>
                    <textarea required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={3} placeholder="Enter question text..." className={inputCls + " resize-none"} />
                </div>

                {/* MCQ Options */}
                {form.input_type === "mcq" && (
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block">Options (click circle to mark correct)</label>
                        {form.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <button type="button" onClick={() => setForm({ ...form, correct_index: i })}
                                    className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${form.correct_index === i ? "bg-emerald-500 border-emerald-500" : "border-stone-300 hover:border-stone-400"}`} />
                                <span className="text-xs font-black text-stone-400 w-4">{String.fromCharCode(65 + i)}.</span>
                                <input type="text" required value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} className={inputCls} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Explanation */}
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Explanation (optional)</label>
                    <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Explain the correct answer..." className={inputCls + " resize-none"} />
                </div>

                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Cancel</button>
                    <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Question"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function AiImportModal({ subject, topics, onClose, onGenerate }: { subject: Subject; topics: Topic[]; onClose: () => void; onGenerate: (json: string) => void }) {
    const [moduleNum, setModuleNum] = useState("1");
    const [numQs, setNumQs] = useState("5");
    const [difficulty, setDifficulty] = useState("Medium");
    const [qType, setQType] = useState<"both" | "mcq" | "text">("both");
    const [topicId, setTopicId] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [pastedJson, setPastedJson] = useState("");

    const handleGeneratePrompt = async () => {
        setIsPending(true);
        setError("");
        try {
            const noteObj = await getNoteForModule(subject.id, parseInt(moduleNum));
            const notes = noteObj?.content;
            if (!notes) throw new Error(`No notes found for Module ${moduleNum}.`);

            let typeConstraints = `- Generate a mix of "mcq" and "text" questions.`;
            if (qType === "mcq") typeConstraints = `- Generate ONLY "mcq" questions.`;
            if (qType === "text") typeConstraints = `- Generate ONLY "text" questions.`;

            const topicField = topicId ? `\n    "topic_id": "${topicId}",` : "";
            const topicConstraint = topicId ? `- topic_id MUST exactly match "${topicId}".` : `- Do NOT include a topic_id field.`;

            const promptStr = `You are an expert curriculum designer. Your task is to generate EXACTLY ${numQs} questions based ON THE PROVIDED NOTES.
Difficulty Level: ${difficulty}

You MUST output a raw, valid JSON array. DO NOT wrap the output in markdown code blocks like \`\`\`json. DO NOT add any conversational text.

The JSON MUST follow this strict format:
[
  {
    "type": "practice",
    "input_type": "${qType === "both" ? "mcq" : qType}", // "mcq" or "text"
    "module_from": ${moduleNum},
    "module_to": ${moduleNum},${topicField}
    "question": "Question text here?",
    "options": ["Opt A", "Opt B", "Opt C", "Opt D"], // Omit if input_type is "text"
    "correct_index": 0, // Omit if input_type is "text"
    "explanation": "Explanation here",
    "word_limit": 250 // Include ONLY if input_type is "text"
  }
]

Constraints:
- type MUST be "practice".
${typeConstraints}
${topicConstraint}
- For MCQ, options must have exactly 4 items, and correct_index must be 0, 1, 2, or 3.
- Output MUST be valid JSON, parsing with JSON.parse() must succeed.

Here are the notes:

${notes}`;

            setGeneratedPrompt(promptStr);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    if (generatedPrompt) {
        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-4xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-black text-stone-800">✨ AI Prompt Generator</p>
                        <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">1. Copy this Prompt</p>
                                <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[10px] font-bold transition-all">Copy to Clipboard</button>
                            </div>
                            <textarea readOnly value={generatedPrompt} className="w-full h-[400px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs font-mono text-stone-600 outline-none resize-none" />
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">2. Paste LLM JSON Result</p>
                            <textarea 
                                value={pastedJson} 
                                onChange={(e) => setPastedJson(e.target.value)} 
                                placeholder="Paste the exact JSON output here..."
                                className="w-full h-[400px] bg-white border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-3 text-xs font-mono text-stone-700 outline-none resize-none transition-all" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setGeneratedPrompt(null)} className="px-5 py-3 bg-white border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Back</button>
                        <button onClick={() => onGenerate(pastedJson)} disabled={!pastedJson.trim()} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                            Import to Bulk Importer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-stone-800">✨ AI Prompt Generator</p>
                    <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Module</label>
                        <select value={moduleNum} onChange={(e) => setModuleNum(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            {Array.from({ length: subject.module_count }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Module {m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Question Type</label>
                        <select value={qType} onChange={(e) => setQType(e.target.value as any)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            <option value="both">Both (MCQ & Text)</option>
                            <option value="mcq">MCQ Only</option>
                            <option value="text">Subjective (Text) Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Topic</label>
                        <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            <option value="">None</option>
                            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Number of Questions</label>
                        <input type="number" min="1" max="50" value={numQs} onChange={(e) => setNumQs(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300" />
                    </div>
                    {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Cancel</button>
                    <button onClick={handleGeneratePrompt} disabled={isPending} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Prompt"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function BulkImportModal({ subject, topics, quizSets, onDone, onClose, initialJson = "" }: { subject: Subject; topics: Topic[]; quizSets: QuizSet[]; onDone: () => void; onClose: () => void; initialJson?: string }) {
    const [json, setJson] = useState(initialJson);
    const [topicId, setTopicId] = useState("");
    const [quizSetId, setQuizSetId] = useState("");
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success: boolean; imported: number; errors: string[] } | null>(null);

    // Apply real-time transforms to the JSON textarea
    const applyOverrides = (rawJson: string, newTopicId: string, newQuizSetId: string) => {
        try {
            const parsed = JSON.parse(rawJson);
            if (!Array.isArray(parsed)) return rawJson;
            const updated = parsed.map((q: any) => {
                const out = { ...q };
                // If exam set selected, force type to exam and inject quiz_set_id
                if (newQuizSetId) {
                    out.type = "exam";
                    out.quiz_set_id = newQuizSetId;
                } else {
                    // If cleared, remove quiz_set_id if it was auto-injected
                    delete out.quiz_set_id;
                    if (out.type === "exam" && !q.quiz_set_id) out.type = q.type || "practice";
                }
                // Apply topic override
                if (newTopicId) out.topic_id = newTopicId;
                else delete out.topic_id;
                return out;
            });
            return JSON.stringify(updated, null, 2);
        } catch {
            return rawJson; // Invalid JSON — leave untouched
        }
    };

    const handleQuizSetChange = (val: string) => {
        setQuizSetId(val);
        setJson(prev => applyOverrides(prev, topicId, val));
    };

    const handleTopicChange = (val: string) => {
        setTopicId(val);
        setJson(prev => applyOverrides(prev, val, quizSetId));
    };

    const handle = () => startTransition(async () => {
        const r = await bulkImportQuestions(subject.id, json, topicId || undefined, quizSetId || undefined);
        setResult(r);
        if (r.success) { onDone(); setTimeout(onClose, 1500); }
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-2xl shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-stone-800">Bulk Import Questions</p>
                    <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500">Paste a JSON array of questions. Subject is inferred from context.</p>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Detailed JSON Examples</p>
                        <pre className="text-[10px] font-mono text-stone-600 overflow-x-auto overflow-y-auto max-h-48 whitespace-pre-wrap">
{`[
  {
    "type": "cla", // Purpose: Defines the exam category. Options: "cla", "midterm", "exam", "practice" (AI)
    "input_type": "mcq", // Purpose: Determines answer format. "mcq" (Multiple Choice) or "text" (Subjective typing)
    "module_from": 1, // Purpose: The starting module number this question belongs to.
    "module_to": 1, // Purpose: The ending module number. Use if a question spans multiple modules (e.g., 1 to 4).
    "question": "Question text...", // Purpose: The actual question displayed to the student.
    "options": ["A", "B", "C", "D"], // Purpose: The choices for MCQ. MUST be omitted if input_type is "text".
    "correct_index": 0, // Purpose: The 0-based index of the correct option (0=A, 1=B, 2=C, 3=D). Omit for "text".
    "explanation": "Optional explanation text", // Purpose: Shown after answering to help the student learn.
    "quiz_set_id": "UUID-string", // Purpose: The dynamic exam set ID. Required ONLY if type is "exam".
    "word_limit": 250, // Purpose: The maximum allowed words for subjective answers. Required if input_type is "text".
    "topic_id": "UUID-string" // Purpose: Optional topic UUID. Must match an existing topic.
  }
]`}
                        </pre>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Override / Default Topic</label>
                        <select value={topicId} onChange={(e) => handleTopicChange(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            <option value="">None</option>
                            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Override Exam Set <span className="text-rose-500">(forces type:exam)</span></label>
                        <select value={quizSetId} onChange={(e) => handleQuizSetChange(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-red-300">
                            <option value="">None</option>
                            {quizSets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
                <textarea value={json} onChange={(e) => { setJson(e.target.value); setResult(null); }} rows={10}
                    placeholder={'[\n  {\n    "type": "cla",\n    "input_type": "mcq",\n    "module_from": 1,\n    "module_to": 1,\n    "question": "...",\n    "options": ["A","B","C","D"],\n    "correct_index": 0\n  }\n]'}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs font-mono text-stone-700 placeholder:text-stone-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 resize-none"
                />
                {result && (
                    <div className={`p-4 rounded-xl border text-xs font-bold space-y-1 ${result.success ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"}`}>
                        {result.success ? <p>✓ Imported {result.imported} questions successfully</p> : (
                            <>{result.errors.map((e, i) => <p key={i}>• {e}</p>)}</>
                        )}
                    </div>
                )}
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-all">Cancel</button>
                    <button onClick={handle} disabled={isPending || !json.trim()} className="flex-1 py-2.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-3.5 h-3.5" />Import</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function QuestionsTab({ subject, initialQuestions, topics, initialQuizSets }: {
    subject: Subject; initialQuestions: Question[]; topics: Topic[]; initialQuizSets: QuizSet[];
}) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [quizSets, setQuizSets] = useState<QuizSet[]>(initialQuizSets);
    const [showAdd, setShowAdd] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const [showAiImport, setShowAiImport] = useState(false);
    const [aiJson, setAiJson] = useState("");
    const [filterType, setFilterType] = useState("");

    const filtered = filterType ? questions.filter((q) => q.type === filterType) : questions;

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this question?")) return;
        await deleteQuestion(id, subject.id);
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    return (
        <div className="space-y-5">
            {/* Exam Sets Manager */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-black text-stone-800 tracking-tight">Exam Sets</h3>
                        <p className="text-xs font-bold text-stone-400">Manage dynamic tags for Exam Mode (e.g., Mock-1, PYQ Aug 2024)</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {quizSets.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 group">
                            <span className="text-xs font-bold text-stone-700">{s.name}</span>
                            <button onClick={async () => {
                                if (!confirm("Delete this set? Any questions in this set will lose their set assignment.")) return;
                                await deleteQuizSet(s.id, subject.id);
                                setQuizSets(prev => prev.filter(x => x.id !== s.id));
                            }} className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-all">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    <button onClick={async () => {
                        const name = prompt("Enter Exam Set Name (e.g., Mock-1):");
                        if (!name) return;
                        try {
                            const newSet = await createQuizSet(subject.id, name);
                            setQuizSets(prev => [...prev, newSet]);
                        } catch (err: any) { alert(err.message); }
                    }} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-stone-300 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-bold transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Set
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-stone-400" />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-red-300 appearance-none">
                        <option value="">All Types</option>
                        {["cla", "midterm", "exam", "practice"].map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                    </select>
                    <span className="text-xs font-bold text-stone-400">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowAiImport(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-200 text-purple-700 hover:bg-purple-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                        ✨ AI Import
                    </button>
                    <button onClick={() => setShowBulk(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 hover:text-stone-800 hover:bg-stone-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                        <Upload className="w-3.5 h-3.5" /> Bulk Import
                    </button>
                    <button onClick={() => setShowAdd((v) => !v)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                </div>
            </div>

            {showAdd && (
                <AddQuestionForm subject={subject} topics={topics} quizSets={quizSets}
                    onSaved={(q) => { setQuestions((prev) => [q, ...prev]); setShowAdd(false); }}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {filtered.length === 0 ? (
                <div className="border-2 border-dashed border-stone-200 rounded-2xl py-16 text-center bg-white">
                    <p className="text-sm font-bold text-stone-400">No questions {filterType ? `for type "${TYPE_LABELS[filterType]}"` : "yet"}.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((q) => (
                        <QuestionRow key={q.id} q={q} topics={topics} subject={subject} quizSets={quizSets}
                            onDelete={() => handleDelete(q.id)}
                            onUpdated={(updated) => setQuestions((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
                        />
                    ))}
                </div>
            )}

            {showAiImport && (
                <AiImportModal subject={subject} topics={topics} onClose={() => setShowAiImport(false)} onGenerate={(j) => {
                    setAiJson(j);
                    setShowAiImport(false);
                    setShowBulk(true);
                }} />
            )}

            {showBulk && (
                <BulkImportModal subject={subject} topics={topics} quizSets={quizSets} onDone={async () => { const { getQuestions } = await import("@/actions/curriculum"); const qs = await getQuestions(subject.id); setQuestions(qs); setShowBulk(false); }} onClose={() => setShowBulk(false)} initialJson={aiJson} />
            )}
        </div>
    );
}
