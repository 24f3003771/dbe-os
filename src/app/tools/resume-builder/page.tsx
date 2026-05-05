"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText, Target, PlusCircle, ChevronRight, Info, ShieldCheck, Zap, Briefcase } from "lucide-react";
import Link from "next/link";

const paths = [
  {
    id: "build",
    title: "Resume Builder",
    description: "Start from scratch or tailor an existing resume with a professional, ATS-optimized template. Get real-time AI suggestions to match any job description.",
    icon: PlusCircle,
    href: "/tools/resume-builder/build",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    tag: "Build & Tailor"
  }
];

export default function ResumeBuilderLanding() {
  return (
    <div className="min-h-screen bg-stone-50/50">
            {/* Minimal Header */}
            <header className="py-12 px-6 border-b border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-100">
                        <Sparkles className="w-3 h-3" /> AI Engine Active
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-slate-900 italic leading-none">
                                Resume <span className="text-indigo-600 text-stroke-sm">Builder.</span>
                            </h1>
                            <p className="text-slate-500 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
                                Build ATS-optimized resumes with real-time AI tailoring. Zero hallucinations, just high-impact professional profiles.
                            </p>
                        </div>
                        <Link 
                            href="/tools/resume-builder/build"
                            className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                        >
                            Launch AI Forge <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic">Smart Bullets</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            AI-powered enhancement that converts passive sentences into action-oriented, metric-driven achievements.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic">JD Matching</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Tailor your entire resume to a specific job description to ensure you rank at the top of recruiter search results.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic">ATS Ready</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            JSON-standard structures that are guaranteed to be readable by every major Applicant Tracking System.
                        </p>
                    </div>
                </div>

                {/* Why ATS Banner */}
                <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative">
                    <div className="relative z-10 max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-indigo-300 font-black text-[10px] tracking-widest uppercase border border-white/10">
                            <Info className="w-3.5 h-3.5" /> Industry Insight
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter leading-none italic">
                            75% of resumes are <span className="text-indigo-400">never seen</span> by a human.
                        </h2>
                        <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                            Applicant Tracking Systems (ATS) reject profiles that aren't structured correctly. Our builder ensures 100% compatibility so you actually land the interview.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                </section>
            </main>
    </div>
  );
}

