"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";
import { RANKS } from "@/constants/tomato";

export default function UniversalStats() {
  const { totalTomatoesEarned, tomatoesBalance, rank } = useFarmStore();

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
                  The ultimate tomato-powered academic ecosystem.
                </p>
              </div>
              <Link href="/leaderboard" className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-2xl transition-all border border-primary/20 group/link">
                <span className="font-bold text-sm tracking-tight">Leaderboard</span>
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner border border-red-500/10">
                  <TomatoSplash size="w-12 h-12" />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-on-surface leading-none">{tomatoesBalance}</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Available Balance</span>
                </div>
              </div>

              <div className="h-12 w-px bg-outline-variant/20"></div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-primary leading-none">{totalTomatoesEarned}</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Total Harvested</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-highest/30 p-6 rounded-[2rem] border border-outline-variant/5 backdrop-blur-sm">
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
              Earn tomatoes by completing tasks, quizzes, and contributing to the community. Use your balance to unlock exclusive features and climb the standings!
            </p>
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
            </div>
            
            <p className="text-[10px] font-black font-headline text-secondary uppercase tracking-[0.3em] mb-2">Grower Status</p>
            <h3 className="text-2xl font-black text-on-surface leading-tight mb-2 uppercase tracking-tight">{rank}</h3>
            <div className="px-4 py-1.5 bg-secondary/10 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">
                Leveling Up...
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
