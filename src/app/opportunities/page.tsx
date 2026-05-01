"use client";

import { motion } from "framer-motion";
import { 
    Trophy, Briefcase, Rocket, BookOpen, 
    ChevronRight, Sparkles, Star, Target 
} from "lucide-react";
import Link from "next/link";

export default function OpportunityHubPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-16">
            {/* Hero Section */}
            <header className="relative p-8 md:p-20 bg-[#1A1A1A] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden text-center space-y-4 md:space-y-6">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-50" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-indigo-400 font-black text-[8px] md:text-[10px] tracking-widest uppercase">
                        <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5" /> Discovery + Preparation Engine
                    </div>
                    <h1 className="text-3xl md:text-8xl font-black font-headline tracking-tighter text-white leading-tight">
                        Opportunity <span className="text-indigo-500">Hub.</span>
                    </h1>
                    <p className="text-stone-400 text-base md:text-2xl font-medium max-w-2xl mx-auto italic">
                        "Don't just discover. Prepare to dominate."
                    </p>
                </div>
                
                {/* Floaties */}
                <div className="absolute -bottom-10 -right-10 w-48 md:w-64 h-48 md:h-64 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-violet-600/10 rounded-full blur-3xl" />
            </header>

            {/* Main Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2 md:px-4">
                {/* Competitions Card */}
                <Link href="/opportunities/competitions" className="group">
                    <div className="h-full bg-white border border-stone-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-200 transform">
                        <div className="space-y-4 md:space-y-6">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Trophy className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A]">Competitions.</h2>
                                <p className="text-stone-500 font-medium text-sm md:text-base">B-school cases, brand challenges, and hackathons with winning roadmaps.</p>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-12 flex items-center gap-3 font-black text-indigo-600 uppercase tracking-widest text-[10px] md:text-xs">
                            Explore Competitions <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                    </div>
                </Link>

                {/* Internships Card */}
                <Link href="/opportunities/internships" className="group">
                    <div className="h-full bg-white border border-stone-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 transform group-hover:-translate-y-2">
                        <div className="space-y-4 md:space-y-6">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-stone-50 rounded-xl md:rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                                <Briefcase className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A]">Internship <span className="text-indigo-600">Hunter.</span></h2>
                                <p className="text-stone-500 font-medium text-sm md:text-base">The ultimate aggregation platform for Tier 1 programs and recurring cycles.</p>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-12 flex items-center gap-3 font-black text-[#1A1A1A] uppercase tracking-widest text-[10px] md:text-xs">
                            Launch Hunter Engine <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Preparation Sections (Disabled/Moved to Tools) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-20">
                <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                    <h3 className="text-xl font-black text-on-surface mb-2">Dominance Prep</h3>
                    <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-6">
                        Access all preparation tools, winning roadmaps, and pro pitch decks in the Academic Tools section.
                    </p>
                    <Link href="/tools" className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                        Go to Tools <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="bg-pink-500/5 p-8 rounded-[2rem] border border-pink-500/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-pink-600" />
                        <h3 className="text-xl font-black text-pink-900">Interview Engine</h3>
                    </div>
                    <p className="text-pink-800/60 font-medium text-sm leading-relaxed mb-6">
                        Custom preparation guides for BCG, Google, and HUL are currently in development.
                    </p>
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Under Maintenance
                    </span>
                </div>
            </div>
        </div>
    );
}
