"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { Trophy, ChevronRight, Medal } from "lucide-react";
import Link from "next/link";
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
            
            <Link href="/leaderboard" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-on-surface px-4 py-2 rounded-xl transition-all border border-white/5 shadow-sm group">
              <span className="font-black text-[10px] uppercase tracking-widest">Full Leaderboard</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side: Your Impact & Community Impact (Side by Side) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Your Total */}
              <div className="bg-white/5 p-6 md:p-8 rounded-[1.5rem] border border-white/5 shadow-inner flex flex-col justify-center items-center text-center group hover:bg-white/10 transition-colors">
                 <span className="text-5xl md:text-6xl drop-shadow-md mb-4 group-hover:scale-110 transition-transform">🍅</span>
                 <p className="text-[11px] font-black text-on-surface/50 uppercase tracking-[0.3em] mb-2">Your Total</p>
                 <p className="text-5xl md:text-6xl font-black text-on-surface leading-none tracking-tighter">{totalTomatoesEarned.toLocaleString()}</p>
              </div>

              {/* Community Total */}
              <div className="bg-white/5 p-6 md:p-8 rounded-[1.5rem] border border-white/5 shadow-inner flex flex-col justify-center items-center text-center group hover:bg-white/10 transition-colors">
                 <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 rounded-2xl p-2 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                   <img src="/face_tomato.png" alt="Mascot Face" className="w-full h-full object-contain drop-shadow-md" />
                 </div>
                 <p className="text-[11px] font-black text-on-surface/50 uppercase tracking-[0.3em] mb-2">Community Total</p>
                 <p className="text-5xl md:text-6xl font-black text-on-surface leading-none tracking-tighter">{communityTotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Right side: Rankings Summary */}
            <div className="lg:w-[30%] bg-white/5 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
               <div className="absolute inset-0 bg-primary/5 blur-[40px] pointer-events-none" />
               
               {/* User Rank Header */}
               <div className="bg-white/10 p-5 border-b border-white/10 text-center relative z-10 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-black text-on-surface/50 uppercase tracking-[0.2em] mb-1">Your Rank</p>
                  <div className="flex items-center gap-2">
                     <Trophy className="w-6 h-6 text-yellow-500" />
                     <span className="text-3xl font-black text-on-surface tracking-tighter">#{leaderboardRank || '--'}</span>
                  </div>
               </div>

               {/* Top 3 List */}
               <div className="p-5 flex-1 flex flex-col justify-center space-y-4 relative z-10">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] text-center mb-1">Top Scholars</p>
                  <div className="space-y-3">
                     {topUsers.map((user, idx) => (
                        <div key={user.id} className="flex items-center justify-between bg-black/10 rounded-xl p-3 border border-white/5">
                           <div className="flex items-center gap-3">
                              <span className="font-black text-on-surface/40 w-4 text-center text-sm">{idx + 1}</span>
                              <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/10">
                                 {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.display_name || ''} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-primary">
                                       {(user.display_name || 'S').charAt(0)}
                                    </div>
                                 )}
                              </div>
                              <span className="font-bold text-sm text-on-surface truncate max-w-[100px]" title={user.display_name || 'Unknown'}>
                                 {user.display_name || 'Unknown'}
                              </span>
                           </div>
                           <span className="font-black text-sm text-on-surface flex items-center gap-1">
                              {user.total_tomatoes_earned}
                           </span>
                        </div>
                     ))}
                     {topUsers.length === 0 && (
                         <div className="text-center text-on-surface/50 text-xs py-4 font-medium">
                             Loading ranks...
                         </div>
                     )}
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
