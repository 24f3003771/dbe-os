"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    ChevronLeft,
    ThumbsUp,
    User,
    Clock,
    BookOpen,
    Trash2,
    PenTool
} from "lucide-react";
import Link from "next/link";
import { Kalam } from "next/font/google";
import { getAllSubjects } from "@/data/db";
import DrawingOverlay from "@/components/DrawingOverlay";
import PdfExportButton from "@/components/PdfExportButton";
import LoadingScreen from "@/components/LoadingScreen";

const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin"] });

interface NoteData {
    id: string;
    title: string;
    content: string;
    subject: string;
    author: string;
    upvotes: number;
    createdAt: string;
}

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [note, setNote] = useState<NoteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [upvoted, setUpvoted] = useState(false);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const subjects = getAllSubjects();

    useEffect(() => {
        fetch(`/api/notes/${id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setNote(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleUpvote = async () => {
        const action = upvoted ? "downvote" : "upvote";
        const res = await fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        if (res.ok) {
            const updated = await res.json();
            setNote((prev) => prev ? { ...prev, upvotes: updated.upvotes } : prev);
            setUpvoted(!upvoted);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this note?")) return;
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) {
            window.location.href = "/notes";
        }
    };

    if (loading) {
        return <LoadingScreen message="Opening your note..." />;
    }

    if (!note) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
                <h1 className="text-7xl font-black text-white/5 mb-4 tracking-tighter">404</h1>
                <p className="text-gray-400 text-lg">Note not found.</p>
                <Link href="/notes" className="mt-8 text-indigo-400 hover:text-indigo-300 flex items-center font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Notes
                </Link>
            </div>
        );
    }

    const subjectTitle = subjects.find((s) => s.id === note.subject)?.title || note.subject;

    // Colorful markdown renderer for styling handwritten notes
    const renderMarkdown = (md: string) => {
        return md.split("\n").map((line, i) => {
            if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-extrabold text-blue-600 mt-8 mb-4 tracking-wide border-b-2 border-blue-200/50 pb-2">{line.slice(2)}</h1>;
            if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-purple-600 mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-pink-600 mt-5 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-amber-400 bg-amber-50/50 pl-4 py-2 pr-4 rounded-r-lg text-amber-700 italic my-4 text-lg">{line.slice(2)}</blockquote>;
            if (line.startsWith("- ") || line.startsWith("* ")) {
                const content = line.slice(2);
                return <li key={i} className="text-slate-800 ml-6 list-none relative my-2 text-lg before:content-['•'] before:absolute before:-left-5 before:text-teal-500 before:font-bold before:text-xl" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-rose-600 font-bold">$1</strong>') }} />;
            }
            if (line.trim() === "") return <div key={i} className="h-4" />;
            return <p key={i} className="text-slate-800 leading-relaxed my-3 text-lg" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-rose-600 font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-indigo-100 px-2 py-0.5 rounded-md text-indigo-700 font-sans text-sm font-semibold border border-indigo-200/50">$1</code>') }} />;
        });
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Link href="/notes" className="flex items-center text-sm font-medium text-gray-500 hover:text-white transition-colors w-fit">
                <ChevronLeft className="w-4 h-4 mr-1" /> Notes
            </Link>

            <article className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <BookOpen className="w-3.5 h-3.5" />
                            {subjectTitle}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" /> {note.author}
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {new Date(note.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {note.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <PdfExportButton targetRef={containerRef} filename={note.title} />
                            <button
                                onClick={() => setIsDrawingMode(!isDrawingMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover-lift ${isDrawingMode
                                    ? "bg-indigo-500 text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)] border border-indigo-400/50"
                                    : "bg-white/10 text-gray-300 hover:bg-white/15"
                                    }`}
                            >
                                <PenTool className="w-4 h-4" />
                                {isDrawingMode ? "Done Annotating" : "Annotate Note"}
                            </button>
                        </div>
                    </div>

                    {/* Content Section with Mac OS Window Wrapper */}
                    <div ref={containerRef} className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] sm:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] mt-4 sm:mt-8 ring-1 ring-white/5 mx-auto transition-transform hover-lift">

                        {/* macOS Window Header Bar */}
                        <div className="h-8 sm:h-10 w-full bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 flex items-center px-3 sm:px-4 relative z-40">
                            {/* Traffic Lights */}
                            <div className="flex gap-1.5 sm:gap-2">
                                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 shadow-inner"></div>
                                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 shadow-inner"></div>
                                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 shadow-inner"></div>
                            </div>

                            {/* Window Title (Note Title) */}
                            <div className="absolute left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wide max-w-[150px] sm:max-w-sm truncate">
                                {note.title}.dbe
                            </div>
                        </div>

                        {/* Note Notebook Area (Plain Page) */}
                        <div className="relative w-full bg-[#F9F6EE] min-h-[400px] sm:min-h-[600px] overflow-hidden overflow-x-auto">
                            <div className={`relative z-10 p-4 sm:p-8 md:p-12 ${kalam.className}`}>
                                <div className="prose-like !max-w-none break-words">
                                    {renderMarkdown(note.content)}
                                </div>
                            </div>
                            <DrawingOverlay noteId={note.id} isDrawingMode={isDrawingMode} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-8 pt-4 border-t border-white/5">
                        <button
                            onClick={handleUpvote}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${upvoted
                                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                : "bg-white/5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent"
                                }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            {note.upvotes} Helpful
                        </button>

                        <button
                            onClick={handleDelete}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
}
