"use client";

import { motion } from "framer-motion";
import { Wrench, Calculator, FileText, ArrowRight, ChevronRight, Info, Briefcase, Star, Trophy, BookOpen, Rocket, Users } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    id: "matchforge",
    title: "MatchForge",
    description: "Find co-founders, case competition teammates, and learning partners within the DBE community.",
    icon: Users,
    href: "/matchforge",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    status: "Active"
  },
  {
    id: "cgpa-calculator",
    title: "CGPA Calculator",
    description: "Calculate your Term-wise Weighted Average Marks (WAM) and Cumulative Grade Point Average (CGPA) based on IIMB BBA DBE manual.",
    icon: Calculator,
    href: "/tools/cgpa-calculator",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    status: "Active"
  },
  {
    id: "resume-builder",
    title: "AI Resume Forge",
    description: "Build, enhance, and tailor ATS-friendly resumes using AI. Optimized for IIMB students and top-tier recruiters.",
    icon: Briefcase,
    href: "/tools/resume-builder",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    status: "Active"
  },
  {
    id: "internships",
    title: "Internship Hunter",
    description: "The ultimate discovery engine for Tier 1 internships, recurring program cycles, and MNC opportunities.",
    icon: Rocket,
    href: "/tools/internships",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    status: "Active"
  },
  {
    id: "competitions",
    title: "Competitions",
    description: "B-school cases, brand challenges, and hackathons with winning roadmaps and reverse-engineered strategies.",
    icon: Trophy,
    href: "/tools/competitions",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    status: "Active"
  },
  {
    id: "pitch-decks",
    title: "Pro Pitch Decks",
    description: "Exclusive access to award-winning pitch decks from global organizations and consulting firms.",
    icon: FileText,
    href: "/tools/pitch-decks",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    status: "Active"
  },
  {
    id: "winners-bank",
    title: "Winners Bank",
    description: "Access winning roadmaps and case submissions from top B-school competitions and internships.",
    icon: Star,
    href: "/tools/winning-repository",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    status: "Active"
  },
  {
    id: "career-guides",
    title: "Career Guides",
    description: "Official playbooks and preparation guides for BCG, Google, HUL, and other Tier 1 companies.",
    icon: BookOpen,
    href: "/tools/career-guides",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    status: "Active"
  },
  {
    id: "transcript-generator",
    title: "Transcript Preview",
    description: "Generate a mock transcript of your grades to visualize your academic journey and performance trends.",
    icon: FileText,
    href: "#",
    color: "bg-stone-500",
    lightColor: "bg-stone-50",
    textColor: "text-stone-600",
    status: "Coming Soon"
  }
];

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Academic Tools</h1>
            <p className="text-on-surface-variant font-medium">Utilities built for the BBA DBE community.</p>
          </div>
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            These tools are designed based on the official <strong>IIMB BBA DBE Programme Manual</strong>. 
            All calculations use the absolute grading system and weighted average methods prescribed by the institute.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={tool.href}
              className={`group block h-full bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] p-8 hover:shadow-2xl hover:border-${tool.textColor.split('-')[1]}-500/30 transition-all duration-500 relative overflow-hidden`}
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 ${tool.lightColor} rounded-2xl flex items-center justify-center ${tool.textColor} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    <tool.icon className="w-8 h-8" />
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                    {tool.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black font-headline text-on-surface mb-2">{tool.title}</h2>
                  <p className="text-on-surface-variant font-medium leading-relaxed">{tool.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className={`text-sm font-black uppercase tracking-widest ${tool.textColor} flex items-center gap-2 group-hover:gap-4 transition-all`}>
                    Launch Tool <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Decorative Background Element */}
              <div className={`absolute -bottom-12 -right-12 w-48 h-48 ${tool.lightColor} rounded-full opacity-30 blur-3xl group-hover:scale-150 transition-transform duration-700`} />
            </Link>
          </motion.div>
        ))}
      </div>

      <section className="mt-20 border-t border-outline-variant/10 pt-12">
        <h2 className="text-xl font-black font-headline text-on-surface mb-6">Need a specific tool?</h2>
        <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight">Request a Feature</h3>
              <p className="text-indigo-100 font-medium max-w-md">
                We are constantly building new utilities for the DBE OS. If you have an idea for a tool that helps the community, let us know!
              </p>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
                Contact Founders
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Wrench className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}

