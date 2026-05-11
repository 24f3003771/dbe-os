"use client";

import { useEffect, useState } from "react";
import { Bell, Users, TrendingUp, RefreshCw, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const TOOL_META: Record<string, { label: string; color: string; emoji: string }> = {
  "matchforge":            { label: "Find Your Team",              color: "bg-indigo-100 text-indigo-600", emoji: "🤝" },
  "resume-builder":        { label: "Build My Resume with AI",     color: "bg-violet-100 text-violet-600", emoji: "📄" },
  "internships":           { label: "Find Internships Near Me",    color: "bg-emerald-100 text-emerald-600", emoji: "🚀" },
  "competitions":          { label: "Join a Competition",          color: "bg-orange-100 text-orange-600", emoji: "🏆" },
  "pitch-decks":           { label: "See Winning Pitch Decks",     color: "bg-blue-100 text-blue-600", emoji: "📊" },
  "winners-bank":          { label: "Learn From Winners",          color: "bg-violet-100 text-violet-600", emoji: "⭐" },
  "career-guides":         { label: "Read Career Playbooks",       color: "bg-rose-100 text-rose-600", emoji: "📚" },
  "transcript-generator":  { label: "Preview My Transcript",       color: "bg-stone-100 text-stone-600", emoji: "🎓" },
};

export default function WaitlistPanel() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      setCounts(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const topTool = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  const sortedTools = Object.keys(TOOL_META).sort(
    (a, b) => (counts[b] ?? 0) - (counts[a] ?? 0)
  );

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">Tool Waitlist Manager</h2>
          <p className="text-sm font-bold text-on-surface-variant mt-1">
            Track how many users want each tool — use this to prioritize the roadmap.
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-2xl font-black text-xs uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <Bell className="w-6 h-6 text-primary mb-4" />
          <p className="text-3xl font-black text-on-surface">{loading ? "—" : total}</p>
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mt-1">Total Signups</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <TrendingUp className="w-6 h-6 text-emerald-500 mb-4" />
          <p className="text-3xl font-black text-on-surface">
            {loading ? "—" : topTool ? (counts[topTool[0]] ?? 0) : 0}
          </p>
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mt-1">Most Wanted</p>
          {topTool && !loading && (
            <p className="text-[10px] font-bold text-on-surface-variant/60 mt-1 truncate">
              {TOOL_META[topTool[0]]?.label ?? topTool[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <Users className="w-6 h-6 text-amber-500 mb-4" />
          <p className="text-3xl font-black text-on-surface">{loading ? "—" : Object.keys(counts).length}</p>
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mt-1">Tools with Demand</p>
        </motion.div>
      </div>

      {/* Waitlist table */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-black text-on-surface text-sm uppercase tracking-widest">Waitlist by Tool</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary/40 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {sortedTools.map((toolId, idx) => {
              const meta = TOOL_META[toolId];
              const count = counts[toolId] ?? 0;
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

              return (
                <motion.div
                  key={toolId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-5 flex items-center gap-4 hover:bg-surface-container-highest/50 transition-colors"
                >
                  <span className="text-2xl w-10 text-center">{meta?.emoji ?? "🔧"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-on-surface truncate">{meta?.label ?? toolId}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{toolId}</p>
                    <div className="mt-2 h-1.5 bg-outline-variant/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + idx * 0.04, duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-on-surface">{count}</p>
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">
                      {count === 1 ? "person" : "people"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-amber-700 leading-relaxed">
          This panel is only visible to <span className="font-black">SUPER_ADMIN</span> users. Normal users cannot access waitlist data.
          Use the counts above to decide which tools to prioritize building next.
        </p>
      </div>
    </div>
  );
}
