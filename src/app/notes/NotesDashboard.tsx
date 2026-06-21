"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Search, FileText, Download, Star } from "lucide-react";
import Link from "next/link";

type SubjectWithCount = {
    id: string;
    name: string;
    code: string;
    module_count: number;
};

export default function NotesDashboard({
    subjects,
    termName,
    batch,
}: {
    subjects: SubjectWithCount[];
    termName: string;
    batch: string;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("Term 3");

    const filtered = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto space-y-10 pb-20">
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <BookOpen className="w-6 h-6" />
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-headline tracking-tight">
                                Notes Library
                            </h1>
                        </div>
                        <p className="text-lg text-on-surface-variant max-w-2xl font-medium md:ml-[52px]">
                            {termName
                                ? `${batch} · ${termName} — Select a subject to access study materials, notes, and modules.`
                                : "Select a subject below to access comprehensive study notes and learning materials."}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 md:ml-[52px]">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Summary Notes</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">Detailed Modules</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">Important Qs</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:ml-[52px]">
                    <div className="flex gap-6 border-b border-outline-variant/10">
                        <button
                            onClick={() => setSelectedTerm("Term 3")}
                            className={`pb-3 px-1 text-sm font-black uppercase tracking-widest transition-all ${
                                selectedTerm === "Term 3" 
                                    ? "text-[#E07A5F] border-b-[3px] border-[#E07A5F]" 
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            Term 3
                        </button>
                        <button
                            onClick={() => setSelectedTerm("Term 2")}
                            className={`pb-3 px-1 text-sm font-black uppercase tracking-widest transition-all ${
                                selectedTerm === "Term 2" 
                                    ? "text-[#E07A5F] border-b-[3px] border-[#E07A5F]" 
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            Term 2 <span className="ml-1 text-[9px] bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded-md">Locked</span>
                        </button>
                    </div>

                    <div className="relative max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-on-surface-variant opacity-70" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-surface-container-high border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                            placeholder="Search for a subject or course code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="md:ml-[52px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTerm === "Term 2" ? (
                    <div className="col-span-full border border-dashed border-outline-variant/30 rounded-3xl p-16 text-center">
                        <p className="text-on-surface-variant font-black text-lg">Term 2 notes are locked.</p>
                        <p className="text-sm mt-2 opacity-70 font-medium">Access to previous term materials is currently restricted.</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full border border-dashed border-outline-variant/30 rounded-3xl p-16 text-center">
                        <p className="text-on-surface-variant font-medium">
                            {searchQuery
                                ? `No subjects found matching "${searchQuery}"`
                                : "No subjects available for your current term."}
                        </p>
                    </div>
                ) : (
                    filtered.map((subject) => (
                        <Link
                            href={`/dbe_notes/${subject.id}`}
                            key={subject.id}
                            className="group bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between hover:scale-[1.02] active:scale-95 transition-all min-h-[200px]"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 bg-[#FDF0E9] text-[#E07A5F] font-mono text-[10px] font-bold tracking-widest rounded-lg border border-[#F5E6DD] shadow-sm transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                                        {subject.code}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-[#FDF0E9] flex items-center justify-center border border-[#F5E6DD] text-[#E07A5F] group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                        <ChevronRight className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black font-headline text-on-surface group-hover:text-primary transition-colors leading-tight">
                                    {subject.name}
                                </h3>
                            </div>

                            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest pt-5 border-t border-outline-variant/10">
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> {subject.module_count} Modules
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" /> PDF Notes
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-emerald-600 font-black uppercase tracking-widest">
                                    <Star className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px]">Updated</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
