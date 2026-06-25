"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Download, FileText, Image as ImageIcon, ImageOff, List, AlignLeft, Bookmark } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import DistributionVisualizer from "@/components/DistributionVisualizer";
import InNoteQuiz from "@/components/InNoteQuiz";
import ModuleCheckpoint from "@/components/ModuleCheckpoint";

type Note = { id: string; module_number: number; content: string; topic_id: string | null; };
type Lecture = { id: string; module_number: number; lecture_number: number; title: string };
type Subject = { id: string; name: string; code: string; module_count: number; term_id: number };

// Helper to extract headings for the Table of Contents
function extractHeadings(markdown: string) {
    const mdRegex = /^(#{1,3})\s+(.+)$/gm;
    const htmlRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    const headings = [];
    
    let match;
    while ((match = mdRegex.exec(markdown)) !== null) {
        const text = match[2].replace(/<[^>]+>/g, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ level: match[1].length, text, id, index: match.index });
    }
    
    while ((match = htmlRegex.exec(markdown)) !== null) {
        const text = match[2].replace(/<[^>]+>/g, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ level: parseInt(match[1]), text, id, index: match.index });
    }
    
    headings.sort((a, b) => a.index - b.index);
    return headings.map(h => ({ level: h.level, text: h.text, id: h.id }));
}

// Generate an ID for headers rendered by ReactMarkdown
function generateId(text: string) {
    return String(text).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export default function NoteViewer({ subject, notes, lectures = [] }: { subject: Subject; notes: Note[]; lectures?: Lecture[] }) {
    const [activeModule, setActiveModule] = useState<number | "formula-sheet" | "mind-maps">(1);
    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [showMedia, setShowMedia] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    const modules: (number | "formula-sheet" | "mind-maps")[] = [...Array.from({ length: subject.module_count }, (_, i) => i + 1), "formula-sheet", "mind-maps"];
    
    const activeNote = activeModule === "mind-maps" 
        ? notes.find((n) => n.module_number === 99)
        : activeModule === "formula-sheet"
        ? notes.find((n) => n.module_number === 98)
        : notes.find((n) => n.module_number === activeModule);

    const currentModuleLectures = typeof activeModule === "number" ? lectures.filter(l => l.module_number === activeModule) : [];

    const headings = activeNote ? extractHeadings(activeNote.content) : [];

    const handlePrint = () => {
        const content = printRef.current?.innerHTML;
        if (!content) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
            <html>
            <head>
                <title>${subject.name} — ${activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`}</title>
                <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap" rel="stylesheet" />
                <style>
                    body { font-family: 'Kalam', cursive; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 15px; line-height: 1.8; color: #2D2422; background: #FFFEF9; }
                    h1, h2, h3, h4 { font-weight: 700; }
                    pre { background: #f5f5f5; padding: 12px; border-radius: 8px; overflow-x: auto; font-family: monospace; }
                    code { font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 4px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px 12px; }
                    th { background: #f5f5f5; }
                </style>
            </head>
            <body>
                <h1 style="font-size: 24px; margin-bottom: 4px">${subject.name}</h1>
                <p style="opacity: 0.5; font-size: 13px; margin-bottom: 32px">${subject.code} · ${activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`}</p>
                ${content}
            </body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 500);
    };

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#FFFEF9] text-[#2D2422]">
            {/* Load Kalam font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"
                rel="stylesheet"
            />

            {/* Sidebar Navigation */}
            <div className="w-72 border-r border-stone-200 bg-stone-50/50 flex flex-col h-full shrink-0">
                <div className="p-6 pb-2">
                    <Link href="/notes" className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors mb-6">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Notes
                    </Link>
                    
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                            <FileText className="w-3.5 h-3.5" /> Study Notes
                        </span>
                        <h2 className="text-xl font-black text-stone-900 leading-tight">
                            {subject.code}
                        </h2>
                    </div>

                    <div className="space-y-2 mb-6">
                        <button
                            onClick={() => setShowMedia(!showMedia)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 hover:border-stone-300 rounded-xl font-bold text-xs shadow-sm transition-all"
                        >
                            {showMedia ? <ImageOff className="w-4 h-4 text-stone-400" /> : <ImageIcon className="w-4 h-4 text-indigo-500" />}
                            {showMedia ? "Hide Media" : "Show Media"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-xl font-black text-xs shadow-sm transition-all uppercase tracking-widest"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-200">
                        <List className="w-3.5 h-3.5" />
                        Topics
                    </div>
                </div>

                {/* Topics List (Table of Contents) */}
                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                    {headings.length > 0 ? (
                        <div className="space-y-1 pb-4">
                            {headings.map((heading, idx) => (
                                <button
                                    key={`${heading.id}-${idx}`}
                                    onClick={() => scrollToHeading(heading.id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-start gap-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 text-stone-600 ${
                                        heading.level === 1 ? "font-black text-stone-800" :
                                        heading.level === 2 ? "pl-6 text-sm" : "pl-10 text-xs"
                                    }`}
                                >
                                    <Bookmark className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-40" />
                                    <span className="leading-snug">{heading.text}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <p className="text-xs font-bold text-stone-400">No topics found in this module.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-[#FFFEF9] relative overflow-hidden">
                
                {/* Top Navigation (Modules) */}
                <div className="h-16 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center px-6 gap-4 shrink-0 z-10 w-full overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-1">
                        {modules.map((mod) => {
                            const isMindMap = mod === "mind-maps";
                            const isFormulaSheet = mod === "formula-sheet";
                            const hasNote = isMindMap ? notes.some((n) => n.module_number === 99) : isFormulaSheet ? notes.some((n) => n.module_number === 98) : notes.some((n) => n.module_number === mod);
                            const label = isMindMap ? "Mind Maps" : isFormulaSheet ? "Formula Sheet" : `Module ${mod}`;
                            return (
                                <button
                                    key={mod}
                                    onClick={() => { setActiveModule(mod); setActiveLectureId(null); }}
                                    className={`px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                                        activeModule === mod
                                            ? "bg-stone-100 text-[#2D2422] shadow-sm"
                                            : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                                    }`}
                                >
                                    {label}
                                    {!hasNote && <span className="ml-1.5 text-[10px] text-stone-300 font-bold">— empty</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Lecture Sub-Tabs (If applicable) */}
                {currentModuleLectures.length > 0 && (
                    <div className="px-8 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto shrink-0">
                        <button
                            onClick={() => setActiveLectureId(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                                activeLectureId === null
                                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                                    : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-700"
                            }`}
                        >
                            Module Summary
                        </button>
                        {currentModuleLectures.map(lecture => {
                            const hasLectureNote = true; // previously notes.some(n => (n as any).lecture_id === lecture.id);
                            return (
                                <button
                                    key={lecture.id}
                                    onClick={() => setActiveLectureId(lecture.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                                        activeLectureId === lecture.id
                                            ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                                            : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-700"
                                    }`}
                                >
                                    <span>L{lecture.lecture_number}</span>
                                    {!hasLectureNote && <span className="text-[10px] text-stone-300">— no notes</span>}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Note Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-8 py-12 md:px-16 md:py-16 scroll-smooth" ref={printRef}>
                    <div className="max-w-3xl mx-auto">
                        {activeNote ? (
                            <div className="prose max-w-none pb-32"
                                style={{
                                    fontFamily: "'Kalam', cursive",
                                    fontSize: "18px",
                                    lineHeight: "2",
                                    color: "#2D2422",
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        h1: ({ children }) => <h1 id={generateId(String(children))} style={{ fontFamily: "'Kalam', cursive", fontSize: "32px", fontWeight: 700, marginBottom: "20px", color: "#1A1A1A", paddingTop: "20px" }}>{children}</h1>,
                                        h2: ({ children }) => <h2 id={generateId(String(children))} style={{ fontFamily: "'Kalam', cursive", fontSize: "26px", fontWeight: 700, marginBottom: "16px", color: "#1A1A1A", borderBottom: "2px solid #f0ebe9", paddingBottom: "8px", paddingTop: "20px", marginTop: "20px" }}>{children}</h2>,
                                        h3: ({ children }) => <h3 id={generateId(String(children))} style={{ fontFamily: "'Kalam', cursive", fontSize: "20px", fontWeight: 700, marginBottom: "12px", paddingTop: "16px" }}>{children}</h3>,
                                        p: ({ children }) => <p style={{ fontFamily: "'Kalam', cursive", marginBottom: "16px", lineHeight: "2" }}>{children}</p>,
                                        li: ({ children }) => <li style={{ fontFamily: "'Kalam', cursive", marginBottom: "8px" }}>{children}</li>,
                                        strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#4F46E5" }}>{children}</strong>,
                                        img: ({ src, alt }) => {
                                            const [error, setError] = useState(false);
                                            
                                            // Transform Google Drive links to direct image links
                                            let finalSrc = (src as string) || "";
                                            if (typeof finalSrc === "string" && finalSrc.includes("drive.google.com")) {
                                                const fileIdMatch = finalSrc.match(/\/(?:file\/d|folders)\/([^\/?]+)/) || finalSrc.match(/[?&]id=([^&]+)/);
                                                if (fileIdMatch && fileIdMatch[1]) {
                                                    finalSrc = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
                                                }
                                            }

                                            if (!showMedia) {
                                                return (
                                                    <a 
                                                        href={finalSrc} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-indigo-500 transition-all my-2"
                                                    >
                                                        <ImageIcon className="w-3.5 h-3.5" /> [Media Hidden: {alt || "Image"}]
                                                    </a>
                                                );
                                            }

                                            if (error) {
                                                return (
                                                    <a 
                                                        href={src as string} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="block my-6 p-4 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center group hover:bg-stone-100 transition-all"
                                                    >
                                                        <div className="text-stone-400 text-xs font-black uppercase tracking-widest mb-1">Link Reference</div>
                                                        <div className="text-indigo-500 font-bold truncate underline decoration-indigo-200 group-hover:decoration-indigo-500">{String(src)}</div>
                                                    </a>
                                                );
                                            }

                                            return (
                                                <div className="my-10 rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-white w-full max-w-2xl mx-auto">
                                                    <img 
                                                        src={finalSrc} 
                                                        alt={alt} 
                                                        className="w-full h-auto" 
                                                        onError={() => setError(true)}
                                                    />
                                                    {alt && <div className="px-4 py-2 bg-stone-50 text-[10px] text-stone-400 font-bold uppercase tracking-widest border-t border-stone-100 text-center">{alt}</div>}
                                                </div>
                                            );
                                        },
                                        a: ({ href, children, ...props }) => {
                                            if (typeof href === "string") {
                                                // Check for YouTube links
                                                const ytMatch = href.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
                                                if (ytMatch && ytMatch[1]) {
                                                    if (!showMedia) {
                                                        return (
                                                            <a 
                                                                href={href} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-indigo-500 transition-all my-2"
                                                            >
                                                                <ImageIcon className="w-3.5 h-3.5" /> [Video Hidden: YouTube]
                                                            </a>
                                                        );
                                                    }
                                                    return (
                                                        <div className="my-10 rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-white w-full max-w-2xl mx-auto aspect-video relative">
                                                            <iframe
                                                                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                                                                className="absolute top-0 left-0 w-full h-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                                title="YouTube video player"
                                                            ></iframe>
                                                        </div>
                                                    );
                                                }

                                                if (href.includes("drive.google.com")) {
                                                    const fileIdMatch = href.match(/\/(?:file\/d|folders)\/([^\/?]+)/) || href.match(/[?&]id=([^&]+)/);
                                                    if (fileIdMatch && fileIdMatch[1]) {
                                                        const finalSrc = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
                                                        if (!showMedia) {
                                                            return (
                                                                <a 
                                                                    href={finalSrc} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-indigo-500 transition-all my-2"
                                                                >
                                                                    <ImageIcon className="w-3.5 h-3.5" /> [Image Hidden: Google Drive]
                                                                </a>
                                                            );
                                                        }
                                                        return <img src={finalSrc} alt="Google Drive Embedded Image" className="w-full max-w-2xl mx-auto h-auto rounded-xl shadow-sm border border-stone-200 my-8 block" />;
                                                    }
                                                }
                                            }
                                            return (
                                                <a 
                                                    href={href} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-[#6366F1] underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-500 transition-all font-bold"
                                                    {...props}
                                                >
                                                    {children}
                                                </a>
                                            );
                                        },
                                        code: ({ node, inline, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isVisualizer = match && match[1] === 'visualizer';
                                            const isQuiz = match && match[1] === 'quiz';
                                            const isCheckpoint = match && match[1] === 'checkpoint';
                                            
                                            if (!inline && isVisualizer) {
                                                try {
                                                    const config = JSON.parse(String(children).replace(/\n$/, ''));
                                                    return <div className="my-8"><DistributionVisualizer {...config} /></div>;
                                                } catch (e) {
                                                    return (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-mono my-4">
                                                            Visualizer Error: Invalid JSON configuration
                                                        </div>
                                                    );
                                                }
                                            }

                                            if (!inline && isQuiz) {
                                                try {
                                                    const questions = JSON.parse(String(children).replace(/\n$/, ''));
                                                    return <InNoteQuiz questions={questions} subjectId={subject.id} />;
                                                } catch (e) {
                                                    return (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-mono my-4">
                                                            Quiz Error: Invalid JSON configuration
                                                        </div>
                                                    );
                                                }
                                            }

                                            if (!inline && isCheckpoint) {
                                                try {
                                                    const config = JSON.parse(String(children).replace(/\n$/, ''));
                                                    return <ModuleCheckpoint message={config.message} subjectId={subject.id} moduleId={activeModule} />;
                                                } catch (e) {
                                                    return (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-mono my-4">
                                                            Checkpoint Error: Invalid JSON configuration
                                                        </div>
                                                    );
                                                }
                                            }

                                            return (
                                                <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: "4px", fontSize: "14px", fontFamily: "monospace", color: "#E11D48" }} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid #4F46E5", paddingLeft: "20px", color: "#6B6B6B", fontStyle: "italic", margin: "24px 0", background: "linear-gradient(to right, #EEF2FF, transparent)", padding: "16px 20px", borderRadius: "0 12px 12px 0" }}>{children}</blockquote>,
                                        table: ({ children }) => <div className="overflow-x-auto my-8"><table style={{ borderCollapse: "collapse", width: "100%", minWidth: "600px" }}>{children}</table></div>,
                                        th: ({ children }) => <th style={{ border: "1px solid #e0d8d4", padding: "12px 16px", background: "#f8f4f2", fontWeight: 700, textAlign: "left" }}>{children}</th>,
                                        td: ({ children }) => <td style={{ border: "1px solid #e0d8d4", padding: "12px 16px" }}>{children}</td>,
                                    }}
                                >
                                    {activeNote.content
                                        // 1. Fix common missing parenthesis error: ![alt]http... -> ![alt](http...)
                                        .replace(/!\[([^\]]*)\](?!\()(https?:\/\/[^\s\)]+)\)*/g, '![$1]($2)')
                                        // 2. Auto-convert Drive links that are just links: [text](drive_url) -> ![text](drive_url)
                                        // Only if NOT preceded by an exclamation mark
                                        .replace(/(?<!\!)\[([^\]]*)\](https:\/\/drive\.google\.com\/[^\s\)]+)/g, '![$1]($2)')
                                    }
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[50vh]">
                                <div className="text-center space-y-3">
                                    <p className="text-stone-300 text-3xl" style={{ fontFamily: "'Kalam', cursive" }}>
                                        {activeModule === "mind-maps" ? "No Mind Maps yet" : activeModule === "formula-sheet" ? "No Formula Sheet yet" : `No notes yet for Module ${activeModule}`}
                                    </p>
                                    <p className="text-stone-300 text-lg" style={{ fontFamily: "'Kalam', cursive" }}>Check back soon!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
