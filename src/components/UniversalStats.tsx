"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";
import { RANKS } from "@/constants/tomato";

export default function UniversalStats() {
  const { totalTomatoesEarned, tomatoesBalance, leaderboardRank, medianTomatoes, rank } = useFarmStore();

  // Calculate progress to next rank
  const currentRankIndex = RANKS.findIndex(r => r.name === rank);
  const currentRank = RANKS[currentRankIndex] || RANKS[0];
  const nextRank = RANKS[currentRankIndex + 1];
  const currentRankMin = currentRank.min;
  
  // Robust progress calculation
  const range = nextRank ? (nextRank.min - currentRankMin) : 1;
  const userProgress = nextRank 
    ? ((totalTomatoesEarned - currentRankMin) / range) * 100
    : 100;

  const medianProgress = nextRank
    ? ((medianTomatoes - currentRankMin) / range) * 100
    : (medianTomatoes / (totalTomatoesEarned || 1)) * 100;

  const clampedUserProgress = Math.min(Math.max(userProgress, 0), 100);
  const clampedMedianProgress = Math.min(Math.max(medianProgress, 0), 100);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Primary Status Header - 8/12 Columns */}
      <div className="lg:col-span-8 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low rounded-[3rem] p-8 md:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/5 group">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Top Row: Title & Action */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Academic Hub</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-headline text-on-surface tracking-tighter leading-none">
                DBE - <span className="text-red-500">OS.</span>
              </h1>
            </div>
            <Link href="/leaderboard" className="flex items-center gap-2 bg-on-surface text-surface px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl group/btn">
              <span className="font-black text-xs uppercase tracking-widest">Global Standings</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Balance</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-on-surface">{tomatoesBalance}</span>
                <TomatoSplash size="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Total Yield</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">{totalTomatoesEarned}</span>
                <Trophy className="w-5 h-5 text-primary/60" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Global Rank</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-on-surface">#{leaderboardRank}</span>
                <span className="text-xs font-bold text-on-surface-variant/40 italic">Top 5%</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Daily Streak</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-orange-500">24</span>
                <TrendingUp className="w-5 h-5 text-orange-500/60" />
              </div>
            </div>
          </div>

          {/* Comparison Progress - The "Wow" Element */}
          <div className="mt-auto space-y-6">
            <div className="bg-surface-container-highest/20 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                <div className="space-y-5">
                    {/* User Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-xs font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Your Current Growth
                            </span>
                            <span className="text-xs font-black text-emerald-500">{Math.round(clampedUserProgress)}%</span>
                        </div>
                        <div className="h-4 w-full bg-black/20 rounded-full p-1 border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${clampedUserProgress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                            />
                        </div>
                    </div>

                    {/* Community Median */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-xs font-black text-on-surface-variant uppercase tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                                Community Median
                            </span>
                            <span className="text-xs font-black text-blue-400">{Math.round(clampedMedianProgress)}%</span>
                        </div>
                        <div className="h-4 w-full bg-black/20 rounded-full p-1 border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${clampedMedianProgress}%` }}
                                transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-40 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{currentRank.name}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{nextRank?.name || "Ultimate Sage"}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Status Badge - 4/12 Columns */}
      <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/10 rounded-[3rem] p-10 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl group transition-transform hover:translate-y-[-4px]">
        
        {/* Animated Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <div className="w-40 h-40 bg-surface-container rounded-full flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <Award className="w-24 h-24 text-primary drop-shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)]" />
                </div>
                {/* Floaties */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400/20 rounded-2xl backdrop-blur-md border border-amber-400/30 flex items-center justify-center animate-bounce">
                    <Trophy className="w-6 h-6 text-amber-500" />
                </div>
            </div>

            <span className="text-xs font-black text-secondary uppercase tracking-[0.4em] mb-3 opacity-60">Current Status</span>
            <h2 className="text-4xl font-black text-on-surface tracking-tighter mb-4 uppercase">{rank}</h2>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-6"></div>
            
            <p className="text-sm font-medium text-on-surface-variant/80 px-4 leading-relaxed italic">
              "You are harvesting faster than {Math.max(0, 100 - (leaderboardRank * 2))}% of the community scholars."
            </p>
        </div>

        <div className="w-full mt-10">
            <button className="w-full py-5 bg-gradient-to-r from-surface-container-highest to-surface-container rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] text-on-surface shadow-lg border border-white/5 hover:from-primary hover:to-primary-container hover:text-on-primary transition-all duration-300">
                View My Credentials
            </button>
        </div>

        {/* Gloss Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
