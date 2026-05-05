"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";

export default function UniversalStats() {
  const { totalTomatoesEarned, leaderboardRank, communityTotal } = useFarmStore();

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
      <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low rounded-[2rem] p-5 md:p-6 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-white/5">
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-1 bg-white rounded-2xl border border-primary/20 shadow-lg">
                <img src="/icon.png" alt="Mascot" className="w-14 h-14 rounded-xl object-contain mix-blend-multiply" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tighter leading-none flex items-center gap-2">
                  DBE OS <span className="text-primary-variant">Academic Hub</span>
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60 mt-1">
                  Global Tomato Ranking System
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em]">Global Rank</span>
                  <span className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">#{leaderboardRank || '--'}</span>
               </div>
               <Link href="/leaderboard" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-variant flex items-center gap-1 transition-colors">
                  View Full Leaderboard <ChevronRight className="w-3 h-3" />
               </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side: Your Impact & Community Impact (Side by Side) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Your Total */}
              <div className="space-y-3 bg-white/5 p-4 rounded-[1.5rem] border border-white/5 shadow-inner">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                      <span className="text-2xl drop-shadow-md">🍅</span>
                      <div>
                        <p className="text-[9px] font-black text-on-surface/50 uppercase tracking-widest leading-none mb-1">Your Total</p>
                        <p className="text-xl font-black text-on-surface leading-none">{totalTomatoesEarned.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Academic Growth</p>
                      <p className="text-[9px] font-bold text-on-surface-variant">{Math.round(academicProgress)}% to milestone</p>
                   </div>
                </div>
                <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(academicProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  />
                </div>
              </div>

              {/* Community Total (Median) */}
              <div className="space-y-3 bg-white/5 p-4 rounded-[1.5rem] border border-white/5 shadow-inner">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg p-1 shadow-sm">
                        <img src="/face_tomato.png" alt="Mascot Face" className="w-full h-full object-contain drop-shadow-md" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-on-surface/50 uppercase tracking-widest leading-none mb-1">Community Median</p>
                        <p className="text-xl font-black text-on-surface leading-none">{communityTotal.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Global Impact</p>
                      <p className="text-[9px] font-bold text-on-surface-variant">{Math.round(communityProgress)}% of target</p>
                   </div>
                </div>
                <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(communityProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Visual Summary / Space utilization */}
            <div className="hidden lg:flex items-center justify-center border-l border-white/10 pl-6 w-[30%]">
               <div className="relative group w-full">
                  <div className="absolute inset-0 bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-all rounded-full" />
                  <div className="relative bg-white/5 backdrop-blur-2xl p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center h-full text-center space-y-3 shadow-2xl">
                     <div className="bg-white rounded-2xl p-2 shadow-sm w-20 h-20 flex items-center justify-center">
                       <img src="/face_tomato.png" alt="Mascot Face" className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-on-surface/40 uppercase tracking-[0.3em] mb-0.5">Academic Status</p>
                        <h2 className="text-lg font-black font-headline text-on-surface tracking-tight uppercase italic leading-tight">
                           {totalTomatoesEarned > 1000 ? "Tomato Legend" : totalTomatoesEarned > 500 ? "Elite Scholar" : "Scholar in Training"}
                        </h2>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
