"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";
import { RANKS } from "@/constants/tomato";

export default function UniversalStats() {
  const { totalTomatoesEarned, tomatoesBalance, leaderboardRank, medianXP, rank } = useFarmStore();

  // Calculate progress to next rank
  const currentRankIndex = Math.max(0, RANKS.findIndex(r => r.name === rank));
  const nextRank = RANKS[currentRankIndex + 1];
  const currentRankMin = RANKS[currentRankIndex]?.min ?? 0;
  
  const userProgress = nextRank 
    ? ((totalTomatoesEarned - currentRankMin) / (nextRank.min - currentRankMin)) * 100
    : 100;

  // Median progress relative to user's current goal or just a fixed scale
  // Let's make it relative to the same next rank for comparison
  const medianProgress = nextRank
    ? ((medianXP - currentRankMin) / (nextRank.min - currentRankMin)) * 100
    : (medianXP / (totalTomatoesEarned || 1)) * 100;

  const clampedUserProgress = Math.min(Math.max(userProgress, 5), 100);
  const clampedMedianProgress = Math.min(Math.max(medianProgress, 5), 100);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Stats Card */}
      <div className="md:col-span-2 bg-gradient-to-br from-surface-container to-surface-container-low rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-outline-variant/10 group">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface mb-2 tracking-tighter leading-none">
                  DBE - <span className="text-red-500">OS.</span>
                </h1>
                <p className="text-on-surface-variant/80 font-medium text-sm">
                  The ultimate gamified academic ecosystem.
                </p>
              </div>
              <Link href="/leaderboard" className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-2xl transition-all border border-primary/20 group/link">
                <span className="font-bold text-sm tracking-tight">Leaderboard</span>
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner border border-red-500/10">
                  <TomatoSplash size="w-10 h-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-on-surface leading-none">{tomatoesBalance}</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Balance</span>
                </div>
              </div>

              <div className="h-10 w-px bg-outline-variant/20"></div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-primary leading-none">#{leaderboardRank}</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Global Rank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bars Section */}
          <div className="space-y-6 bg-surface-container-highest/30 p-6 rounded-[2rem] border border-outline-variant/5 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Your Progress
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{Math.round(userProgress)}% to {nextRank?.name || 'Max Rank'}</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${clampedUserProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  <Users className="w-4 h-4 text-blue-500" />
                  Community Median
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/70">{Math.round(medianProgress)}% Average</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${clampedMedianProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-60 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Rank/Badge Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] p-8 flex flex-col justify-between items-center text-center shadow-xl relative overflow-hidden group">
        <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-32 h-32 mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-20 h-20 text-primary drop-shadow-2xl" />
                </div>
                {/* Orbital dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
            </div>
            
            <p className="text-[10px] font-black font-headline text-secondary uppercase tracking-[0.3em] mb-2">Current Status</p>
            <h3 className="text-2xl font-black text-on-surface leading-tight mb-2 uppercase tracking-tight">{rank}</h3>
            <div className="px-4 py-1.5 bg-secondary/10 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">
                {totalTomatoesEarned} Lifetime XP
            </div>
        </div>

        <div className="w-full mt-8">
            <Link href="/leaderboard" className="block w-full py-4 bg-on-surface text-surface rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                Full Standings
            </Link>
        </div>

        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
