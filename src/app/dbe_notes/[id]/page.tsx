import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft, Download, FileText, Share2, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSubjectById } from '@/data/db';

export default async function UniversalNotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const subject = getSubjectById(id);
    
    const filePath = path.join(process.cwd(), 'src', 'data', 'notes', `${id}.md`);
    let content = '';
    
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        content = '# Note not found\nThe requested universal note could not be located.';
    }

    return (
        <div className="min-h-screen bg-[#FDF8F6] text-[#2D2422]">
            {/* Top Navigation */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <Link href={`/${id}`} className="flex items-center gap-2 text-sm font-bold text-[#A69994] hover:text-[#2D2422] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to {subject?.title || id}
                </Link>

                <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] text-[#6366F1] rounded-full text-xs font-bold">
                                <FileText className="w-3.5 h-3.5" />
                                Study Notes
                            </span>
                            <span className="text-xs font-bold text-[#A69994] uppercase tracking-widest">{id} — {subject?.title}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-[#2D2422]">
                            {subject?.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-3 rounded-xl hover:bg-white transition-colors text-[#A69994] hover:text-[#2D2422]">
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-xl hover:bg-white transition-colors text-[#A69994] hover:text-[#2D2422]">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="px-6 py-3 bg-white border border-[#F0EBE9] hover:border-[#D1C9C7] rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Share Note
                        </button>
                    </div>
                </div>
            </div>

            {/* Markdown Viewer in Mac Frame */}
            <div className="max-w-6xl mx-auto px-6 pb-32">
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-200/40 overflow-hidden flex flex-col min-h-[800px]">
                    {/* Mac Window Bar */}
                    <div className="bg-[#1A1A1A] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em]">
                            {id}.dbe-os.notes.viewer
                        </div>
                        <div className="w-12" /> {/* Spacer */}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 md:p-16 overflow-y-auto prose prose-stone max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-stone-600 prose-p:leading-relaxed prose-pre:bg-stone-50 prose-pre:border prose-pre:border-stone-100">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
