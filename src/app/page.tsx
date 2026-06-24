"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion } from "framer-motion";
import { 
    BookOpen, Target, Flame, Trophy, Calendar, Zap, 
    MoreHorizontal, Play, CheckSquare, Square, Check,
    Clock, Grid, ChevronRight, ChevronLeft, ChevronDown, 
    Moon, Lock, Settings, Bell, Palette
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });

export default function Dashboard() {
  const { fetchFarmData, isInitialized } = useFarmStore();
  const [user, setUser] = useState<any>(null);

  // Control Center State
  const [controls, setControls] = useState({
    darkMode: false,
    focusMode: true,
    strictMode: false,
    notifications: true,
    performanceMode: false,
    theme: 'Peach'
  });

  const toggleControl = (key: keyof typeof controls) => {
    if (typeof controls[key] === 'boolean') {
        setControls(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    }
  };

  useEffect(() => {
    if (!isInitialized) fetchFarmData();
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    fetchUser();
  }, [isInitialized, fetchFarmData]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Ishaan';

  return (
    <div className="flex flex-col gap-4 max-w-[1400px] mx-auto pb-6 px-4 md:px-8 xl:px-12 pt-2">
      
      {/* Top Row: Hero Banner (8 col) & Control Center (4 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Hero Banner (Integrated with Leaderboard) */}
          <div className="lg:col-span-8 flex flex-col">
              <div className="bg-gradient-to-br from-[#FFF0EB] to-[#FFE5DC] rounded-[2rem] p-6 md:p-8 relative overflow-hidden border border-white/50 shadow-sm flex flex-col md:flex-row gap-6 flex-1">
                  {/* Background Mountains Vector Illusion */}
                  <div className="absolute bottom-0 right-0 left-0 h-48 opacity-40 pointer-events-none">
                      <div className="absolute bottom-0 right-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl" />
                      <div className="absolute bottom-10 right-32 w-32 h-32 bg-orange-300 rounded-full blur-2xl" />
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full text-rose-100/50 fill-current">
                          <path d="M0,100 L0,50 L20,70 L40,40 L70,80 L90,30 L100,60 L100,100 Z" />
                      </svg>
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full text-orange-100/40 fill-current">
                          <path d="M0,100 L0,60 L30,80 L50,50 L80,90 L100,50 L100,100 Z" />
                      </svg>
                      <div className="absolute bottom-20 right-48 w-16 h-16 bg-gradient-to-tr from-orange-400 to-rose-400 rounded-full shadow-[0_0_40px_rgba(251,146,60,0.6)]" />
                  </div>

                  {/* Left Side: Greeting & Stats */}
                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                      <div>
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-1">Good Evening, {firstName} 👋</h1>
                                  <p className="text-stone-600 font-medium text-sm">Stay consistent, your future self will thank you.</p>
                              </div>
                              <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 border border-white shadow-sm md:hidden xl:flex">
                                  <Trophy className="w-4 h-4 text-amber-500" />
                                  <div className="flex flex-col">
                                      <span className="text-xs font-black text-stone-900 leading-none">Top 1%</span>
                                      <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none mt-0.5">Learner</span>
                                  </div>
                              </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-auto pt-6">
                              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center flex-1 min-w-[90px] shadow-sm border border-white">
                                  <div className="flex items-center gap-1.5 text-rose-500 mb-1">
                                      <Target className="w-4 h-4" />
                                      <span className="text-2xl font-black text-stone-900">98</span>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Tomo</span>
                              </div>
                              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center flex-1 min-w-[90px] shadow-sm border border-white">
                                  <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                      <Trophy className="w-4 h-4" />
                                      <span className="text-2xl font-black text-stone-900">#2</span>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Your Rank</span>
                              </div>
                              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center flex-1 min-w-[90px] shadow-sm border border-white">
                                  <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                                      <Flame className="w-4 h-4" />
                                      <span className="text-2xl font-black text-stone-900">12</span>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Day Streak</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Right Side: Leaderboard integrated into Banner */}
                  <div className="relative z-10 w-full md:w-64 shrink-0 bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="font-black text-stone-900 text-sm">Leaderboard</h3>
                          <Link href="/" className="text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
                              All <ChevronRight className="w-3 h-3" />
                          </Link>
                      </div>

                      <div className="space-y-3 flex-1 flex flex-col justify-center">
                          {/* 1st Place */}
                          <div className="flex items-center gap-2.5">
                              <div className="w-4 font-black text-stone-400 text-[9px] text-center">1</div>
                              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                  <Trophy className="w-3 h-3" />
                              </div>
                              <span className="font-bold text-stone-900 text-xs flex-1 truncate">Madhwendra</span>
                              <span className="font-black text-stone-900 text-xs">393</span>
                          </div>

                          {/* 2nd Place (User) */}
                          <div className="flex items-center gap-2.5 bg-white p-1.5 -mx-1.5 rounded-lg shadow-sm border border-rose-100/50">
                              <div className="w-4 font-black text-rose-400 text-[9px] text-center">2</div>
                              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-black text-[9px]">
                                  2
                              </div>
                              <span className="font-bold text-stone-900 text-xs flex-1 truncate">Ishaan Jha</span>
                              <span className="font-black text-stone-900 text-xs">98</span>
                          </div>

                          {/* 3rd Place */}
                          <div className="flex items-center gap-2.5">
                              <div className="w-4 font-black text-stone-400 text-[9px] text-center">3</div>
                              <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 font-black text-[9px]">
                                  3
                              </div>
                              <span className="font-bold text-stone-900 text-xs flex-1 truncate">Guest</span>
                              <span className="font-black text-stone-900 text-xs">50</span>
                          </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-rose-200/50 text-center">
                          <p className="text-[9px] font-bold text-stone-600">Top <strong className="text-emerald-600 font-black">1%</strong> of learners</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Control Center */}
          <div className="lg:col-span-4 flex flex-col">
              <div className="bg-[#FAF9F6] rounded-[2rem] p-6 border border-stone-100 shadow-sm flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-stone-900 text-sm">Control Center</h3>
                      <Settings className="w-4 h-4 text-stone-400" />
                  </div>

                  <div className="flex flex-col gap-3 flex-1 justify-center">
                      {/* Switches */}
                      <div onClick={() => toggleControl('darkMode')} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                              <Moon className={`w-4 h-4 ${controls.darkMode ? 'text-indigo-600' : 'text-stone-400'}`} />
                              <span className="text-[11px] font-black text-stone-700">Dark Mode</span>
                          </div>
                          <div className={`w-9 h-4.5 rounded-full relative transition-colors flex items-center px-0.5 ${controls.darkMode ? 'bg-indigo-500 justify-end' : 'bg-stone-200 justify-start'}`}>
                              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all" />
                          </div>
                      </div>
                      
                      <div onClick={() => toggleControl('focusMode')} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                              <Target className={`w-4 h-4 ${controls.focusMode ? 'text-rose-500' : 'text-stone-400'}`} />
                              <span className="text-[11px] font-black text-stone-700">Focus Mode</span>
                          </div>
                          <div className={`w-9 h-4.5 rounded-full relative transition-colors flex items-center px-0.5 ${controls.focusMode ? 'bg-rose-500 justify-end' : 'bg-stone-200 justify-start'}`}>
                              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all" />
                          </div>
                      </div>

                      <div onClick={() => toggleControl('strictMode')} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                              <Lock className={`w-4 h-4 ${controls.strictMode ? 'text-indigo-600' : 'text-stone-400'}`} />
                              <span className="text-[11px] font-black text-stone-700">Strict Mode</span>
                          </div>
                          <div className={`w-9 h-4.5 rounded-full relative transition-colors flex items-center px-0.5 ${controls.strictMode ? 'bg-indigo-500 justify-end' : 'bg-stone-200 justify-start'}`}>
                              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all" />
                          </div>
                      </div>

                      <div onClick={() => toggleControl('notifications')} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                              <Bell className={`w-4 h-4 ${controls.notifications ? 'text-rose-500' : 'text-stone-400'}`} />
                              <span className="text-[11px] font-black text-stone-700">Notifications</span>
                          </div>
                          <div className={`w-9 h-4.5 rounded-full relative transition-colors flex items-center px-0.5 ${controls.notifications ? 'bg-rose-500 justify-end' : 'bg-stone-200 justify-start'}`}>
                              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all" />
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>

      {/* Bottom Row: Calendar, To-Do, Focus Mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          
          {/* Calendar (My Month) */}
          <div className="flex flex-col">
              <div className="bg-[#FFF4F0] rounded-[2rem] p-6 border border-[#FFEBE5] shadow-sm flex flex-col relative overflow-hidden flex-1 min-h-[300px]">
                  <div className="flex justify-between items-center mb-6 z-10">
                      <div className="flex items-center gap-2 text-rose-500">
                          <Calendar className="w-4 h-4" />
                          <h3 className="font-black text-stone-900 text-sm">My Month</h3>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className={`text-lg text-rose-500 font-bold ${caveat.className} tracking-wide -rotate-6`}>June</span>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-black text-stone-400 mb-4 z-10 flex-1">
                      {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                      
                      {/* Calendar Days Simulation */}
                      {[...Array(30)].map((_, i) => {
                          const d = i + 1;
                          const isToday = d === 23;
                          const hasGreen = d % 3 !== 0;
                          const hasOrange = d % 5 === 0;
                          return (
                              <div key={i} className="relative flex flex-col items-center justify-center h-8 hover:bg-white/50 rounded-lg cursor-pointer transition-colors">
                                  <span className={`font-bold text-xs ${isToday ? 'bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm shadow-rose-300' : 'text-stone-700'}`}>
                                      {d}
                                  </span>
                                  <div className="flex gap-0.5 mt-0.5 absolute bottom-0">
                                      {hasGreen && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
                                      {hasOrange && <div className="w-1 h-1 rounded-full bg-orange-400" />}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>

          {/* To-Do (Today's Mission) */}
          <div className="flex flex-col">
              <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Target className="w-4 h-4" />
                          <h3 className="font-black text-stone-900 text-sm">Today's Mission</h3>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-stone-400 cursor-pointer" />
                  </div>

                  <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                          <div className="w-5 h-5 rounded-md bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-200 group-hover:bg-rose-600 transition-colors">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs font-bold text-stone-500 line-through">Finish Economics Notes</span>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                          <div className="w-5 h-5 rounded-md bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-200 group-hover:bg-rose-600 transition-colors">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs font-bold text-stone-500 line-through">Attempt 2 Quizzes</span>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                          <div className="w-5 h-5 rounded-md border-2 border-stone-200 flex items-center justify-center shrink-0 group-hover:border-rose-300 transition-colors"></div>
                          <span className="text-xs font-bold text-stone-900">Revise Statistics Formulas</span>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                          <div className="w-5 h-5 rounded-md border-2 border-stone-200 flex items-center justify-center shrink-0 group-hover:border-rose-300 transition-colors"></div>
                          <span className="text-xs font-bold text-stone-900">Practice PYQs (10)</span>
                      </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-stone-500">66% Completed</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-rose-400 w-[66%] h-full rounded-l-full" />
                      </div>
                  </div>
              </div>
          </div>

          {/* Focus Mode */}
          <div className="flex flex-col">
              <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[300px]">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-rose-500">
                          <Target className="w-4 h-4" />
                          <h3 className="font-black text-stone-900 text-sm">Focus Mode</h3>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-600 transition-colors" />
                  </div>

                  <div className="flex justify-center flex-1 items-center relative py-4">
                      <svg width="140" height="140" viewBox="0 0 200 200" className="rotate-[-90deg]">
                          <circle cx="100" cy="100" r="88" fill="none" stroke="#FFF0EB" strokeWidth="12" />
                          <circle cx="100" cy="100" r="88" fill="none" stroke="#FF5F56" strokeWidth="12" strokeDasharray="553" strokeDashoffset="360" strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-stone-900 tracking-tight">01:45</span>
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Remaining</span>
                      </div>
                  </div>

                  <div className="mt-auto">
                      <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-500 py-3 rounded-xl font-black text-xs transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
                          Resume Focus <Play className="w-3 h-3 fill-current" />
                      </button>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
}
