"use client";

import { getAllSubjects } from "@/data/db";
import { FileText, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function UniversalNotesListPage() {
    const subjects = getAllSubjects();

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <FileText className="w-3 h-3" /> Universal Library
                </div>
                <h1 className="text-5xl font-black font-headline tracking-tighter text-[#1A1A1A]">Study Notes.</h1>
                <p className="text-stone-500 font-medium">Access verified, universal study notes for every subject.</p>
            </header>

            <Link href="/opportunities/pitch-decks" className="block mb-10 group">
                <div className="bg-[#1A1A1A] p-6 rounded-[2rem] text-white flex items-center justify-between overflow-hidden relative border border-white/5 shadow-xl hover:shadow-emerald-500/10 transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] tracking-widest uppercase mb-1">
                            <Star className="w-3.5 h-3.5" /> High-Impact Resource
                        </div>
                        <h2 className="text-2xl font-black font-headline text-white leading-tight">Master Winning Decks</h2>
                        <p className="text-stone-400 text-sm font-medium mt-1">Study pro case decks from global winners.</p>
                    </div>
                    <div className="bg-emerald-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 transition-all relative z-10 shrink-0">
                        Explore <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-10"></div>
                </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                    <Link 
                        key={subject.id}
                        href={`/dbe_notes/${subject.id}`}
                        className="group flex items-center justify-between p-6 bg-white border border-stone-100 rounded-3xl hover:border-indigo-600/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {subject.id.slice(0, 2)}
                            </div>
                            <div>
                                <h3 className="font-black text-[#1A1A1A] group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{subject.title}</h3>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{subject.id}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-indigo-600 transition-all translate-x-0 group-hover:translate-x-1" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
