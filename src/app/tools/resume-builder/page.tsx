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
    <div className="min-h-screen bg-white pb-20">
            {/* Minimal Header & Primary Action */}
            <header className="py-20 md:py-32 px-6 border-b border-slate-50 bg-white relative overflow-hidden text-center">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-slate-900 italic leading-none animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
                            Resume <span className="text-indigo-600 text-stroke-sm">Builder.</span>
                        </h1>
                        <p className="text-slate-500 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
                            The professional's choice for ATS-optimized profiles. Build your career foundation with real-time AI guidance.
                        </p>
                    </div>

                    <div className="pt-8 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                        <Link 
                            href="/tools/resume-builder/build"
                            className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-lg uppercase tracking-widest hover:bg-indigo-600 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 group"
                        >
                            Start Building <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500 to-transparent rounded-full blur-[120px]" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-24 space-y-24">
                {/* Use Cases & Why it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tight">Smart Bullets</h3>
                        <p className="text-slate-500 text-base font-medium leading-relaxed italic">
                            Don't just list tasks. Our AI transforms simple points into action-oriented achievements that recruiters notice.
                        </p>
                    </div>

                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-900 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tight">JD Keywords</h3>
                        <p className="text-slate-500 text-base font-medium leading-relaxed italic">
                            Match specific job descriptions instantly. Our engine identifies missing keywords to help you rank at the top.
                        </p>
                    </div>

                    <div className="space-y-4 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tight">ATS Standard</h3>
                        <p className="text-slate-500 text-base font-medium leading-relaxed italic">
                            Built on industry-standard JSON resume schemas. Guaranteed to be 100% readable by every major ATS platform.
                        </p>
                    </div>
                </div>

                {/* Industry Banner */}
                <section className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group">
                    <div className="max-w-4xl relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-indigo-300 font-black text-xs tracking-widest uppercase border border-white/10">
                            <Info className="w-4 h-4" /> Why it matters
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-[0.9] italic group-hover:scale-[1.02] transition-transform duration-700">
                            Stop being <span className="text-indigo-400">rejected</span> by robots.
                        </h2>
                        <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed">
                            75% of resumes are filtered out before a human ever sees them. Our builder ensures you survive the first scan and reach the interviewer's desk.
                        </p>
                    </div>
                    {/* Decorative Blur */}
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-all duration-1000" />
                </section>
            </main>
    </div>
  );
}

