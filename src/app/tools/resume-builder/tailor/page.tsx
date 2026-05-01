"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, Briefcase, Sparkles, Wand2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";

export default function TailorPage() {
  const { resume } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; missingKeywords: string[]; suggestions: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/resume/match-jd", {
        method: "POST",
        body: JSON.stringify({
          resumeText: JSON.stringify(resume), // Sending whole JSON as text for analysis
          jobDescription
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Match error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Link 
        href="/tools/resume-builder"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Back to Forge</span>
      </Link>

      <div className="space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">JD Keyword Tailor</h1>
              <p className="text-on-surface-variant font-medium">Match your resume to a specific job description using AI.</p>
            </div>
          </div>
        </header>

        {!result ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-sm font-black uppercase tracking-widest text-on-surface">Step 1: Your Resume</h2>
                     {resume ? (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {resume.basics.name}
                        </span>
                     ) : (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> No Resume Loaded
                        </span>
                     )}
                  </div>
                  <div className={`h-[300px] bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4 ${!resume && 'border-dashed'}`}>
                     <Briefcase className="w-8 h-8 text-on-surface-variant" />
                     {resume ? (
                        <div className="space-y-2">
                           <p className="text-sm font-bold text-on-surface">Resume Ready</p>
                           <p className="text-xs text-on-surface-variant">Using: {resume.basics.label || 'Your current draft'}</p>
                           <Link href="/tools/resume-builder/enhance" className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pt-2">Change Resume</Link>
                        </div>
                     ) : (
                        <div className="space-y-2">
                           <p className="text-sm text-on-surface-variant font-medium">Please upload or build a resume first.</p>
                           <Link href="/tools/resume-builder/enhance" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest inline-block mt-2">Upload Now</Link>
                        </div>
                     )}
                  </div>
               </section>

               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-sm font-black uppercase tracking-widest text-on-surface">Step 2: Job Description</h2>
                     <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">Required</span>
                  </div>
                  <textarea 
                     placeholder="Paste the full job description here..."
                     value={jobDescription}
                     onChange={(e) => setJobDescription(e.target.value)}
                     className="w-full h-[300px] bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium resize-none placeholder:text-stone-400"
                  />
               </section>
            </div>

            <div className="flex justify-center">
               <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resume || !jobDescription}
                className="group relative bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
               >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  {isAnalyzing ? "Analyzing Keywords..." : "Analyze & Tailor Now"}
                  {!isAnalyzing && <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />}
               </button>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-100" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * result.score) / 100} className="text-blue-600 transition-all duration-1000" />
                     </svg>
                     <span className="absolute text-2xl font-black text-on-surface">{result.score}%</span>
                  </div>
                  <div>
                     <h3 className="font-black text-on-surface">Match Score</h3>
                     <p className="text-xs text-on-surface-variant">Compatibility with JD</p>
                  </div>
               </div>

               <div className="md:col-span-2 bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 space-y-6">
                  <h3 className="font-black text-on-surface flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-amber-500" />
                     Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {result.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-error/5 text-error text-[10px] font-black uppercase tracking-widest rounded-lg border border-error/10">
                           {kw}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 space-y-6">
               <h3 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-indigo-600" />
                  Tailoring Suggestions
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.suggestions.map((s, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl border border-indigo-200/50 shadow-sm flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                        <p className="text-sm font-medium text-indigo-900 leading-relaxed">{s}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex justify-center gap-4">
               <button onClick={() => setResult(null)} className="px-8 py-4 bg-surface-container-high rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest transition-all">
                  New Analysis
               </button>
               <Link href="/tools/resume-builder/build" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Apply Suggestions
               </Link>
            </div>
          </motion.div>
        )}

        <div className="bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-8 flex items-start gap-6">
           <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-blue-600 shadow-sm">
              <Target className="w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h3 className="font-black text-on-surface">How it works</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                 Our NLP engine extracts keywords and skills from the JD, compares them with your resume, and calculates a match score. The "Auto-Tailor" feature then suggests subtle rewrites to highlight relevant experience without lying.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

