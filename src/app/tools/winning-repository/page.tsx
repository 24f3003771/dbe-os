"use client";

import { useState, useEffect } from "react";
import { getWinningRepository } from "@/actions/tools";
import { Star, ChevronLeft, Search, Download, ExternalLink, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WinningRepositoryPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getWinningRepository().then(data => {
            setSubmissions(data);
            setLoading(false);
        });
    }, []);

    const filtered = submissions.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.opportunity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 pb-32 min-h-screen">
             {/* Nav */}
             <Link href="/tools" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Opportunity Hub
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full text-amber-600 font-black text-[10px] tracking-widest uppercase">
                        <Trophy className="w-3.5 h-3.5" /> Curated High-Impact Archive
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-[#1A1A1A]">
                        Winners <span className="text-amber-500">Bank.</span>
                    </h1>
                    <p className="text-stone-500 font-medium text-xl max-w-2xl italic">"Learn the architecture of winning from the top 1% of B-school performers."</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search submissions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 pl-12 rounded-2xl bg-white border border-stone-100 font-bold outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all"
                    />
                    <Search className="absolute left-4 top-4 w-5 h-5 text-stone-300" />
                </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-6">
                {filtered.map((sub, idx) => (
                    <motion.div 
                        key={sub.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-stone-100 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all group"
                    >
                        <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center shrink-0 border border-amber-100">
                            <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                        </div>
                        
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-[#1A1A1A] group-hover:text-amber-600 transition-colors leading-tight">{sub.title}</h3>
                                <p className="text-stone-400 font-bold text-xs uppercase tracking-[0.2em]">Verified winning entry for <span className="text-indigo-600 underline cursor-pointer">{sub.opportunity.name}</span></p>
                            </div>
                            <p className="text-stone-500 font-medium text-lg max-w-2xl italic">
                                "{sub.strategy}"
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="px-3 py-1 bg-stone-50 text-stone-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-stone-100">{sub.author}</span>
                                <span className="px-3 py-1 bg-stone-50 text-stone-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-stone-100">{sub.opportunity.domain}</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-3">
                            <button className="flex-1 px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                                <Download className="w-4 h-4 text-amber-500" /> Download PDF
                            </button>
                            <Link href={`/tools/detail/${sub.opportunityId}`} className="flex-1 px-8 py-4 bg-white border border-stone-100 rounded-2xl font-black text-xs uppercase tracking-widest text-[#1A1A1A] flex items-center justify-center gap-3 hover:border-stone-400 transition-all">
                                Opportunity View <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filtered.length === 0 && (
                <div className="text-center py-32 space-y-4">
                    <Trophy className="w-12 h-12 text-stone-200 mx-auto" />
                    <p className="text-stone-400 font-medium italic">No submissions found. Try a different search term.</p>
                </div>
            )}
        </div>
    );
}

