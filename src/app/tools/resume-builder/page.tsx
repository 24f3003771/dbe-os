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
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Header Section */}
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight">
                Resume Builder
              </h1>
            </div>
            <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
              The ultimate career command center for DBE students. Build, tailor, and optimize resumes that get you past the ATS and into the interview.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-indigo-600 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">AI Engine Active</span>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low border border-outline-variant/10 p-5 rounded-3xl flex items-start gap-4 shadow-sm"
        >
          <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-600">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-on-surface leading-none">Why ATS-Friendly Matters?</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              75% of resumes are rejected by Applicant Tracking Systems before a human even sees them. Our builder uses clean, parsed structures (JSON Resume Standard) that ensure 100% readability by any recruiter software.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Path Selection Grid */}
      <div className="grid grid-cols-1 max-w-2xl mx-auto relative z-10">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
          >
            <Link 
              href={path.href}
              className="group block h-full bg-surface-container-lowest border border-outline-variant/20 rounded-[2.5rem] p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              <div className="relative z-10 flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <div className={`w-16 h-16 ${path.lightColor} rounded-3xl flex items-center justify-center ${path.textColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-black/5`}>
                    <path.icon className="w-8 h-8" />
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${path.lightColor} ${path.textColor} border border-black/5`}>
                    {path.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight group-hover:text-indigo-600 transition-colors">
                    {path.title}
                  </h2>
                  <p className="text-on-surface-variant font-medium leading-relaxed text-sm">
                    {path.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-outline-variant/5">
                <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${path.textColor} group-hover:gap-4 transition-all duration-300`}>
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Decorative Glow */}
              <div className={`absolute -bottom-16 -right-16 w-48 h-48 ${path.lightColor} rounded-full opacity-40 blur-[80px] group-hover:scale-150 transition-transform duration-700`} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Feature Highlight Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 bg-surface-container p-8 md:p-12 rounded-[3rem] border border-outline-variant/10 overflow-hidden relative"
      >
        <div className="space-y-8 relative z-10">
          <div>
            <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-4 block">Powered by Gemini & OpenAI</span>
            <h2 className="text-3xl md:text-4xl font-black font-headline text-on-surface leading-[1.1]">
              Smart Bullet Points.<br/>Zero Hallucinations.
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center text-indigo-600">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-on-surface">Action-Oriented Language</p>
                <p className="text-sm text-on-surface-variant">We transform "I did social media" into "Increased organic engagement by 40% through data-driven content strategy."</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-on-surface">Universal PDF Export</p>
                <p className="text-sm text-on-surface-variant">Export clean, selectable-text PDFs that maintain their formatting across all application portals.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center relative">
          <div className="w-full aspect-square max-w-[400px] bg-gradient-to-br from-indigo-500/10 to-amber-500/10 rounded-[3rem] border border-white/20 backdrop-blur-3xl flex items-center justify-center p-8 relative">
             <div className="w-full bg-white rounded-2xl shadow-2xl p-6 space-y-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="h-4 w-1/3 bg-stone-100 rounded-full" />
                <div className="h-4 w-1/2 bg-stone-100 rounded-full" />
                <div className="space-y-2 pt-4">
                   <div className="h-2 w-full bg-indigo-50 rounded-full" />
                   <div className="h-2 w-full bg-indigo-50 rounded-full" />
                   <div className="h-2 w-4/5 bg-indigo-50 rounded-full" />
                </div>
                <div className="flex gap-2 pt-4">
                   <div className="h-8 w-20 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <div className="h-2 w-12 bg-emerald-500/20 rounded-full" />
                   </div>
                   <div className="h-8 w-24 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <div className="h-2 w-16 bg-blue-500/20 rounded-full" />
                   </div>
                </div>
             </div>
             {/* Sparkles */}
             <Sparkles className="absolute top-4 right-4 text-amber-500 w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />
      </motion.section>
    </div>
  );
}

