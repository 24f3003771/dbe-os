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
      <div className="bg-[#F6E3DB] rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-sm border border-white/40">
        
        <div className="relative z-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl shadow-sm p-1.5 flex items-center justify-center border border-white/50">
                <Image src="/icon.png" alt="Mascot" width={32} height={32} className="w-8 h-8 rounded-xl object-contain" />
              </div>
              <h1 className="text-2xl font-black font-headline text-[#2D2622] tracking-tight leading-none flex items-center gap-2">
                DBEOS
              </h1>
            </div>
            
            <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EACBBF] bg-transparent hover:bg-[#F2D8CB] transition-all group">
              <span className="font-black text-[10px] text-[#5C4D45] uppercase tracking-widest">Full Leaderboard</span>
              <ChevronRight className="w-3 h-3 text-[#5C4D45] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3-Column Layout matching sketch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: My Tomo */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#F8E9E2]/50 rounded-[1.5rem] p-8 border border-[#F1D7CB] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.01]">
                  <p className="text-6xl md:text-7xl font-black text-[#2D2622] leading-none tracking-tighter mb-3">
                     {totalTomatoesEarned.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-[#8C7A70] uppercase tracking-[0.2em]">My Tomo</p>
               </div>
               {topUsers[0] && (
               <div className="bg-[#F1DED5] rounded-xl py-3 px-4 border border-[#EBD0C3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Top #1
                     </span>
                     <span className="font-bold text-xs text-[#2D2622] truncate max-w-[100px]">{topUsers[0].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-xs text-[#2D2622]">{topUsers[0].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

            {/* Column 2: Community */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#F8E9E2]/50 rounded-[1.5rem] p-8 border border-[#F1D7CB] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.01]">
                  <p className="text-6xl md:text-7xl font-black text-[#2D2622] leading-none tracking-tighter mb-3">
                     {communityTotal.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-[#8C7A70] uppercase tracking-[0.2em]">Community</p>
               </div>
               {topUsers[1] && (
               <div className="bg-[#F1DED5] rounded-xl py-3 px-4 border border-[#EBD0C3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1">
                        #2
                     </span>
                     <span className="font-bold text-xs text-[#2D2622] truncate max-w-[100px]">{topUsers[1].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-xs text-[#2D2622]">{topUsers[1].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

            {/* Column 3: Your Rank */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#F8E9E2]/50 rounded-[1.5rem] p-8 border border-[#F1D7CB] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] flex flex-col items-center justify-center text-center flex-1 transition-transform hover:scale-[1.01]">
                  <p className="text-[10px] font-black text-[#8C7A70] uppercase tracking-[0.2em] mb-3">Your Rank</p>
                  <p className="text-6xl md:text-7xl font-black text-[#2D2622] leading-none tracking-tighter flex items-center gap-2">
                     <Trophy className="w-10 h-10 md:w-12 md:h-12 text-[#ECA932]" />
                     #{leaderboardRank || '--'}
                  </p>
               </div>
               {topUsers[2] && (
               <div className="bg-[#F1DED5] rounded-xl py-3 px-4 border border-[#EBD0C3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                        #3
                     </span>
                     <span className="font-bold text-xs text-[#2D2622] truncate max-w-[100px]">{topUsers[2].display_name || 'Scholar'}</span>
                  </div>
                  <span className="font-black text-xs text-[#2D2622]">{topUsers[2].total_tomatoes_earned}</span>
               </div>
               )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
