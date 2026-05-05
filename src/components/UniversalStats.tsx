"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import TomatoSplash from "./TomatoSplash";

export default function UniversalStats() {
  const { totalTomatoesEarned, leaderboardRank, communityTotal, streak } = useFarmStore();

  const target = 50; // Daily target
  const progress = Math.min((totalTomatoesEarned % target / target) * 100, 100);

  return (
    <section className="space-y-6 mb-12">
      {/* Personal Progress Card */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/5 flex flex-col md:flex-row gap-8 items-stretch">
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xl font-black font-headline text-on-surface mb-4">Today's Progress</h3>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary/40 rounded-full"
              />
            </div>
            <p className="text-on-surface-variant font-medium">
              You've collected <span className="font-black text-on-surface">{totalTomatoesEarned % target}</span> of <span className="font-black text-on-surface">{target}</span> targeted tomatoes
            </p>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mt-2 flex items-center gap-1 transition-colors">
              Update Target <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 md:w-32 bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-3xl">🔥</span>
            <p className="text-2xl font-black text-on-surface leading-none">{streak}</p>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">days strong</p>
          </div>
          <div className="flex-1 md:w-40 bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-3xl">🍅</span>
            <p className="text-2xl font-black text-on-surface leading-none">{totalTomatoesEarned.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">tomatoes collected</p>
          </div>
        </div>
      </div>

      {/* Community Card */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/5 flex flex-col md:flex-row items-center gap-8 group">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center p-4">
           <img src="/logo.png" alt="Mascot" className="w-full h-full object-contain mix-blend-multiply" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tighter mb-1">
            {communityTotal.toLocaleString()}
          </h2>
          <p className="text-on-surface-variant font-medium mb-4">
            collected by the <span className="font-bold text-on-surface">DBE OS community</span>
          </p>
          <Link href="/leaderboard" className="text-xs font-black uppercase tracking-widest text-on-surface flex items-center justify-center md:justify-start gap-1 group-hover:text-primary transition-colors">
            View Leaderboard <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
