"use client";

import { motion } from "framer-motion";
import {
  Target, Bell, Check, Loader2, Sparkles,
  Timer, BrainCircuit, BarChart3, GraduationCap, Zap, Lock
} from "lucide-react";
import { useState, useEffect } from "react";

function WaitlistButton() {
  const TOOL_ID = "quiz-simulator";
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
    if (localStorage.getItem(`wl_${TOOL_ID}`)) setJoined(true);
    fetch(`/api/waitlist?tool=${TOOL_ID}`).then(r => r.json()).then(d => setCount(d.count ?? 0)).catch(() => setCount(0));
  }, []);

  const join = async () => {
    if (joined || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: TOOL_ID, fingerprint: fp() }),
      });
      const d = await res.json();
      localStorage.setItem(`wl_${TOOL_ID}`, "1");
      setJoined(true);
      setCount(d.count ?? (count !== null ? count + 1 : 1));
      setPopped(true);
      setTimeout(() => setPopped(false), 4000);
    } catch {
      localStorage.setItem(`wl_${TOOL_ID}`, "1");
      setJoined(true);
      setCount(c => c !== null ? c + 1 : 1);
    } finally { setLoading(false); }
  };

  return (
    <div className="relative w-full max-w-md">
      {popped && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-2xl whitespace-nowrap z-20"
        >
          🎉 You&apos;re on the list! We&apos;ll notify you first.
        </motion.div>
      )}
      <button
        onClick={join}
        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-base uppercase tracking-widest transition-all duration-300 shadow-xl ${
          joined
            ? "bg-emerald-500 text-white shadow-emerald-500/30"
            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : joined ? <Check className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
        {joined ? "You're on the waitlist!" : "Notify Me When It Launches"}
        {count !== null && (
          <span className="bg-white/25 px-3 py-1 rounded-xl text-sm font-black">
            {count} {count === 1 ? "person" : "people"}
          </span>
        )}
      </button>
    </div>
  );
}

const FEATURES = [
  {
    icon: Timer,
    title: "Official Exam Simulation",
    desc: "Strict timing, negative marking, and calculator constraints mirroring the actual IIMB in-centre exams.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BrainCircuit,
    title: "AI Question Generation",
    desc: "Endless practice questions generated directly from your official module slides and transcripts.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Target,
    title: "Module-Specific Drills",
    desc: "Focus on exactly what you're weak at. Take targeted quizzes for specific modules instead of full papers.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track your accuracy, speed, and topic-wise strengths to optimize your revision time effectively.",
    color: "bg-rose-50 text-rose-600",
  },
];

export default function GlobalQuizPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-16 px-4 animate-in fade-in duration-700">
      <div className="w-full max-w-3xl flex flex-col items-center gap-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Icon */}
          <div className="relative inline-flex">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mx-auto">
              <Target className="w-12 h-12" />
            </div>
            <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse">
              Next Version
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Exam Prep
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-on-surface leading-[0.95]">
              Exam & Quiz<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Simulator.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-xl mx-auto leading-relaxed">
              We&apos;re completely rebuilding the quiz engine to give you <strong className="text-on-surface">AI-generated module drills</strong> and authentic exam-like conditions.
            </p>
          </div>
        </motion.div>

        {/* Waitlist CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full flex flex-col items-center gap-3"
        >
          <WaitlistButton />
          <p className="text-xs text-on-surface-variant/60 font-medium">
            Join the waitlist to get early access when we roll out for Term 3.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 text-center mb-6">
            What&apos;s Coming
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="bg-surface-container-lowest border border-outline-variant/15 rounded-[1.75rem] p-6 flex gap-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-on-surface mb-1">{f.title}</h3>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
