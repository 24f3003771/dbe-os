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
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-20 px-4 md:px-8 xl:px-12 pt-4">
      
      {/* Dynamic Island */}
      <div className="flex justify-center mb-2">
          <div className="bg-[#1C1625] rounded-full py-2 px-3 flex items-center gap-6 shadow-xl border border-white/10">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-white font-black text-xs">Economics Notes</span>
                      <span className="text-stone-400 text-[10px] font-bold">Week 4 • Market Structures</span>
                  </div>
              </div>
              <div className="flex items-center gap-3 pr-2">
                  <span className="text-cyan-400 font-bold text-sm">12:43</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center gap-0.5">
                      <div className="w-0.5 h-3 bg-indigo-400 rounded-full animate-pulse" />
                      <div className="w-0.5 h-4 bg-indigo-400 rounded-full animate-pulse delay-75" />
                      <div className="w-0.5 h-2 bg-indigo-400 rounded-full animate-pulse delay-150" />
                  </div>
              </div>
          </div>
      </div>

      <div className="flex flex-col gap-6">
          
          {/* Top Row: Hero Banner (8 col) & Control Center (4 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Hero Banner (Integrated with Leaderboard) */}
              <div className="lg:col-span-8 flex flex-col">
                  <div className="bg-gradient-to-br from-[#FFF0EB] to-[#FFE5DC] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden border border-white/50 shadow-sm flex flex-col md:flex-row gap-8 flex-1">
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
                              <div className="flex justify-between items-start mb-8">
                                  <div>
                                      <h1 className="text-3xl md:text-5xl font-black text-stone-900 mb-2">Good Evening, {firstName} 👋</h1>
                                      <p className="text-stone-600 font-medium">Stay consistent, your future self will thank you.</p>
                                  </div>
                                  <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white shadow-sm md:hidden xl:flex">
                                      <Trophy className="w-5 h-5 text-amber-500" />
                                      <div className="flex flex-col">
                                          <span className="text-xs font-black text-stone-900 leading-none">Top 1%</span>
                                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-none mt-0.5">Learner</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="flex flex-wrap gap-4 mt-auto pt-8">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-w-[100px] shadow-sm border border-white">
                                      <div className="flex items-center gap-2 text-rose-500 mb-1">
                                          <Target className="w-5 h-5" />
                                          <span className="text-3xl font-black text-stone-900">98</span>
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Tomo</span>
                                  </div>
                                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-w-[100px] shadow-sm border border-white">
                                      <div className="flex items-center gap-2 text-amber-500 mb-1">
                                          <Trophy className="w-5 h-5" />
                                          <span className="text-3xl font-black text-stone-900">#2</span>
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Your Rank</span>
                                  </div>
                                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-w-[100px] shadow-sm border border-white">
                                      <div className="flex items-center gap-2 text-orange-500 mb-1">
                                          <Flame className="w-5 h-5" />
                                          <span className="text-3xl font-black text-stone-900">12</span>
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Day Streak</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Right Side: Leaderboard integrated into Banner */}
                      <div className="relative z-10 w-full md:w-72 shrink-0 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-sm flex flex-col h-full">
                          <div className="flex items-center justify-between mb-6">
                              <h3 className="font-black text-stone-900 text-base">Leaderboard</h3>
                              <Link href="/" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
                                  All <ChevronRight className="w-3 h-3" />
                              </Link>
                          </div>

                          <div className="space-y-4 flex-1 flex flex-col justify-center">
                              {/* 1st Place */}
                              <div className="flex items-center gap-3">
                                  <div className="w-5 font-black text-stone-400 text-[10px] text-center">1</div>
                                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                      <Trophy className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="font-bold text-stone-900 text-xs flex-1 truncate">Madhwendra</span>
                                  <span className="font-black text-stone-900 text-xs">393</span>
                              </div>

                              {/* 2nd Place (User) */}
                              <div className="flex items-center gap-3 bg-white p-2 -mx-2 rounded-xl shadow-sm border border-rose-100/50">
                                  <div className="w-5 font-black text-rose-400 text-[10px] text-center">2</div>
                                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-black text-[10px]">
                                      2
                                  </div>
                                  <span className="font-bold text-stone-900 text-xs flex-1 truncate">Ishaan Jha</span>
                                  <span className="font-black text-stone-900 text-xs">98</span>
                              </div>

                              {/* 3rd Place */}
                              <div className="flex items-center gap-3">
                                  <div className="w-5 font-black text-stone-400 text-[10px] text-center">3</div>
                                  <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 font-black text-[10px]">
                                      3
                                  </div>
                                  <span className="font-bold text-stone-900 text-xs flex-1 truncate">Guest</span>
                                  <span className="font-black text-stone-900 text-xs">50</span>
                              </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-rose-200/50 text-center">
                              <p className="text-[10px] font-bold text-stone-600">Top <strong className="text-emerald-600 font-black">1%</strong> of learners</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Control Center */}
              <div className="lg:col-span-4 flex flex-col">
                  <div className="bg-[#FAF9F6] rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-8">
                          <h3 className="font-black text-stone-900 text-base">Control Center</h3>
                          <Settings className="w-5 h-5 text-stone-400" />
                      </div>

                      <div className="flex flex-col gap-4 flex-1 justify-center">
                          {/* Switches */}
                          <div onClick={() => toggleControl('darkMode')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <Moon className={`w-5 h-5 ${controls.darkMode ? 'text-indigo-600' : 'text-stone-400'}`} />
                                  <span className="text-xs font-black text-stone-700">Dark Mode</span>
                              </div>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${controls.darkMode ? 'bg-indigo-500' : 'bg-stone-200'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${controls.darkMode ? 'right-0.5' : 'left-0.5'}`} />
                              </div>
                          </div>
                          
                          <div onClick={() => toggleControl('focusMode')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <Target className={`w-5 h-5 ${controls.focusMode ? 'text-rose-500' : 'text-stone-400'}`} />
                                  <span className="text-xs font-black text-stone-700">Focus Mode</span>
                              </div>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${controls.focusMode ? 'bg-rose-500' : 'bg-stone-200'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${controls.focusMode ? 'right-0.5' : 'left-0.5'}`} />
                              </div>
                          </div>

                          <div onClick={() => toggleControl('strictMode')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <Lock className={`w-5 h-5 ${controls.strictMode ? 'text-indigo-600' : 'text-stone-400'}`} />
                                  <span className="text-xs font-black text-stone-700">Strict Mode</span>
                              </div>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${controls.strictMode ? 'bg-indigo-500' : 'bg-stone-200'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${controls.strictMode ? 'right-0.5' : 'left-0.5'}`} />
                              </div>
                          </div>

                          <div onClick={() => toggleControl('notifications')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <Bell className={`w-5 h-5 ${controls.notifications ? 'text-rose-500' : 'text-stone-400'}`} />
                                  <span className="text-xs font-black text-stone-700">Notifications</span>
                              </div>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${controls.notifications ? 'bg-rose-500' : 'bg-stone-200'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${controls.notifications ? 'right-0.5' : 'left-0.5'}`} />
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>

          {/* Bottom Row: Calendar, To-Do, Focus Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Calendar (My Month) */}
              <div className="flex flex-col">
                  <div className="bg-[#FFF4F0] rounded-[2.5rem] p-8 border border-[#FFEBE5] shadow-sm flex flex-col relative overflow-hidden flex-1 min-h-[400px]">
                      <div className="flex justify-between items-center mb-8 z-10">
                          <div className="flex items-center gap-2 text-rose-500">
                              <Calendar className="w-5 h-5" />
                              <h3 className="font-black text-stone-900 text-base">My Month</h3>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className={`text-xl text-rose-500 font-bold ${caveat.className} tracking-wide -rotate-6`}>June</span>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-y-3 text-center text-xs font-black text-stone-400 mb-6 z-10 flex-1">
                          {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                          
                          {/* Calendar Days Simulation */}
                          {[...Array(30)].map((_, i) => {
                              const d = i + 1;
                              const isToday = d === 23;
                              const hasGreen = d % 3 !== 0;
                              const hasOrange = d % 5 === 0;
                              return (
                                  <div key={i} className="relative flex flex-col items-center justify-center h-10 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
                                      <span className={`font-bold text-sm ${isToday ? 'bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm shadow-rose-300' : 'text-stone-700'}`}>
                                          {d}
                                      </span>
                                      <div className="flex gap-1 mt-1 absolute bottom-0">
                                          {hasGreen && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                          {hasOrange && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* To-Do (Today's Mission) */}
              <div className="flex flex-col">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[400px]">
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-2 text-indigo-600">
                              <Target className="w-5 h-5" />
                              <h3 className="font-black text-stone-900 text-base">Today's Mission</h3>
                          </div>
                          <MoreHorizontal className="w-5 h-5 text-stone-400 cursor-pointer" />
                      </div>

                      <div className="space-y-5 flex-1">
                          <div className="flex items-center gap-4 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors">
                              <div className="w-6 h-6 rounded-md bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-200 group-hover:bg-rose-600 transition-colors">
                                  <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                              <span className="text-sm font-bold text-stone-500 line-through">Finish Economics Notes</span>
                          </div>
                          <div className="flex items-center gap-4 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors">
                              <div className="w-6 h-6 rounded-md bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-200 group-hover:bg-rose-600 transition-colors">
                                  <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                              <span className="text-sm font-bold text-stone-500 line-through">Attempt 2 Quizzes</span>
                          </div>
                          <div className="flex items-center gap-4 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors">
                              <div className="w-6 h-6 rounded-md border-2 border-stone-200 flex items-center justify-center shrink-0 group-hover:border-rose-300 transition-colors"></div>
                              <span className="text-sm font-bold text-stone-900">Revise Statistics Formulas</span>
                          </div>
                          <div className="flex items-center gap-4 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors">
                              <div className="w-6 h-6 rounded-md border-2 border-stone-200 flex items-center justify-center shrink-0 group-hover:border-rose-300 transition-colors"></div>
                              <span className="text-sm font-bold text-stone-900">Practice PYQs (10)</span>
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-stone-100">
                          <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold text-stone-500">66% Completed</span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                              <div className="bg-rose-400 w-[66%] h-full rounded-l-full" />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Focus Mode */}
              <div className="flex flex-col">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[400px]">
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-2 text-rose-500">
                              <Target className="w-5 h-5" />
                              <h3 className="font-black text-stone-900 text-base">Focus Mode</h3>
                          </div>
                          <MoreHorizontal className="w-5 h-5 text-stone-400 cursor-pointer hover:text-stone-600 transition-colors" />
                      </div>

                      <div className="flex justify-center flex-1 items-center relative py-8">
                          <svg width="220" height="220" viewBox="0 0 200 200" className="rotate-[-90deg]">
                              <circle cx="100" cy="100" r="88" fill="none" stroke="#FFF0EB" strokeWidth="8" />
                              <circle cx="100" cy="100" r="88" fill="none" stroke="#FF5F56" strokeWidth="8" strokeDasharray="553" strokeDashoffset="360" strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-black text-stone-900 tracking-tight">01:45:22</span>
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Remaining</span>
                          </div>
                      </div>

                      <div className="space-y-6 mt-auto">
                          <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-500 py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-sm">
                              Resume Focus <Play className="w-4 h-4 fill-current" />
                          </button>
                      </div>
                  </div>
              </div>

          </div>

      </div>
    </div>
  );
}
