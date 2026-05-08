"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { Trophy, ChevronRight, Crown, Medal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getLeaderboardData } from "@/actions/leaderboard";

interface LeaderboardUser {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    total_tomatoes_earned: number;
    position: number;
}

export default function UniversalStats() {
  const { totalTomatoesEarned, leaderboardRank, communityTotal } = useFarmStore();
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
      getLeaderboardData().then(data => {
          setTopUsers(data.slice(0, 3));
      });
  }, []);

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-white/5">
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-1 bg-white rounded-2xl border border-primary/20 shadow-lg">
                <Image src="/icon.png" alt="Mascot" width={48} height={48} className="w-12 h-12 rounded-xl object-contain mix-blend-multiply" />
              </div>
              <h1 className="text-3xl font-black font-headline text-on-surface tracking-tighter leading-none flex items-center gap-2">
                DBE OS
              </h1>
            </div>
            
            <Link href="/leaderboard" className="flex items-center gap-2 bg-transparent hover:bg-white/10 text-on-surface px-4 py-2 rounded-xl transition-all border border-outline-variant/20 shadow-sm group">
              <span className="font-black text-[11px] uppercase tracking-widest">Full Leaderboard</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3-Column Layout matching sketch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: My Tomo & Top #1 */}
            <div className="flex flex-col gap-3">
               <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-8 border border-white/10 shadow-sm flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.02]">
                  <p className="text-5xl md:text-6xl font-black text-on-surface leading-none tracking-tighter mb-2 flex items-center gap-2">
                     {totalTomatoesEarned.toLocaleString()}
                  </p>
                  <p className="text-xs font-black text-on-surface/50 uppercase tracking-[0.3em]">My Tomo</p>
               </div>
               {topUsers[0] && (
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 px-5 border border-white/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Top #1
                     </span>
                     <span className="font-bold text-sm text-on-surface truncate max-w-[100px]">{topUsers[0].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-sm">{topUsers[0].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

            {/* Column 2: Community & #2 */}
            <div className="flex flex-col gap-3">
               <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-8 border border-white/10 shadow-sm flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.02]">
                  <p className="text-5xl md:text-6xl font-black text-on-surface leading-none tracking-tighter mb-2">
                     {communityTotal.toLocaleString()}
                  </p>
                  <p className="text-xs font-black text-on-surface/50 uppercase tracking-[0.3em]">Community</p>
               </div>
               {topUsers[1] && (
               <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 px-5 border border-white/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/50 flex items-center gap-1">
                        <Medal className="w-3 h-3 text-slate-300" /> #2
                     </span>
                     <span className="font-bold text-sm text-on-surface truncate max-w-[100px]">{topUsers[1].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-sm">{topUsers[1].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

            {/* Column 3: Your Rank & #3 */}
            <div className="flex flex-col gap-3">
               <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-8 border border-white/10 shadow-sm flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.02]">
                  <p className="text-xs font-black text-on-surface/50 uppercase tracking-[0.3em] mb-2">Your Rank</p>
                  <p className="text-5xl md:text-6xl font-black text-on-surface leading-none tracking-tighter flex items-center gap-2">
                     <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                     #{leaderboardRank || '--'}
                  </p>
               </div>
               {topUsers[2] && (
               <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 px-5 border border-white/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/50 flex items-center gap-1">
                        <Medal className="w-3 h-3 text-amber-600" /> #3
                     </span>
                     <span className="font-bold text-sm text-on-surface truncate max-w-[100px]">{topUsers[2].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-sm">{topUsers[2].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
