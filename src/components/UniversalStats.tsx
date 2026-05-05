"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";

export default function UniversalStats() {
  const { totalTomatoesEarned, leaderboardRank, communityTotal, streak } = useFarmStore();

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
    <section className="mb-12">
      <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-white/5">
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 space-y-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Bars (7/12) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Academic Growth
                  </span>
                </div>
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden border border-white/5">
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
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(communityProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 pt-4 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-3xl flex items-center justify-center p-3">
                    <img src="/logo.png" alt="Mascot" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black font-headline text-on-surface tracking-tighter mb-0.5">
                      {communityTotal.toLocaleString()}
                    </h2>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      collected by the <span className="font-bold text-on-surface">DBE OS community</span>
                    </p>
                  </div>
              </div>
            </div>

            {/* Right side: Stats cards (5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10 flex items-center gap-6 group hover:scale-[1.02] transition-all">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-orange-500 group-hover:text-white transition-all">🔥</div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Days Strong</p>
                    <p className="text-3xl font-black text-on-surface leading-none">{streak}</p>
                  </div>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10 flex items-center gap-6 group hover:scale-[1.02] transition-all">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition-all">🍅</div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Collected</p>
                    <p className="text-3xl font-black text-on-surface leading-none">{totalTomatoesEarned.toLocaleString()}</p>
                  </div>
               </div>
               <div className="bg-black/5 rounded-3xl p-6 border border-white/5 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest mb-1">Global Rank</p>
                    <p className="text-2xl font-black text-on-surface leading-none">#{leaderboardRank || '--'}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-on-surface/20 group-hover:text-primary transition-colors" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
