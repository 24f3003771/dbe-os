"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, AlertCircle, Trash2, Tag, Hash, Info } from "lucide-react";
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

                {/* AI Prompt Generator & ToC Info */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-black text-indigo-900 flex items-center gap-2">
                                🤖 AI Notes Generator
                            </h4>
                            <p className="text-xs font-bold text-indigo-600 mt-1 leading-relaxed">
                                Copy this prompt and paste it into ChatGPT/Claude along with your raw notes. It will automatically format them with beautiful HTML styles, examples, formulas, and mid-quizzes!
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                const prompt = `Act as an expert educational content creator. I will provide you with raw notes or text. You must convert it into a beautifully formatted Markdown file using HTML with inline CSS. Use the following exact styling guidelines:

CRITICAL INSTRUCTION: Generate the ENTIRE output as a single, continuous flow of text. DO NOT wrap your entire response in a master Markdown block. The HTML/Markdown notes, the \`\`\`quiz\`\`\` code blocks, and the \`\`\`checkpoint\`\`\` block must seamlessly flow together in one single response!

1. Length & Depth: The notes should neither be too brief nor exhaustively in-depth. Keep it at the sweet spot—concise enough to be highly readable, but deep enough to cover all crucial topics thoroughly.
2. Colors & Contrast (CRITICAL): USE PUNCHY, HIGH-CONTRAST COLORS. Do NOT use faded or overly pastel colors where text becomes unreadable. Ensure all text has excellent visibility against its background (e.g., use dark text like #1a1a1a or #2c3e50 on light backgrounds).
3. Module Title: \`<h1 style="color: #2c3e50; border-bottom: 2px solid #eef2f5; padding-bottom: 10px;">Module X — [Name]</h1>\`
4. Subtopics: \`<h2 style="color: #2980b9; margin-top: 30px;">X.X [Subtopic Name]</h2>\`
   (Note: The frontend automatically reads these <h2> tags to build the Table of Contents in the sidebar!)
5. Main Content Blocks: Wrap paragraphs in \`<div style="background-color: #ffffff; border: 1px solid #eef2f5; padding: 18px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); color: #333333;">...</div>\`
6. Important Quotes/Concepts: \`<div style="border: 3px dashed #1abc9c; padding: 15px; border-radius: 8px; text-align: center; font-size: 1.4em; color: #2c3e50; background-color: #f4fdfb; margin-bottom: 15px;"><strong style="color: #16a085;">[Text]</strong></div>\`
7. Easy Everyday Examples: \`<div style="border: 2px dashed #27ae60; padding: 18px; border-radius: 12px; background-color: #eafaf1; margin-bottom: 15px; color: #1f3f2d;">🍵 <strong style="color: #27ae60; font-size: 1.1em;">Easy Everyday Example: [Title]</strong><br><br>[Example text]</div>\` (Vary the border/text colors and emojis like #2980b9 for 📊, #8e44ad for 🏭, #d4ac0d for 🤝, #c0392b for 🚫, ensuring text remains readable).
7. Definition blocks: \`<div style="border-left: 4px solid #8e44ad; padding: 15px; background-color: #f4f6f7; margin-top: 10px; border-radius: 0 8px 8px 0;"><strong style="color: #8e44ad;">🧮 Definition:</strong><br><code style="font-size: 1.15em; color: #2c3e50; font-family: inherit;">[Definition Text]</code></div>\`
8. Formulas Block: Same as definition block, but with heading '🧮 The Math Formulas:'.
9. Lists: Use \`<ul style="list-style-type: none; padding-left: 15px; margin-top: 8px; margin-bottom: 15px;">\` and \`<li style="margin-bottom: 5px;">➤ [Item]</li>\`.
10. Mid-Quizzes: After each major topic section, seamlessly insert a 4-5 question Multiple Choice quiz using the EXACT following JSON format inside a Markdown code block with language "quiz" (this will be parsed into an interactive quiz on the frontend):
\`\`\`quiz
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation for the correct answer."
  }
]
\`\`\`
11. Progress Checkpoint: At the very end of the continuous notes document, append this EXACT JSON block inside a Markdown code block with language "checkpoint":
\`\`\`checkpoint
{
  "message": "🎉 You made it to the end!"
}
\`\`\`

Now, process the following raw notes into this seamless format:
[INSERT RAW NOTES HERE]`;
                                navigator.clipboard.writeText(prompt);
                                alert("Prompt copied to clipboard!");
                            }}
                            className="shrink-0 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                        >
                            Copy Prompt
                        </button>
                    </div>
                    <div className="pt-3 border-t border-indigo-100 flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                        <p className="text-xs font-bold text-indigo-500">
                            <strong>Note on Topics:</strong> You do NOT need to manually add topics below. The frontend sidebar Table of Contents is <strong>automatically generated</strong> from any <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-700">## Headings</code> in your markdown!
                        </p>
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
                        previewOptions={{
                            components: {
                                img: ({ src, alt, ...props }) => {
                                    let finalSrc = (src as string) || "";
                                    if (typeof finalSrc === "string" && finalSrc.includes("drive.google.com")) {
                                        const fileIdMatch = finalSrc.match(/\/(?:file\/d|folders)\/([^\/?]+)/) || finalSrc.match(/[?&]id=([^&]+)/);
                                        if (fileIdMatch && fileIdMatch[1]) {
                                            finalSrc = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
                                        }
                                    }
                                    return <img src={finalSrc} alt={alt} className="w-full h-auto rounded-xl shadow-sm border border-stone-200 my-4" {...props} />;
                                },
                                a: ({ href, children, ...props }) => {
                                    if (typeof href === "string" && href.includes("drive.google.com")) {
                                        const fileIdMatch = href.match(/\/(?:file\/d|folders)\/([^\/?]+)/) || href.match(/[?&]id=([^&]+)/);
                                        if (fileIdMatch && fileIdMatch[1]) {
                                            const finalSrc = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
                                            return <img src={finalSrc} alt="Google Drive Embedded Image" className="w-full h-auto rounded-xl shadow-sm border border-stone-200 my-4" />;
                                        }
                                    }
                                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline" {...props}>{children}</a>;
                                }
                            }
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
