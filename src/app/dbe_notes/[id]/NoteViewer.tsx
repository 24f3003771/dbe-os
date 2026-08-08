"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Download, FileText, Image as ImageIcon, ImageOff, List, AlignLeft, Bookmark, CheckCircle2 } from "lucide-react";
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

// Helper to extract text from React nodes
function extractTextFromReactNode(node: any): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(extractTextFromReactNode).join('');
    }
    if (node && node.props && node.props.children) {
        return extractTextFromReactNode(node.props.children);
    }
    return '';
}

// Generate an ID for headers rendered by ReactMarkdown
function generateId(children: any) {
    const text = extractTextFromReactNode(children);
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export default function NoteViewer({ subject, notes, lectures = [], initialCompletedModules = [] }: { subject: Subject; notes: Note[]; lectures?: Lecture[]; initialCompletedModules?: number[] }) {
    const [activeModule, setActiveModule] = useState<number | "formula-sheet" | "mind-maps">(1);
    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [showMedia, setShowMedia] = useState(true);
    const [showQuiz, setShowQuiz] = useState(true);
    const [completedModules, setCompletedModules] = useState<number[]>(initialCompletedModules);
    const printRef = useRef<HTMLDivElement>(null);
    const [savedBookmarks, setSavedBookmarks] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [aiPromptOpen, setAiPromptOpen] = useState(false);
    const handleAiRedirect = (ai: 'chatgpt' | 'gemini' | 'claude' | 'copy', content: string, subjectName: string, moduleName: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = content;
        const cleanContent = tmp.textContent || tmp.innerText || "";
        
        let prompt = `Act as an expert tutor for a university student. I am studying ${subjectName} (${moduleName}). \n\nHere are my notes for this topic:\n---\n${cleanContent}\n---\n\nPlease do the following:\n1. Summarize the core concepts simply and intuitively.\n2. Provide a real-world example or analogy for the most difficult concept.\n3. Give me 3 multiple-choice questions to test my understanding.`;
        
        if (ai === 'copy') {
            navigator.clipboard.writeText(prompt).then(() => {
                alert("Prompt and full notes copied to clipboard!");
                setAiPromptOpen(false);
            }).catch(() => {
                alert("Failed to copy. Please try again.");
            });
            return;
        }

        // Truncate if extremely long to avoid URL length limits
        if (prompt.length > 7000) {
            prompt = prompt.substring(0, 7000) + "\n...[Content truncated due to length]...";
        }

        const encodedPrompt = encodeURIComponent(prompt);

        // Copy to clipboard as a fallback
        navigator.clipboard.writeText(prompt).catch(() => {});

        if (ai === 'chatgpt') {
            window.open(`https://chatgpt.com/?q=${encodedPrompt}`, '_blank');
        } else if (ai === 'gemini') {
            window.open(`https://gemini.google.com/app?q=${encodedPrompt}`, '_blank');
        } else if (ai === 'claude') {
            // Claude might not fully support ?q=, but clipboard fallback is there
            window.open(`https://claude.ai/new?q=${encodedPrompt}`, '_blank');
        }
        setAiPromptOpen(false);
    };

    useEffect(() => {
        if (subject?.id) {
            // Load bookmarks
            const savedB = localStorage.getItem(`dbe-bookmarks-${subject.id}`);
            if (savedB) {
                try {
                    setSavedBookmarks(JSON.parse(savedB));
                } catch (e) {}
            }
            // Load completed modules
            const savedM = localStorage.getItem(`dbe-completed-modules-${subject.id}`);
            if (savedM) {
                try {
                    const parsedM = JSON.parse(savedM);
                    if (Array.isArray(parsedM)) {
                        setCompletedModules(prev => Array.from(new Set([...prev, ...parsedM])));
                    }
                } catch (e) {}
            }
        }
    }, [subject?.id]);

    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSavedBookmarks(prev => {
            const newBookmarks = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
            localStorage.setItem(`dbe-bookmarks-${subject.id}`, JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const handleDoubleClick = () => {
        const text = window.getSelection()?.toString().trim();
        if (text && text.length > 0) {
            setSearchQuery(text);
        }
    };

    const modules: (number | "formula-sheet" | "mind-maps")[] = [...Array.from({ length: subject.module_count }, (_, i) => i + 1), "formula-sheet", "mind-maps"];
    
    const activeNote = activeModule === "mind-maps" 
        ? notes.find((n) => n.module_number === 99)
        : activeModule === "formula-sheet"
        ? notes.find((n) => n.module_number === 98)
        : notes.find((n) => n.module_number === activeModule);

    const currentModuleLectures = typeof activeModule === "number" ? lectures.filter(l => l.module_number === activeModule) : [];

    const headings = activeNote ? extractHeadings(activeNote.content) : [];

    const handleModuleComplete = (moduleId: string | number) => {
        const modNum = typeof moduleId === 'number' ? moduleId : moduleId === 'formula-sheet' ? 98 : moduleId === 'mind-maps' ? 99 : -1;
        if (modNum !== -1 && !completedModules.includes(modNum)) {
            const newCompleted = [...completedModules, modNum];
            setCompletedModules(newCompleted);
            localStorage.setItem(`dbe-completed-modules-${subject.id}`, JSON.stringify(newCompleted));
        }
    };

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
                            onClick={() => setShowQuiz(!showQuiz)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 hover:border-stone-300 rounded-xl font-bold text-xs shadow-sm transition-all"
                        >
                            <CheckCircle2 className={`w-4 h-4 ${showQuiz ? 'text-stone-400' : 'text-indigo-500'}`} />
                            {showQuiz ? "Hide Quizzes" : "Show Quizzes"}
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
                                    <div onClick={(e) => toggleBookmark(heading.id, e)} className="cursor-pointer hover:scale-110 transition-transform p-0.5">
                                        <Bookmark className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${savedBookmarks.includes(heading.id) ? "fill-indigo-500 text-indigo-500 opacity-100" : "opacity-40"}`} />
                                    </div>
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
                                    className={`px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                        activeModule === mod
                                            ? "bg-stone-100 text-[#2D2422] shadow-sm"
                                            : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                                    }`}
                                >
                                    {label}
                                    {completedModules.includes(isMindMap ? 99 : isFormulaSheet ? 98 : mod as number) && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    )}
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
                <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8 md:py-12 scroll-smooth" ref={printRef} onDoubleClick={handleDoubleClick}>
                    <div className="w-full max-w-7xl mx-auto">
                        {activeNote ? (
                            <div className="relative">
                                <div className="flex justify-end mb-4">
                                    <button 
                                        onClick={() => setAiPromptOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm font-sans"
                                    >
                                        <span className="text-base">✨</span> Learn with AI
                                    </button>
                                </div>
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
                                                if (!showQuiz) return null;
                                                try {
                                                    const questions = JSON.parse(String(children).replace(/\n$/, ''));
                                                    const modNum = typeof activeModule === 'number' ? activeModule : activeModule === 'formula-sheet' ? 98 : activeModule === 'mind-maps' ? 99 : -1;
                                                    const isCurrentModuleCompleted = completedModules.includes(modNum);
                                                    return <InNoteQuiz questions={questions} subjectId={subject.id} moduleId={activeModule} isAlreadyCompleted={isCurrentModuleCompleted} onComplete={() => handleModuleComplete(activeModule)} />;
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
                                                    const modNum = typeof activeModule === 'number' ? activeModule : activeModule === 'formula-sheet' ? 98 : activeModule === 'mind-maps' ? 99 : -1;
                                                    const isCurrentModuleCompleted = completedModules.includes(modNum);
                                                    return <ModuleCheckpoint 
                                                        message={config.message} 
                                                        subjectId={subject.id} 
                                                        moduleId={activeModule}
                                                        isAlreadyCompleted={isCurrentModuleCompleted}
                                                        onComplete={() => handleModuleComplete(activeModule)}
                                                    />;
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
                                        th: ({ children }) => <th style={{ border: "1px solid #e0d8d4", padding: "12px 16px", background: "#f8f4f2", fontWeight: 700, textAlign: "left", color: "#2c3e50" }}>{children}</th>,
                                        td: ({ children }) => <td style={{ border: "1px solid #e0d8d4", padding: "12px 16px", color: "#34495e" }}>{children}</td>,
                                        pre: ({ children, ...props }: any) => {
                                            // Bypass <pre> wrapper for our custom interactive blocks
                                            if (children && children.props && children.props.className) {
                                                const match = /language-(\w+)/.exec(children.props.className || '');
                                                if (match && ['visualizer', 'quiz', 'checkpoint'].includes(match[1])) {
                                                    return <>{children}</>;
                                                }
                                            }
                                            return <pre {...props} className="overflow-x-auto p-4 bg-[#f8f9fa] rounded-lg my-4 border border-[#e0d8d4]">{children}</pre>;
                                        },
                                    }}
                                >
                                    {activeNote.content
                                        // 1. Fix common missing parenthesis error: ![alt]http... -> ![alt](http...)
                                        .replace(/!\[([^\]]*)\](?!\()(https?:\/\/[^\s\)]+)\)*/g, '![$1]($2)')
                                        // 2. Auto-convert Drive links that are just links: [text](drive_url) -> ![text](drive_url)
                                        .replace(/(?<!\!)\[([^\]]*)\](https:\/\/drive\.google\.com\/[^\s\)]+)/g, '![$1]($2)')
                                    }
                                </ReactMarkdown>
                                </div>
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

            {aiPromptOpen && activeNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <span className="text-2xl">✨</span>
                                <h3 className="text-xl font-black font-sans">Learn with AI</h3>
                            </div>
                            <button onClick={() => setAiPromptOpen(false)} className="text-stone-400 hover:text-stone-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <p className="text-stone-500 font-sans mb-6 text-sm">
                            Select your preferred AI. We'll copy the prompt to your clipboard and open the AI—just paste and send!
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => handleAiRedirect('chatgpt', activeNote.content, subject.name, activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`)}
                                className="w-full py-3 px-4 rounded-xl font-bold text-stone-700 bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-sans flex items-center gap-3"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" className="w-5 h-5" />
                                Open in ChatGPT
                            </button>
                            <button 
                                onClick={() => handleAiRedirect('gemini', activeNote.content, subject.name, activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`)}
                                className="w-full py-3 px-4 rounded-xl font-bold text-stone-700 bg-white border border-stone-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-sans flex items-center gap-3"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" className="w-5 h-5" />
                                Open in Gemini
                            </button>
                            <button 
                                onClick={() => handleAiRedirect('claude', activeNote.content, subject.name, activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`)}
                                className="w-full py-3 px-4 rounded-xl font-bold text-stone-700 bg-white border border-stone-200 hover:border-orange-500 hover:bg-orange-50 transition-all font-sans flex items-center gap-3"
                            >
                                <span className="text-xl leading-none">🧠</span>
                                Open in Claude
                            </button>
                            <div className="my-2 border-t border-stone-200" />
                            <button 
                                onClick={() => handleAiRedirect('copy', activeNote.content, subject.name, activeModule === "mind-maps" ? "Mind Maps" : activeModule === "formula-sheet" ? "Formula Sheet" : `Module ${activeModule}`)}
                                className="w-full py-3 px-4 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-transparent transition-all font-sans flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                Copy Prompt & Full Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {searchQuery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4 text-indigo-600">
                            <span className="text-2xl">✨</span>
                            <h3 className="text-xl font-black font-sans">Search Gemini</h3>
                        </div>
                        <p className="text-stone-600 font-sans mb-6">
                            Would you like to search Gemini for:
                            <br/>
                            <strong className="text-stone-900 line-clamp-3 mt-2 block p-3 bg-stone-50 rounded-xl border border-stone-100">&quot;{searchQuery}&quot;</strong>
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setSearchQuery(null)}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors font-sans"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    window.open(`https://gemini.google.com/app?q=${encodeURIComponent(searchQuery)}`, '_blank');
                                    setSearchQuery(null);
                                }}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-sans flex items-center justify-center gap-2"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
