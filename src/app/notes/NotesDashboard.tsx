"use client";

import { useState } from "react";
import { 
    BookOpen, Search, Bookmark, Star, Clock, 
    CheckCircle2, Target, MoreHorizontal, ArrowRight, 
    RefreshCcw, FileText, Lightbulb, Scale, Calculator, 
    Leaf, Megaphone, CheckCircle
} from "lucide-react";
import Link from "next/link";

type SubjectWithCount = {
    id: string;
    name: string;
    code: string;
    module_count: number;
};

// Helper for consistent pseudo-random data based on subject ID
const getMockData = (id: string, name: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const progress = (hash % 80) + 10;
    const daysAgo = (hash % 7) + 1;
    
    let icon = <BookOpen className="w-6 h-6" />;
    let colorClass = "text-indigo-500";
    let bgClass = "bg-indigo-50";

    const lowerName = name.toLowerCase();
    if (lowerName.includes('statistic') || lowerName.includes('account') || lowerName.includes('math')) {
        icon = <Calculator className="w-6 h-6" />;
        colorClass = "text-blue-500";
        bgClass = "bg-blue-50";
    } else if (lowerName.includes('micro') || lowerName.includes('eco') || lowerName.includes('env')) {
        icon = <Leaf className="w-6 h-6" />;
        colorClass = "text-green-600";
        bgClass = "bg-green-50";
    } else if (lowerName.includes('communication') || lowerName.includes('market')) {
        icon = <Megaphone className="w-6 h-6" />;
        colorClass = "text-orange-500";
        bgClass = "bg-orange-50";
    } else if (lowerName.includes('law') || lowerName.includes('ethic')) {
        icon = <Scale className="w-6 h-6" />;
        colorClass = "text-teal-600";
        bgClass = "bg-teal-50";
    } else if (lowerName.includes('knowledge') || lowerName.includes('sys') || lowerName.includes('logic')) {
        icon = <Lightbulb className="w-6 h-6" />;
        colorClass = "text-rose-500";
        bgClass = "bg-rose-50";
    }

    return { progress, daysAgo, icon, colorClass, bgClass };
};

export default function NotesDashboard({
    subjects,
    termName,
    batch,
    progressData,
}: {
    subjects: SubjectWithCount[];
    termName: string;
    batch: string;
    progressData: { subject_id: string; module_number: number; created_at: string }[];
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = [
        { name: "All", icon: null },
        { name: "Recent", icon: Bookmark },
        { name: "Bookmarked", icon: Star },
        { name: "In Progress", icon: CheckCircle2 },
        { name: "Completed", icon: CheckCircle },
        { name: "Weak Topics", icon: Target },
    ];

    const filtered = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto space-y-8 pb-20 font-body">
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FFF0EB] rounded-2xl flex items-center justify-center text-[#FF5F56] shadow-sm">
                        <BookOpen className="w-7 h-7 stroke-[2]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
                            Notes Library
                        </h1>
                        <p className="text-sm font-bold text-stone-500 mt-1">
                            All your subjects, modules and notes in one place.
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-80 lg:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-white border border-stone-200/80 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm"
                        placeholder="Search for subject, module o..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Filters */}
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                {filters.map((f) => {
                    const isActive = activeFilter === f.name;
                    const Icon = f.icon;
                    return (
                        <button
                            key={f.name}
                            onClick={() => setActiveFilter(f.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                                isActive
                                    ? "bg-[#FFF0EB] text-[#FF5F56] border-[#FFEBE5]"
                                    : "bg-white text-stone-600 border-stone-200/60 hover:bg-stone-50"
                            }`}
                        >
                            {Icon && <Icon className="w-3.5 h-3.5" />}
                            {f.name}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-16 text-center">
                        <p className="text-stone-500 font-bold">No subjects found matching your search.</p>
                    </div>
                ) : (
                    filtered.map((subject) => {
                        const mockData = getMockData(subject.id, subject.name);
                        
                        // Real calculations
                        const subjectProgress = progressData.filter(p => p.subject_id === subject.id);
                        
                        // Calculate percentage
                        // Filter out non-numbered modules like formula sheet (98) or mind map (99) from the count if they exceed module_count
                        const completedModules = subjectProgress.filter(p => p.module_number <= subject.module_count).length;
                        const realProgress = subject.module_count > 0 ? Math.min(100, Math.round((completedModules / subject.module_count) * 100)) : 0;
                        
                        // Calculate days ago
                        let daysText = "Not started yet";
                        if (subjectProgress.length > 0) {
                            const latestDate = new Date(Math.max(...subjectProgress.map(p => new Date(p.created_at).getTime())));
                            const daysDiff = Math.floor((new Date().getTime() - latestDate.getTime()) / (1000 * 3600 * 24));
                            if (daysDiff === 0) daysText = "Last opened today";
                            else if (daysDiff === 1) daysText = "Last opened yesterday";
                            else daysText = `Last opened ${daysDiff} days ago`;
                        }

                        return (
                            <div
                                key={subject.id}
                                className="bg-white border border-stone-200/60 p-6 rounded-[2rem] shadow-sm flex flex-col hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                {/* Top Row */}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="px-3 py-1 bg-[#FFF0EB] text-[#FF5F56] font-black text-[10px] uppercase tracking-widest rounded-xl">
                                        {subject.code}
                                    </span>
                                    <button className="text-stone-400 hover:text-stone-600 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Icon + Title */}
                                <div className="flex items-center gap-4 mb-8 h-16">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${mockData.bgClass} ${mockData.colorClass}`}>
                                        {mockData.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-stone-900 leading-tight line-clamp-2">
                                        {subject.name}
                                    </h3>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#FF5F56] to-[#FFA370] rounded-full transition-all duration-1000"
                                            style={{ width: `${realProgress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-stone-900 w-8">{realProgress}%</span>
                                </div>

                                {/* Bottom Info Row */}
                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-stone-500">
                                            <FileText className="w-4 h-4" />
                                            <span className="text-xs font-bold">{subject.module_count} Modules</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-500">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold">{daysText}</span>
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href={`/dbe_notes/${subject.id}`}
                                        className="bg-[#FFF0EB] hover:bg-[#FFEBE5] text-[#FF5F56] px-5 py-2.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5"
                                    >
                                        Resume <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-center items-center py-8">
                <p className="flex items-center gap-2 text-sm font-bold text-stone-500">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Can't find your notes? 
                    <button className="text-[#FF5F56] font-black flex items-center gap-1 hover:underline ml-1">
                        Sync Now <RefreshCcw className="w-3.5 h-3.5" />
                    </button>
                </p>
            </div>
            
        </div>
    );
}
