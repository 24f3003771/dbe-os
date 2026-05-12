"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Calculator, FileText, Info, Briefcase,
  Star, Trophy, BookOpen, Rocket, Users, Bell, Check, Loader2,
  ChevronRight, Sparkles, Zap, Target, TrendingUp, Lock
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// ─── Waitlist Button ──────────────────────────────────────────────────────────
function WaitlistButton({ toolId, accent }: { toolId: string; accent: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popped, setPopped] = useState(false);

  const fp = () => {
    let id = localStorage.getItem("dbe_fp");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("dbe_fp", id); }
    return id;
  };

  useEffect(() => {
    if (localStorage.getItem(`wl_${toolId}`)) setJoined(true);
    fetch(`/api/waitlist?tool=${toolId}`).then(r => r.json()).then(d => setCount(d.count ?? 0)).catch(() => setCount(0));
  }, [toolId]);

  const join = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (joined || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toolId, fingerprint: fp() }) });
      const d = await res.json();
      localStorage.setItem(`wl_${toolId}`, "1");
      setJoined(true);
      setCount(d.count ?? (count !== null ? count + 1 : 1));
      setPopped(true);
      setTimeout(() => setPopped(false), 3000);
    } catch {
      localStorage.setItem(`wl_${toolId}`, "1");
      setJoined(true);
      setCount(c => c !== null ? c + 1 : 1);
    } finally { setLoading(false); }
  };

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {popped && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-20">
            🎉 You&apos;re on the list!
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={join}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
          joined
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : `bg-gradient-to-r ${accent} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
        }`}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : joined ? <Check className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        {joined ? "You're on the waitlist!" : "Join Waitlist — Be First"}
        {count !== null && (
          <span className="ml-1 bg-white/20 px-2.5 py-1 rounded-lg text-xs font-black">
            {count} {count === 1 ? "person" : "people"}
          </span>
        )}
      </button>
    </div>
  );
}

// ─── Tools Data ───────────────────────────────────────────────────────────────
const LIVE_TOOLS = [
  {
    id: "cgpa-calculator", title: "Check My CGPA", subtitle: "CGPA Calculator",
    icon: Calculator, href: "/tools/cgpa-calculator",
    textColor: "text-amber-600", lightColor: "bg-amber-50",
    description: "Calculate WAM & CGPA using the official IIMB BBA DBE grading formula.",
  },
];

const COMING_TOOLS = [
  {
    id: "matchforge",
    title: "Find Your Team",
    subtitle: "MatchForge",
    icon: Users,
    accent: "from-indigo-500 to-purple-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    tagline: "The smartest way to find co-founders, case teammates & study partners in the DBE community.",
    features: [
      "Skill-based matching — find people who complement your strengths",
      "Filter by interest: Case Comps, Startups, Research, Study Groups",
      "In-app connection requests and profile previews",
      "Leaderboard integration to find top performers",
    ],
    badge: "Community",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "resume-builder",
    title: "Build My Resume with AI",
    subtitle: "AI Resume Forge",
    icon: Briefcase,
    accent: "from-violet-600 to-indigo-600",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    tagline: "Land interviews at Tier-1 companies with an AI-powered resume.",
    features: [
      "AI rewrites every bullet for ATS compatibility",
      "LinkedIn data import — auto-fills your experience",
      "One-click tailoring for each job description",
      "Export as PDF, Word, or shareable link",
    ],
    badge: "AI-Powered",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "internships",
    title: "Find Internships Near Me",
    subtitle: "Internship Hunter",
    icon: Rocket,
    accent: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    tagline: "50+ Tier-1 portals + live LinkedIn extraction in one place.",
    features: [
      "Verified direct portals: Google, BCG, HUL, Goldman, and 47 more",
      "Live AI job extraction — refreshed every hour",
      "Filter by sector, tier, and role type",
      "Deadline alerts & one-click apply links",
    ],
    badge: "Live Data",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "competitions",
    title: "Join a Competition",
    subtitle: "Competition Finder",
    icon: Trophy,
    accent: "from-orange-500 to-red-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    tagline: "Never miss HUL LIME, BCG Strategy Cup, or Google HashCode again.",
    features: [
      "Live Unstop feed — all open B-school competitions",
      "Elite corporate challenges: HUL, TAS, Reliance, Flipkart GRiD",
      "Category filters: Marketing, Finance, Tech, Consulting",
      "Winning roadmap guides for every major competition",
    ],
    badge: "Live Sync",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "pitch-decks",
    title: "See Winning Pitch Decks",
    subtitle: "Pro Pitch Decks",
    icon: FileText,
    accent: "from-blue-500 to-cyan-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    tagline: "Study award-winning decks from global brands and consulting firms.",
    features: [
      "100+ real pitch decks from B-school competitions",
      "Decks from BCG, McKinsey, HUL, Google, and more",
      "In-browser PDF viewer — no download needed",
      "Filter by company, year, placing, and type",
    ],
    badge: "100+ Decks",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "winners-bank",
    title: "Learn From Winners",
    subtitle: "Winners Bank",
    icon: Star,
    accent: "from-violet-500 to-purple-700",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    tagline: "Reverse-engineer winning strategies from the top 1% of B-school performers.",
    features: [
      "Real winning submissions with annotated strategies",
      "Author notes on how they cracked each round",
      "Covers internships, competitions & case studies",
      "Searchable archive by company and domain",
    ],
    badge: "Exclusive",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "career-guides",
    title: "Read Career Playbooks",
    subtitle: "Career Guides",
    icon: BookOpen,
    accent: "from-rose-500 to-pink-600",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    tagline: "Official preparation guides for BCG, Google, HUL, and other Tier-1 companies.",
    features: [
      "Platform-by-platform interview and application breakdowns",
      "Role-specific prep: PM, Consulting, Finance, Marketing",
      "Updated for 2025 recruitment cycles",
      "Downloadable PDF playbooks",
    ],
    badge: "Curated",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    id: "transcript-generator",
    title: "Preview My Transcript",
    subtitle: "Transcript Preview",
    icon: FileText,
    accent: "from-stone-500 to-slate-600",
    lightColor: "bg-stone-100",
    textColor: "text-stone-600",
    tagline: "Visualize your academic journey before the official transcript is out.",
    features: [
      "Auto-populated from your CGPA data",
      "Matches IIMB official transcript format",
      "Export as PDF for internal use",
      "Spot gaps in your academic performance early",
    ],
    badge: "Soon",
    badgeColor: "bg-stone-100 text-stone-600",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">DBE OS Tools</h1>
            <p className="text-on-surface-variant font-medium">Smart utilities built for the BBA DBE community.</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            The tools below are <strong>coming in the next version</strong> of DBE OS.
            Join the waitlist for each tool you want — the more people who sign up, the sooner we ship it! 🚀
          </p>
        </div>
      </motion.div>

      {/* Live Tools */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-4">Live Now</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LIVE_TOOLS.map((tool, i) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={tool.href}
                className="group flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-12 h-12 ${tool.lightColor} rounded-xl flex items-center justify-center ${tool.textColor} shrink-0`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[9px] font-black uppercase tracking-widest ${tool.textColor} mb-0.5`}>{tool.subtitle}</p>
                  <h3 className="font-black text-on-surface text-base">{tool.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium truncate">{tool.description}</p>
                </div>
                <div className={`shrink-0 flex items-center gap-1 text-xs font-black ${tool.textColor}`}>
                  Open <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-outline-variant/20" />
        <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/15">
          <Lock className="w-3.5 h-3.5 text-on-surface-variant/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Coming in Next Version</span>
        </div>
        <div className="h-px flex-1 bg-outline-variant/20" />
      </div>

      {/* Coming Soon Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COMING_TOOLS.map((tool, i) => (
          <motion.div key={tool.id}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] p-7 flex flex-col gap-5 hover:shadow-xl transition-all duration-400 group"
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-3">
              <div className={`w-16 h-16 ${tool.lightColor} rounded-2xl flex items-center justify-center ${tool.textColor} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <tool.icon className="w-8 h-8" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tool.badgeColor}`}>
                {tool.badge}
              </span>
            </div>

            {/* Title */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${tool.textColor} opacity-70 mb-1`}>{tool.subtitle}</p>
              <h2 className="text-2xl font-black font-headline text-on-surface leading-tight mb-2">{tool.title}</h2>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{tool.tagline}</p>
            </div>

            {/* Feature list */}
            <ul className="space-y-2.5">
              {tool.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm">
                  <div className={`w-5 h-5 rounded-lg ${tool.lightColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Check className={`w-3 h-3 ${tool.textColor}`} />
                  </div>
                  <span className="text-on-surface-variant font-medium">{f}</span>
                </li>
              ))}
            </ul>

            {/* Waitlist CTA */}
            <div className="pt-1">
              <WaitlistButton toolId={tool.id} accent={tool.accent} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="text-3xl font-black tracking-tight">Have an idea for a tool?</h3>
            <p className="text-indigo-100 font-medium max-w-md">We build what the community needs. Tell the founders what would help you most.</p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
              Contact Founders
            </button>
          </div>
          <div className="hidden md:block w-28 h-28 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
            <Wrench className="w-14 h-14 text-white" />
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
