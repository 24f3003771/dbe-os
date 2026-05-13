"use client";

import { useState } from "react";
import { Activity, BookOpen, ChevronRight, Target, Search, Zap } from "lucide-react";
import Link from "next/link";

type SubjectWithCount = {
    id: string;
    name: string;
    code: string;
    module_count: number;
    questionCount: number;
};

export default function QuizDashboard({
    subjects,
    termName,
    batch,
}: {
    subjects: SubjectWithCount[];
    termName: string;
    batch: string;
}) {
    const [searchQuery, setSearchQuery] = useState("");

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
                            <span className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Target className="w-6 h-6" />
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-headline tracking-tight">
                                Quiz Simulator
                            </h1>
                        </div>
                        <p className="text-lg text-on-surface-variant max-w-2xl font-medium md:ml-[52px]">
                            {termName
                                ? `${batch} · ${termName} — Select a subject to begin.`
                                : "Select a subject to start the 3-level concept builder."}
                        </p>
                        <div className="flex items-center gap-2 mt-2 md:ml-[52px]">
                            {["🌱 Easy","⚡ Medium","🔥 Hard"].map((l,i) => (
                                <span key={i} className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-surface-container border border-outline-variant/20 text-on-surface-variant">{l}</span>
                            ))}
                            <span className="text-[10px] text-on-surface-variant/50 font-medium ml-1">· 10 Qs each · 80% to unlock next</span>
                        </div>
                    </div>
                </div>

                <div className="relative max-w-xl md:ml-[52px]">
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
            </header>

            <div className="md:ml-[52px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
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
                            href={`/quiz/concept-builder/${subject.id}`}
                            key={subject.id}
                            className="group bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface font-mono text-[10px] font-bold tracking-widest rounded-lg border border-outline-variant/20 shadow-sm transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                                        {subject.code}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
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
                                    <Activity className="w-3.5 h-3.5" /> {subject.questionCount} Qs
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-indigo-500">
                                    <Zap className="w-3 h-3" />
                                    <span className="text-[10px]">3 Levels</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
