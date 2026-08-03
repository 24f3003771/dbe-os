"use client";

import { useState, useTransition } from "react";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import type { Subject, Topic, QuizSet, Lecture, Question } from "@/actions/curriculum";

export function CreationHub({ subject, topics, quizSets, lectures, onClose, onManualSave, onBulkImportDone, AddQuestionForm }: { 
    subject: Subject; topics: Topic[]; quizSets: QuizSet[]; lectures: Lecture[]; onClose: () => void; onManualSave: (q: Question) => void; onBulkImportDone: (qs: Question[]) => void; AddQuestionForm: React.ComponentType<any>;
}) {
    const [tab, setTab] = useState<"module" | "lecture" | "concept" | "exam">("module");
    const [method, setMethod] = useState<"ai" | "manual">("ai");

    // "Module Wise" state
    const [moduleNum, setModuleNum] = useState("1");
    const [questionCount, setQuestionCount] = useState("10");
    const [difficulty, setDifficulty] = useState("Mixed");
    const [notesCopied, setNotesCopied] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [json, setJson] = useState("");
    const [isImporting, startTransition] = useTransition();
    const [importResult, setImportResult] = useState<{ success: boolean; imported: number; errors: string[] } | null>(null);

    const handleCopyNotes = async () => {
        try {
            const { getNoteForModule } = await import("@/actions/curriculum");
            const noteObj = await getNoteForModule(subject.id, parseInt(moduleNum));
            if (!noteObj?.content) throw new Error(`No notes found for Module ${moduleNum}.`);
            await navigator.clipboard.writeText(noteObj.content);
            setNotesCopied(true);
            setTimeout(() => setNotesCopied(false), 3000);
        } catch (err: any) { alert(err.message); }
    };

    const handleCopyPrompt = async () => {
        const diffInstruction = difficulty === "Mixed"
            ? `Mixed difficulty: assign "easy", "medium", or "hard" to each question based on complexity.`
            : `All questions must be ${difficulty} difficulty. Set "difficulty": "${difficulty.toLowerCase()}" on each.`;
        
        const promptStr = `You are an expert curriculum designer. Generate EXACTLY ${questionCount} practice questions for Module ${moduleNum}.

Difficulty: ${diffInstruction}

You MUST output a raw, valid JSON array. DO NOT wrap in markdown code blocks. DO NOT add conversational text.

The JSON MUST follow this strict format:
[
  {
    "type": "practice",
    "input_type": "mcq",
    "module_from": ${moduleNum},
    "module_to": ${moduleNum},
    "difficulty": "easy",
    "question": "Question text here?",
    "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
    "correct_index": 0,
    "explanation": "Explanation here"
  }
]

Constraints:
- type MUST be "practice".
- input_type MUST be "mcq".
- difficulty field is REQUIRED for every question.
- Options must have exactly 4 items, correct_index 0–3.
- Output MUST be valid JSON. No extra text.

[PASTE MODULE NOTES BELOW THIS LINE]`;
        await navigator.clipboard.writeText(promptStr);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 3000);
    };

    const handleImport = () => {
        startTransition(async () => {
            const { bulkImportQuestions, getQuestions } = await import("@/actions/curriculum");
            const res = await bulkImportQuestions(subject.id, json);
            setImportResult(res);
            if (res.success) {
                const qs = await getQuestions(subject.id);
                onBulkImportDone(qs);
                setTimeout(onClose, 2000); // Close after showing success
            }
        });
    };

    const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all";
    const selectCls = inputCls + " appearance-none";

    return (
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm mb-6">
            {/* Tabs Header */}
            <div className="flex items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 overflow-x-auto">
                {[
                    { id: "module", label: "Module Wise" },
                    { id: "lecture", label: "Lecture Wise" },
                    { id: "concept", label: "Concept Builder" },
                    { id: "exam", label: "PYQ / Mock" }
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as any)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${tab === t.id ? "bg-white text-stone-800 shadow-sm border border-stone-200" : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"}`}
                    >
                        {t.label}
                    </button>
                ))}
                <div className="flex-1 min-w-[20px]" />
                <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-xl transition-all"><X className="w-4 h-4" /></button>
            </div>

            {/* Method Toggle */}
            <div className="px-6 py-4 border-b border-stone-100 bg-white">
                <div className="inline-flex bg-stone-100 p-1 rounded-xl">
                    <button onClick={() => setMethod("ai")} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${method === "ai" ? "bg-white text-purple-700 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>✨ AI Prompt Generation</button>
                    <button onClick={() => setMethod("manual")} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${method === "manual" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>✍️ Manual Add</button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 bg-stone-50/50">
                {method === "manual" ? (
                    <div className="max-w-3xl mx-auto">
                        <AddQuestionForm subject={subject} topics={topics} quizSets={quizSets} onSaved={onManualSave} onCancel={onClose} />
                    </div>
                ) : (
                    <div>
                        {tab === "module" && (
                            <div className="max-w-2xl mx-auto space-y-6">
                                {step === 1 ? (
                                    <div className="animate-in fade-in duration-300 space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Module</label>
                                                <select value={moduleNum} onChange={(e) => setModuleNum(e.target.value)} className={selectCls}>
                                                    {Array.from({ length: subject.module_count }, (_, i) => i + 1).map(m => (
                                                        <option key={m} value={m}>Module {m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">No. of Questions</label>
                                                <input type="number" min="1" max="50" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} className={inputCls} />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 block mb-1">Difficulty</label>
                                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectCls}>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                    <option value="Mixed">Mixed</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between">
                                                <div>
                                                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-sm mb-3">1</div>
                                                    <p className="font-black text-stone-800">Copy AI Prompt</p>
                                                    <p className="text-xs text-stone-500 font-medium">Includes JSON structure & instructions</p>
                                                </div>
                                                <button onClick={handleCopyPrompt} className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-4 ${promptCopied ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-inner" : "bg-stone-100 hover:bg-stone-200 text-stone-600 border border-transparent"}`}>
                                                    {promptCopied ? "✓ Copied!" : "Copy Prompt"}
                                                </button>
                                            </div>
                                            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
                                                <div>
                                                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm mb-3">2</div>
                                                    <p className="font-black text-stone-800">Copy Module Notes</p>
                                                    <p className="text-xs text-stone-500 font-medium">The source text for question generation</p>
                                                </div>
                                                <button onClick={handleCopyNotes} className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-4 ${notesCopied ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-inner" : "bg-stone-100 hover:bg-stone-200 text-stone-600 border border-transparent"}`}>
                                                    {notesCopied ? "✓ Copied!" : "Copy Notes"}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end pt-2">
                                            <button onClick={() => setStep(2)} className="px-8 py-3 bg-stone-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-stone-900 transition-all shadow-lg hover:-translate-y-0.5">
                                                Paste JSON Output →
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <button onClick={() => setStep(1)} className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-500 transition-all"><X className="w-4 h-4" /></button>
                                            <p className="font-black text-stone-800">Paste AI Output</p>
                                        </div>
                                        <textarea
                                            value={json}
                                            onChange={(e) => { setJson(e.target.value); setImportResult(null); }}
                                            rows={12}
                                            placeholder="Paste the raw JSON array here..."
                                            className="w-full bg-white border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-2xl px-4 py-4 text-xs font-mono text-stone-700 outline-none resize-none shadow-inner"
                                        />
                                        {importResult && (
                                            <div className={`p-4 rounded-xl border text-xs font-bold space-y-1 ${importResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"}`}>
                                                {importResult.success ? (
                                                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Imported {importResult.imported} questions successfully.</div>
                                                ) : (
                                                    <>{importResult.errors.map((e, i) => <p key={i}>• {e}</p>)}</>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex justify-end pt-2">
                                            <button onClick={handleImport} disabled={!json.trim() || isImporting || importResult?.success} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                                                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Import Questions</>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {tab !== "module" && (
                            <div className="text-center py-16 border-2 border-dashed border-stone-200 rounded-3xl bg-white">
                                <p className="text-sm font-black text-stone-400 uppercase tracking-widest">{tab} workflow coming soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
