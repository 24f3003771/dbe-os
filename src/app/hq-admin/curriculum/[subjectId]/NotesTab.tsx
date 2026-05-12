"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, AlertCircle, Trash2, Tag, Hash } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { upsertNote, deleteNote, type Note, type Subject, type Topic } from "@/actions/curriculum";

const specialModules = [
    { id: 98, label: "Formula Sheet" },
    { id: 99, label: "Mind Maps" }
];

export default function NotesTab({
    subject,
    initialNotes,
    topics,
}: {
    subject: Subject;
    initialNotes: Note[];
    topics: Topic[];
}) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [selectedModule, setSelectedModule] = useState<number>(1);
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

    const activeNote = notes.find((n) => n.module_number === selectedModule);
    const [content, setContent] = useState(activeNote?.content ?? "");
    const [selectedTopicId, setSelectedTopicId] = useState<string>(activeNote?.topic_id ?? "");

    const handleModuleSelect = (mod: number) => {
        setSelectedModule(mod);
        const note = notes.find((n) => n.module_number === mod);
        setContent(note?.content ?? "");
        setSelectedTopicId(note?.topic_id ?? "");
        setStatus("idle");
    };

    const handleSave = () => {
        setStatus("idle");
        startTransition(async () => {
            try {
                await upsertNote(subject.id, selectedModule, {
                    content,
                    topic_id: selectedTopicId || null,
                });
                setNotes((prev) => {
                    const exists = prev.find((n) => n.module_number === selectedModule);
                    if (exists) {
                        return prev.map((n) =>
                            n.module_number === selectedModule
                                ? { ...n, content, topic_id: selectedTopicId || null, updated_at: new Date().toISOString() }
                                : n
                        );
                    }
                    return [...prev, { id: "", subject_id: subject.id, module_number: selectedModule, content, topic_id: selectedTopicId || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
                });
                setStatus("saved");
            } catch {
                setStatus("error");
            }
        });
    };

    const handleDelete = async () => {
        if (!activeNote) return;
        if (!confirm(`Delete notes for Module ${selectedModule}? This cannot be undone.`)) return;
        setIsDeleting(true);
        try {
            await deleteNote(subject.id, selectedModule);
            setNotes((prev) => prev.filter((n) => n.module_number !== selectedModule));
            setContent("");
            setSelectedTopicId("");
            setStatus("idle");
        } catch {
            alert("Failed to delete note.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-6">
            {/* Module List */}
            <div className="w-44 shrink-0 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 px-2 mb-3">Modules</p>
                {Array.from({ length: subject.module_count }, (_, i) => i + 1).map((mod) => {
                    const hasNote = notes.some((n) => n.module_number === mod);
                    return (
                        <button
                            key={mod}
                            onClick={() => handleModuleSelect(mod)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                selectedModule === mod
                                    ? "bg-stone-100 border border-stone-200 text-stone-800"
                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                            }`}
                        >
                            <span>Module {mod}</span>
                            {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        </button>
                    );
                })}

                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 px-2 mb-3 mt-6">Special Resources</p>
                {specialModules.map((special) => {
                    const mod = special.id;
                    const hasNote = notes.some((n) => n.module_number === mod);
                    return (
                        <button
                            key={mod}
                            onClick={() => handleModuleSelect(mod)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                selectedModule === mod
                                    ? "bg-stone-100 border border-stone-200 text-stone-800"
                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                            }`}
                        >
                            <span>{special.label}</span>
                            {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        </button>
                    );
                })}
            </div>

            {/* Editor */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <p className="text-sm font-black text-stone-800">
                            {selectedModule === 98 ? "Formula Sheet" : selectedModule === 99 ? "Mind Maps" : `Module ${selectedModule}`}
                        </p>
                        <p className="text-xs font-bold text-stone-400">
                            {activeNote
                                ? `Last updated ${new Date(activeNote.updated_at).toLocaleDateString()}`
                                : "No note yet — add one below"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {status === "saved" && (
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                            </span>
                        )}
                        {status === "error" && (
                            <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                <AlertCircle className="w-3.5 h-3.5" /> Error
                            </span>
                        )}
                        {activeNote && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                Delete
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isPending || !content.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-40 shadow-sm"
                        >
                            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Note"}
                        </button>
                    </div>
                </div>

                {/* Topic selector */}
                {topics.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-stone-400" />
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Topic</label>
                        <select
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            className="bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-red-300 appearance-none"
                        >
                            <option value="">None</option>
                            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                )}

                {/* Markdown Editor */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
                    <MDEditor
                        value={content}
                        onChange={(val) => { setContent(val ?? ""); setStatus("idle"); }}
                        height={600}
                        preview="edit"
                        onPaste={async (event) => {
                            const items = event.clipboardData.items;
                            for (const item of items) {
                                if (item.type.indexOf("image") !== -1) {
                                    event.preventDefault();
                                    const file = item.getAsFile();
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const res = await fetch("/api/upload", {
                                                method: "POST",
                                                body: formData,
                                            });
                                            const data = await res.json();
                                            if (data.url) {
                                                const insertion = `\n![Image](${data.url})\n`;
                                                setContent(prev => prev + insertion);
                                            }
                                        } catch (err) {
                                            console.error("Image upload failed", err);
                                            alert("Failed to upload image from clipboard.");
                                        }
                                    }
                                }
                            }
                        }}
                        textareaProps={{
                            placeholder: `# ${selectedModule === 98 ? "Formula Sheet" : selectedModule === 99 ? "Mind Maps" : `Module ${selectedModule}`}\n\nPaste your markdown notes here or drag & drop images...`
                        }}
                        className="!shadow-none border-none"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-stone-400">{content.length} characters · Markdown supported</p>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
                            <Hash className="w-3 h-3" />
                            <span>Upload Image</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const res = await fetch("/api/upload", {
                                                method: "POST",
                                                body: formData,
                                            });
                                            const data = await res.json();
                                            if (data.url) {
                                                const insertion = `\n![Image](${data.url})\n`;
                                                setContent(prev => prev + insertion);
                                            }
                                        } catch (err) {
                                            alert("Upload failed.");
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
