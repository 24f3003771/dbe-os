"use client";

import { useState, useRef } from "react";
import { ChevronLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import DistributionVisualizer from "@/components/DistributionVisualizer";

type Note = { id: string; module_number: number; content: string; topic_id: string | null };
type Subject = { id: string; name: string; code: string; module_count: number; term_id: number };

export default function NoteViewer({ subject, notes }: { subject: Subject; notes: Note[] }) {
    const [activeModule, setActiveModule] = useState<number | "formula-sheet" | "mind-maps">(1);
    const printRef = useRef<HTMLDivElement>(null);

    const modules: (number | "formula-sheet" | "mind-maps")[] = [...Array.from({ length: subject.module_count }, (_, i) => i + 1), "formula-sheet", "mind-maps"];
    
    const activeNote = activeModule === "mind-maps" 
        ? notes.find((n) => n.module_number === 99)
        : activeModule === "formula-sheet"
        ? notes.find((n) => n.module_number === 98)
        : notes.find((n) => n.module_number === activeModule);

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

    return (
        <div className="min-h-screen bg-[#FFFEF9] text-[#2D2422]">
            {/* Load Kalam font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"
                rel="stylesheet"
            />

            {/* Top Navigation */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <Link href="/notes" className="flex items-center gap-2 text-sm font-bold text-[#A69994] hover:text-[#2D2422] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Notes
                </Link>

                <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] text-[#6366F1] rounded-full text-xs font-bold">
                                <FileText className="w-3.5 h-3.5" /> Study Notes
                            </span>
                            <span className="text-xs font-bold text-[#A69994] uppercase tracking-widest">{subject.code}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-[#2D2422]">
                            {subject.name}
                        </h1>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl font-bold text-sm shadow-sm transition-all shrink-0"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>

                {/* Module Tabs */}
                <div className="flex items-center gap-1 mt-8 bg-stone-100 rounded-2xl p-1 w-fit flex-wrap">
                    {modules.map((mod) => {
                        const isMindMap = mod === "mind-maps";
                        const isFormulaSheet = mod === "formula-sheet";
                        const hasNote = isMindMap ? notes.some((n) => n.module_number === 99) : isFormulaSheet ? notes.some((n) => n.module_number === 98) : notes.some((n) => n.module_number === mod);
                        const label = isMindMap ? "Mind Maps" : isFormulaSheet ? "Formula Sheet" : `M${mod}`;
                        return (
                            <button
                                key={mod}
                                onClick={() => setActiveModule(mod)}
                                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                                    activeModule === mod
                                        ? "bg-white text-[#2D2422] shadow-sm"
                                        : "text-stone-400 hover:text-stone-600"
                                }`}
                            >
                                {label}
                                {!hasNote && <span className="ml-1 text-[8px] text-stone-300">—</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Note Content */}
            <div className="max-w-5xl mx-auto px-6 pb-32">
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-200/40 overflow-hidden flex flex-col min-h-[600px]">
                    {/* Mac Window Bar */}
                    <div className="bg-[#1A1A1A] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em]">
                            {subject.code}.{activeModule === "mind-maps" ? "mind-maps" : activeModule === "formula-sheet" ? "formula-sheet" : `module-${activeModule}`}.notes
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* Handwritten Content */}
                    <div
                        ref={printRef}
                        className="flex-1 p-8 md:p-14 overflow-y-auto"
                        style={{ fontFamily: "'Kalam', cursive" }}
                    >
                        {activeNote ? (
                            <div className="prose max-w-none"
                                style={{
                                    fontFamily: "'Kalam', cursive",
                                    fontSize: "16px",
                                    lineHeight: "1.9",
                                    color: "#2D2422",
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        h1: ({ children }) => <h1 style={{ fontFamily: "'Kalam', cursive", fontSize: "28px", fontWeight: 700, marginBottom: "12px", color: "#1A1A1A" }}>{children}</h1>,
                                        h2: ({ children }) => <h2 style={{ fontFamily: "'Kalam', cursive", fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: "#1A1A1A", borderBottom: "2px solid #f0ebe9", paddingBottom: "6px" }}>{children}</h2>,
                                        h3: ({ children }) => <h3 style={{ fontFamily: "'Kalam', cursive", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{children}</h3>,
                                        p: ({ children }) => <p style={{ fontFamily: "'Kalam', cursive", marginBottom: "14px", lineHeight: "1.9" }}>{children}</p>,
                                        li: ({ children }) => <li style={{ fontFamily: "'Kalam', cursive", marginBottom: "6px" }}>{children}</li>,
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
                                                <div className="my-8 rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-white">
                                                    <img 
                                                        src={finalSrc} 
                                                        alt={alt} 
                                                        className="w-full h-auto" 
                                                        onError={() => setError(true)}
                                                    />
                                                    {alt && <div className="px-4 py-2 bg-stone-50 text-[10px] text-stone-400 font-bold uppercase tracking-widest border-t border-stone-100">{alt}</div>}
                                                </div>
                                            );
                                        },
                                        a: ({ href, children }) => (
                                            <a 
                                                href={href} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-[#6366F1] underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-500 transition-all font-bold"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        code: ({ node, inline, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isVisualizer = match && match[1] === 'visualizer';
                                            
                                            if (!inline && isVisualizer) {
                                                try {
                                                    const config = JSON.parse(String(children).replace(/\n$/, ''));
                                                    return <DistributionVisualizer {...config} />;
                                                } catch (e) {
                                                    return (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-mono">
                                                            Visualizer Error: Invalid JSON configuration
                                                        </div>
                                                    );
                                                }
                                            }

                                            return (
                                                <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: "4px", fontSize: "14px", fontFamily: "monospace" }} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid #4F46E5", paddingLeft: "16px", color: "#6B6B6B", fontStyle: "italic" }}>{children}</blockquote>,
                                        table: ({ children }) => <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "16px" }}>{children}</table>,
                                        th: ({ children }) => <th style={{ border: "1px solid #e0d8d4", padding: "8px 12px", background: "#f8f4f2", fontWeight: 700 }}>{children}</th>,
                                        td: ({ children }) => <td style={{ border: "1px solid #e0d8d4", padding: "8px 12px" }}>{children}</td>,
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
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center space-y-2">
                                    <p className="text-stone-300 text-2xl" style={{ fontFamily: "'Kalam', cursive" }}>
                                        {activeModule === "mind-maps" ? "No Mind Maps yet" : activeModule === "formula-sheet" ? "No Formula Sheet yet" : `No notes yet for Module ${activeModule}`}
                                    </p>
                                    <p className="text-stone-200 text-sm" style={{ fontFamily: "'Kalam', cursive" }}>Check back soon!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
