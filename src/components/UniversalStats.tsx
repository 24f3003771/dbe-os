"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";

export default function UniversalStats() {
  const { totalTomatoesEarned, leaderboardRank, communityTotal, streak } = useFarmStore();

  // Mechanism for bars without upper limits:
  // We'll use dynamic milestones or just large base values for visual representation.
  // For Academic Growth: User's tomatoes relative to a milestone (e.g., 1000, then 5000, etc.)
  // For Community Growth: Total tomatoes relative to a larger milestone.
  
  const getMilestone = (val: number, base: number) => {
    let milestone = base;
    while (val >= milestone) milestone *= 2;
    return milestone;
  };

  const userMilestone = getMilestone(totalTomatoesEarned, 100);
  const communityMilestone = getMilestone(communityTotal, 1000);

  const academicProgress = (totalTomatoesEarned / userMilestone) * 100;
  const communityProgress = (communityTotal / communityMilestone) * 100;

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-white/5">
        
        {/* Animated Orbs (Subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-1 bg-white rounded-2xl border border-primary/20 shadow-lg">
                <img src="/icon.png" alt="Mascot" className="w-12 h-12 rounded-xl object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-headline text-on-surface tracking-tighter leading-none flex items-center gap-2">
                  DBE OS <span className="text-primary-variant">Academic Hub</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60 mt-1">
                  Global Tomato Ranking System
                </p>
              </div>
            </div>
            
            <Link href="/leaderboard" className="flex items-center gap-2 bg-on-surface text-surface px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg group/btn">
              <span className="font-black text-[10px] uppercase tracking-widest">Global Standings</span>
              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats & Progress Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/10 backdrop-blur-md rounded-3xl p-6 border border-white/5">
            
            {/* Quick Stats (5/12) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
              <div className="flex justify-between items-center lg:block space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Total Tomatoes</span>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-primary">{totalTomatoesEarned}</span>
                  <TomatoSplash size="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex justify-between items-center lg:block space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Current Rank</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-on-surface">#{leaderboardRank || "--"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center lg:block space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Daily Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-orange-500">{streak}</span>
                  <TrendingUp className="w-5 h-5 text-orange-500/60" />
                </div>
              </div>
            </div>

            {/* Visual Progress (7/12) */}
            <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-white/5 lg:pl-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Academic Growth
                  </span>
                </div>
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(academicProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Community Growth
                  </span>
                </div>
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(communityProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[9px] font-medium text-on-surface-variant/40 leading-relaxed italic">
                  * Growth bars reflect your contribution and the collective effort of the DBE community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
