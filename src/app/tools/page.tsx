"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Calculator, FileText, ChevronRight, Info, Briefcase,
  Star, Trophy, BookOpen, Rocket, Users, Bell, Check, Loader2, Lock
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";


// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const tools = [
  {
    id: "matchforge",
    title: "Find Your Team",
    subtitle: "MatchForge",
    description: "Discover co-founders, case competition teammates, and study partners inside the DBE community — matched by skills & goals.",
    icon: Users,
    href: "/matchforge",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-600",
    status: "Active",
    hasWaitlist: false,
  },
  {
    id: "cgpa-calculator",
    title: "Check My CGPA",
    subtitle: "CGPA Calculator",
    description: "Calculate your Term-wise Weighted Average Marks (WAM) and Cumulative GPA using the official IIMB BBA DBE grading formula.",
    icon: Calculator,
    href: "/tools/cgpa-calculator",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    status: "Active",
    hasWaitlist: false,
  },
  {
    id: "resume-builder",
    title: "Build My Resume with AI",
    subtitle: "AI Resume Forge",
    description: "Create, tailor, and strengthen ATS-friendly resumes using AI. Designed for IIMB students targeting top-tier recruiters.",
    icon: Briefcase,
    href: "/tools/resume-builder",
    color: "bg-violet-600",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    gradientFrom: "from-violet-500",
    gradientTo: "to-indigo-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "internships",
    title: "Find Internships Near Me",
    subtitle: "Internship Hunter",
    description: "Browse verified Tier-1 internship portals and fetch live opportunities from 50+ global firms using LinkedIn AI extraction.",
    icon: Rocket,
    href: "/tools/internships",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "competitions",
    title: "Join a Competition",
    subtitle: "Competition Finder",
    description: "Discover B-school case challenges, national hackathons, and brand quizzes — live from Unstop and verified corporate portals.",
    icon: Trophy,
    href: "/tools/competitions",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "pitch-decks",
    title: "See Winning Pitch Decks",
    subtitle: "Pro Pitch Decks",
    description: "Exclusive access to award-winning pitch decks from global brands, consulting firms, and top B-school competitions.",
    icon: FileText,
    href: "/tools/pitch-decks",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "winners-bank",
    title: "Learn From Winners",
    subtitle: "Winners Bank",
    description: "Study real winning submissions and strategies from top B-school competitions and internship selection processes.",
    icon: Star,
    href: "/tools/winning-repository",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "career-guides",
    title: "Read Career Playbooks",
    subtitle: "Career Guides",
    description: "Official preparation playbooks for BCG, Google, HUL, and other Tier-1 companies — curated for DBE students.",
    icon: BookOpen,
    href: "/tools/career-guides",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
    status: "Active",
    hasWaitlist: true,
  },
  {
    id: "transcript-generator",
    title: "Preview My Transcript",
    subtitle: "Transcript Preview",
    description: "Generate a mock academic transcript to visualize your grades, performance trends, and academic standing at a glance.",
    icon: FileText,
    href: "#",
    color: "bg-stone-500",
    lightColor: "bg-stone-100",
    textColor: "text-stone-600",
    gradientFrom: "from-stone-400",
    gradientTo: "to-stone-600",
    status: "Coming Soon",
    hasWaitlist: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WAITLIST BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function WaitlistButton({
  toolId,
  textColor,
  gradientFrom,
  gradientTo,
}: {
  toolId: string;
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPop, setShowPop] = useState(false);

  // derive the fingerprint from localStorage (persisted browser id)
  const getFingerprint = () => {
    let fp = localStorage.getItem("dbe_fp");
    if (!fp) {
      fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("dbe_fp", fp);
    }
    return fp;
  };

  useEffect(() => {
    // Check if already joined (locally)
    const key = `waitlist_${toolId}`;
    if (localStorage.getItem(key)) setJoined(true);

    // Fetch real count
    fetch(`/api/waitlist?tool=${toolId}`)
      .then(r => r.json())
      .then(d => setCount(d.count ?? 0))
      .catch(() => setCount(0));
  }, [toolId]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (joined || loading) return;
    setLoading(true);

    try {
      const fingerprint = getFingerprint();
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, fingerprint }),
      });
      const data = await res.json();

      if (data.already || data.success || data.mock) {
        localStorage.setItem(`waitlist_${toolId}`, "1");
        setJoined(true);
        setCount(data.count ?? (count !== null ? count + 1 : 1));
        setShowPop(true);
        setTimeout(() => setShowPop(false), 3000);
      }
    } catch {
      // Optimistic update even on error
      localStorage.setItem(`waitlist_${toolId}`, "1");
      setJoined(true);
      setCount(prev => (prev !== null ? prev + 1 : 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showPop && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl z-20"
          >
            🎉 You&apos;re on the list!
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleJoin}
        className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
          joined
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 cursor-default"
            : "bg-surface-container border-outline-variant/20 hover:border-current hover:bg-white/80 text-on-surface-variant"
        }`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : joined ? (
          <Check className="w-3 h-3" />
        ) : (
          <Bell className="w-3 h-3" />
        )}
        {joined ? "Joined!" : "Join Waitlist"}
        {count !== null && (
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black ${
            joined ? "bg-emerald-500/20 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {count}
          </span>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL CARD
// ─────────────────────────────────────────────────────────────────────────────
function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  const isComingSoon = tool.status === "Coming Soon";
  const CardTag = isComingSoon ? "div" : Link;
  const cardProps = isComingSoon ? {} : { href: tool.href };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <CardTag
        {...(cardProps as any)}
        className={`group block h-full bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] p-7 transition-all duration-500 relative overflow-hidden ${
          isComingSoon
            ? "cursor-default opacity-80"
            : "hover:shadow-2xl hover:border-transparent hover:-translate-y-1"
        }`}
      >
        {/* Gradient hover bg */}
        {!isComingSoon && (
          <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-[2rem]`} />
        )}

        <div className="relative z-10 flex flex-col h-full gap-4">
          {/* Top row */}
          <div className="flex justify-between items-start">
            <div className={`w-14 h-14 ${tool.lightColor} rounded-2xl flex items-center justify-center ${tool.textColor} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
              <tool.icon className="w-7 h-7" />
            </div>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
              tool.status === "Active"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}>
              {tool.status === "Coming Soon" && <Lock className="w-2.5 h-2.5" />}
              {tool.status}
            </span>
          </div>

          {/* Title block */}
          <div className="flex-1">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${tool.textColor} opacity-70`}>
              {tool.subtitle}
            </p>
            <h2 className="text-xl font-black font-headline text-on-surface mb-2 leading-tight">
              {tool.title}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
            {tool.hasWaitlist && !isComingSoon ? (
              <WaitlistButton
                toolId={tool.id}
                textColor={tool.textColor}
                gradientFrom={tool.gradientFrom}
                gradientTo={tool.gradientTo}
              />
            ) : tool.hasWaitlist && isComingSoon ? (
              <WaitlistButton
                toolId={tool.id}
                textColor={tool.textColor}
                gradientFrom={tool.gradientFrom}
                gradientTo={tool.gradientTo}
              />
            ) : (
              <div />
            )}

            {!isComingSoon && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${tool.textColor} flex items-center gap-1.5 group-hover:gap-3 transition-all`}>
                Open <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Decorative glow */}
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-all duration-700 group-hover:scale-150`} />
      </CardTag>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const activeTools = tools.filter(t => t.status === "Active");
  const comingTools = tools.filter(t => t.status === "Coming Soon");

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Academic Tools</h1>
            <p className="text-on-surface-variant font-medium">Smart utilities built for the BBA DBE community.</p>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            All tools are built for the <strong>IIMB BBA DBE Programme</strong>. Calculations follow the official programme manual.
            Use the <strong>Join Waitlist</strong> button to vote for a tool — the more people who join, the faster we build it!
          </p>
        </div>
      </motion.div>

      {/* Active Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {activeTools.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
      </div>

      {/* Coming Soon */}
      {comingTools.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 px-3">Coming Next</span>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {comingTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={activeTools.length + i} />
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <section>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight">Have an idea for a tool?</h3>
              <p className="text-indigo-100 font-medium max-w-md">
                We build what the community needs. If you have an idea that will help DBE students succeed — let the founders know.
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
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-violet-400/10 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
