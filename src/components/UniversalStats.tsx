"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";
import { RANKS } from "@/constants/tomato";

export default function UniversalStats() {
  const { totalTomatoesEarned, tomatoesBalance, leaderboardRank, medianTomatoes, rank } = useFarmStore();

  // Robust rank and progress logic
  const currentRankIndex = RANKS.findIndex(r => r.name === rank);
  const currentRank = RANKS[currentRankIndex] || RANKS[0];
  const nextRank = RANKS[currentRankIndex + 1];
  const currentRankMin = currentRank.min || 0;
  const nextRankMin = nextRank ? nextRank.min : (currentRankMin + 100); // Fallback if max rank reached
  
  const range = nextRankMin - currentRankMin || 1;
  
  const userProgress = ((totalTomatoesEarned - currentRankMin) / range) * 100;
  const medianProgress = ((medianTomatoes - currentRankMin) / range) * 100;

  const clampedUserProgress = Math.min(Math.max(userProgress, 0), 100);
  const clampedMedianProgress = Math.min(Math.max(medianProgress, 0), 100);

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
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-headline text-on-surface tracking-tighter leading-none flex items-center gap-2">
                  DBE OS <span className="text-primary-variant">Academic Hub</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60 mt-1">
                  Current Status: <span className="text-primary">{rank}</span>
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
            
            {/* Quick Stats (4/12) */}
            <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-on-surface">{tomatoesBalance}</span>
                  <TomatoSplash size="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Total Yield</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-primary">{totalTomatoesEarned}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Harvest Rank</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-on-surface">#{leaderboardRank}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-40">Daily Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-orange-500">24</span>
                  <TrendingUp className="w-4 h-4 text-orange-500/60" />
                </div>
              </div>
            </div>

            {/* Visual Progress (7/12) */}
            <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-white/5 lg:pl-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Your Academic Growth
                  </span>
                  <span className="text-[10px] font-black text-emerald-500">{Math.round(clampedUserProgress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedUserProgress}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-40"></div>
                    Community Median
                  </span>
                  <span className="text-[10px] font-black text-blue-400/60">{Math.round(clampedMedianProgress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedMedianProgress}%` }}
                    transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-30"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">
                <span>{currentRank.name}</span>
                <span>{nextRank?.name || "Summit"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
