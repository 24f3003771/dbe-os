"use client";

import { useState, useEffect, use } from "react";
import { getOpportunities } from "@/actions/opportunities";
import { 
    ChevronLeft, Calendar, User, MapPin, 
    Layers, Search, Filter, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

export default function OpportunityListPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);
    const [opps, setOpps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDomain, setActiveDomain] = useState("All");

    useEffect(() => {
        getOpportunities({ type }).then(data => {
            setOpps(data);
            setLoading(false);
        });
    }, [type]);

    const domains = ["All", ...Array.from(new Set(opps.map(o => o.domain)))];
    
    const filteredOpps = opps.filter(o => 
        (activeDomain === "All" || o.domain === activeDomain) &&
        (o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <LoadingScreen message={`Curating ${type === 'COMPETITION' ? 'Competitions' : 'Internships'}...`} />;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 min-h-screen">
            {/* Nav */}
            <Link href="/opportunities" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Opportunity Hub
            </Link>

            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-[#1A1A1A]">
                    {type === "COMPETITION" ? "Competitions" : "Internships"}.
                </h1>
                <p className="text-stone-500 font-medium text-lg">Structured path to success in {type.toLowerCase()}s.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-8 border-b border-stone-100">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {domains.map(d => (
                        <button 
                            key={d} 
                            onClick={() => setActiveDomain(d)}
                            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeDomain === d ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-stone-100 hover:border-stone-200 text-stone-400'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search programs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 pl-12 rounded-2xl bg-white border border-stone-100 font-bold outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                    <Search className="absolute left-4 top-4 w-5 h-5 text-stone-300" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredOpps.map((opp, idx) => (
                        <motion.div 
                            key={opp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={`/opportunities/detail/${opp.id}`} className="group">
                                <div className="h-full bg-white border border-stone-100 rounded-[2rem] overflow-hidden flex flex-col p-8 space-y-6 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 border-b-4 border-b-transparent hover:border-b-indigo-500">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center font-black text-xs text-stone-400 border border-stone-100">
                                                {opp.organizer.charAt(0)}
                                            </div>
                                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {opp.difficulty}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-black text-[#1A1A1A] group-hover:text-indigo-600 transition-colors leading-tight">{opp.name}</h3>
                                            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-1">{opp.organizer}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" /> Deadline
                                                </div>
                                                <div className="text-xs font-bold text-stone-600">
                                                    {new Date(opp.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3" /> Mode
                                                </div>
                                                <div className="text-xs font-bold text-stone-600">
                                                    {opp.mode}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {JSON.parse(opp.tags).map((tag: string) => (
                                                <span key={tag} className="px-3 py-1 bg-stone-50 text-stone-400 border border-stone-100 rounded-md text-[9px] font-black uppercase tracking-widest leading-none">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest group-hover:underline">View Roadmap</div>
                                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {filteredOpps.length === 0 && (
                <div className="text-center py-32 space-y-4">
                    <Layers className="w-12 h-12 text-stone-200 mx-auto" />
                    <p className="text-stone-400 font-medium">No programs found for this criteria.</p>
                </div>
            )}
        </div>
    );
}
