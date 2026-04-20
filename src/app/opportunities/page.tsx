"use client";

import { motion } from "framer-motion";
import { 
    Trophy, Briefcase, Rocket, BookOpen, 
    ChevronRight, Sparkles, Star, Target 
} from "lucide-react";
import Link from "next/link";

export default function OpportunityHubPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Hero Section */}
            <header className="relative p-12 md:p-20 bg-[#1A1A1A] rounded-[3rem] overflow-hidden text-center space-y-6">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-50" />
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 font-black text-[10px] tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> Discovery + Preparation Engine
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-white leading-none">
                        Opportunity <span className="text-indigo-500">Hub.</span>
                    </h1>
                    <p className="text-stone-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto italic">
                        "Don't just discover. Prepare to dominate."
                    </p>
                </div>
                
                {/* Floaties */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            </header>

            {/* Main Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {/* Competitions Card */}
                <Link href="/opportunities/COMPETITION" className="group">
                    <div className="h-full bg-white border border-stone-100 rounded-[2.5rem] p-10 flex flex-col justify-between hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 transform group-hover:-translate-y-2">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-[#1A1A1A]">Competitions.</h2>
                                <p className="text-stone-500 font-medium">B-school cases, brand challenges, and hackathons with winning roadmaps.</p>
                            </div>
                        </div>
                        <div className="mt-12 flex items-center gap-3 font-black text-indigo-600 uppercase tracking-widest text-xs">
                            Explore Competitions <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>

                {/* Internships Card */}
                <Link href="/opportunities/INTERNSHIP" className="group">
                    <div className="h-full bg-white border border-stone-100 rounded-[2.5rem] p-10 flex flex-col justify-between hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 transform group-hover:-translate-y-2">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-[#1A1A1A]">Internships.</h2>
                                <p className="text-stone-500 font-medium">structured programs for MNCs, startups, and consulting giants.</p>
                            </div>
                        </div>
                        <div className="mt-12 flex items-center gap-3 font-black text-[#1A1A1A] uppercase tracking-widest text-xs">
                            View Programs <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Preparation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <Link href="/opportunities/winning-repository" className="bg-[#EEF2FF] p-8 rounded-[2rem] border border-indigo-100/50 hover:shadow-xl transition-all group">
                    <div className="flex flex-col gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Star className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-indigo-900 text-lg">Winning Repository</h3>
                            <p className="text-indigo-600/70 text-sm font-bold uppercase tracking-widest leading-tight">Past case solutions</p>
                        </div>
                    </div>
                </Link>

                <div className="bg-[#FDF2F8] p-8 rounded-[2rem] border border-pink-100/50 hover:shadow-xl transition-all cursor-not-allowed opacity-80">
                    <div className="flex flex-col gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Target className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-pink-900 text-lg">Interview Guides</h3>
                            <p className="text-pink-600/70 text-sm font-bold uppercase tracking-widest leading-tight">BCG, Google, HUL Prep</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#ECFDF5] p-8 rounded-[2rem] border border-emerald-100/50 hover:shadow-xl transition-all cursor-not-allowed opacity-80">
                    <div className="flex flex-col gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Rocket className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-emerald-900 text-lg">Preparation Tools</h3>
                            <p className="text-emerald-600/70 text-sm font-bold uppercase tracking-widest leading-tight">Frameworks & Templates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
