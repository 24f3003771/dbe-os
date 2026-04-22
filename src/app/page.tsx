"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Droplet, Sprout, Sun, Leaf, Flame, Trash2, BookOpen, ShoppingBag, Target, Calendar, Users, Zap, Rocket, ArrowRight, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Caveat } from "next/font/google";
import { useTodos } from "@/hooks/useTodos";
import { getAllSubjects } from "@/data/db";
import { useUser } from "@clerk/nextjs";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });

const IPadSidebar = () => {
  const { user } = useUser();
  const { tasks, addTask: persistTask, toggleTask: togglePersistedTask, deleteTask: deletePersistedTask } = useTodos(new Date());
  const { earnTomatoes } = useFarmStore();
  const [newTaskText, setNewTaskText] = useState("");
  const [showTomatoAnim, setShowTomatoAnim] = useState(false);
  const [lastEarned, setLastEarned] = useState(2);

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // Award tomatoes when completing a task
      const amount = Math.random() > 0.5 ? 5 : 2;
      earnTomatoes(amount);
      setLastEarned(amount);
      setShowTomatoAnim(true);
      setTimeout(() => setShowTomatoAnim(false), 2000);
    }
    togglePersistedTask(id);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    persistTask({ title: newTaskText, subject: "General", time: new Date().toTimeString().substring(0, 5) });
    setNewTaskText("");
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePersistedTask(id);
  };

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="sticky top-24 bg-[#FFFCF8] rounded-[2rem] border-[8px] border-[#E5E5EA] shadow-xl p-6 md:p-8 flex flex-col h-[75vh] min-h-[600px] overflow-y-auto" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(0,0,0,0.06) 39px, rgba(0,0,0,0.06) 40px)', backgroundAttachment: 'local', backgroundPosition: '0 1rem' }}>
        <AnimatePresence>
          {showTomatoAnim && (
            <motion.div 
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-6xl pointer-events-none drop-shadow-2xl"
            >
              🍅 +{lastEarned}
            </motion.div>
          )}
        </AnimatePresence>

        {/* iPad Camera details */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black/80 ring-2 ring-black/10"></div>
        <div className="absolute top-3.5 left-[calc(50%+1rem)] w-1 h-1 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]"></div>
        
        <div className={`mt-8 ${caveat.className}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl text-[#2c3e50] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">{user?.firstName ? `${user.firstName}'s` : 'My'} Month</h2>
                <span className="text-xl text-[#e74c3c] font-bold rotate-[-5deg] border-b-2 border-[#e74c3c] border-dashed">{today.toLocaleString('default', { month: 'long' })}</span>
            </div>
            
            {/* Calendar */}
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center mb-8 text-[#34495e]">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-2xl font-bold opacity-70">{d}</div>)}
                {calendarDays.map((d, i) => (
                    <div key={i} className="relative aspect-square flex items-center justify-center text-2xl font-bold">
                        {d}
                        {d && d < today.getDate() && (
                            <svg className="absolute inset-0 w-full h-full text-[#e74c3c]/80 pointer-events-none drop-shadow-sm" viewBox="0 0 100 100">
                                <path d="M20,20 Q50,40 80,80 M80,20 Q50,60 20,80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
                            </svg>
                        )}
                        {d === today.getDate() && (
                            <div className="absolute inset-1 border-4 border-[#3498db] rounded-full opacity-60 mix-blend-multiply"></div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="text-4xl text-[#2c3e50] font-bold mb-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">To-Do Today</h2>
            <ul className="space-y-[0.6rem]">
                {tasks.map((task) => (
                    <li 
                        key={task.id} 
                        className="flex items-center justify-between group"
                    >
                        <div className="flex items-start gap-4 cursor-pointer flex-1" onClick={() => toggleTask(task.id)}>
                            <span className={`text-4xl leading-none -mt-1 transition-colors ${task.completed ? 'text-[#2ecc71]' : 'text-[#3498db] group-hover:text-[#2980b9]'}`}>
                                <span className="material-symbols-outlined">
                                    {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                            </span>
                            <span className={`text-3xl leading-none mt-1 transition-all duration-300 ${
                                task.completed
                                    ? 'text-[#2c3e50] opacity-60 line-through decoration-wavy decoration-[#2ecc71]' 
                                    : 'text-[#2c3e50] opacity-100'
                            }`}>
                                {task.title}
                            </span>
                        </div>
                        <button onClick={(e) => deleteTask(task.id, e)} className="text-xl text-[#e74c3c] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#e74c3c]/10 rounded-full" title="Delete Task">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
            
            <form onSubmit={addTask} className="mt-4 flex gap-2 items-center">
                <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..." 
                    className="flex-1 bg-transparent border-b-2 border-dashed border-[#95a5a6]/50 focus:border-[#3498db] outline-none text-3xl text-[#2c3e50] py-2 placeholder:text-[#95a5a6]/50 transition-colors"
                />
                <button type="submit" className="text-4xl text-[#3498db] hover:text-[#2980b9] font-bold p-2 transition-colors">+</button>
            </form>

            <div className="mt-8 text-center text-[#95a5a6] text-xl opacity-80 italic">-- points for every task! --</div>
        </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useUser();
  const { totalTomatoesEarned, tomatoesBalance, streak, fetchFarmData, isInitialized } = useFarmStore();
  const subjects = getAllSubjects();
  const notesPreview = subjects.slice(0, 3);

  useEffect(() => {
    if (!isInitialized) fetchFarmData();
  }, [isInitialized, fetchFarmData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      
      {/* Left Main Content */}
      <div className="lg:col-span-8 space-y-8">
        {/* Header Status Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container rounded-3xl p-8 flex flex-col justify-between items-start relative overflow-hidden shadow-sm border border-outline-variant/10 hover-lift">
                <div className="relative z-10 w-full">
                    <h1 className="text-3xl md:text-5xl font-black font-headline text-on-surface mb-2 tracking-tight">
                        {user?.firstName ? `${user.firstName}'s` : 'Your'} OS.
                    </h1>
                    <p className="text-on-surface-variant max-w-sm font-medium">Welcome back, {user?.firstName || 'Scholar'}. Keep track of your academic journey.</p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 z-10 w-full">
                    <div className="flex items-center gap-3 bg-surface-container-highest px-5 py-3 rounded-2xl font-bold text-lg shadow-sm border border-outline-variant/10">
                        <span className="text-2xl">🍅</span>
                        <div className="flex flex-col">
                            <span className="text-on-surface leading-none">{tomatoesBalance}</span>
                            <span className="text-xs text-on-surface-variant font-medium">Balance</span>
                        </div>
                    </div>
                    <Link href="/leaderboard" className="flex items-center gap-3 bg-primary/10 px-5 py-3 rounded-2xl font-bold text-lg border border-primary/20 hover:bg-primary/20 transition-colors">
                        <Flame className="w-6 h-6 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-primary leading-none">#{totalTomatoesEarned}</span>
                            <span className="text-xs text-primary/70 font-medium">Rank XP</span>
                        </div>
                    </Link>
                    <div className="flex-1"></div>
                </div>
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm hover-lift relative overflow-hidden">
                <p className="text-xs font-bold font-headline text-secondary uppercase tracking-widest mb-2 flex items-center gap-1 z-10"><Zap className="w-4 h-4"/> Activity</p>
                <p className="text-5xl font-black text-secondary mb-2 leading-none z-10">{streak}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-2 z-10">Day Streak</p>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes Section preview */}
                <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm space-y-6 hover-lift">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-black font-headline text-on-surface tracking-tight flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" /> Universal Library
                        </h3>
                        <Link href="/notes" className="text-xs font-bold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {notesPreview.map((note: any) => (
                            <Link key={note.id} href={`/dbe_notes/${note.id}`} className="flex items-center gap-4 bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-sm shrink-0">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold font-headline text-on-surface group-hover:text-primary transition-colors truncate uppercase tracking-tight">{note.title}</p>
                                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-0.5">{note.id}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link href="/notes" className="block pt-2">
                        <button className="w-full py-3 bg-indigo-600/5 hover:bg-indigo-600/10 rounded-xl text-xs font-black uppercase tracking-widest text-indigo-600 transition-all border border-indigo-600/10">Browse Universal Library</button>
                    </Link>
                </div>

                {/* Opportunity Hub Section preview */}
                <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm space-y-6 hover-lift flex flex-col justify-between group overflow-hidden relative">
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-black font-headline text-on-surface tracking-tight flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-indigo-600" /> Opportunity Hub
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Featured Today</p>
                                <h4 className="text-sm font-bold text-[#1A1A1A]">HUL L.I.M.E. 16</h4>
                                <p className="text-[10px] font-bold text-stone-400 mt-0.5">Marketing Case • 12 Days Left</p>
                            </div>
                            <p className="text-xs font-medium text-on-surface-variant leading-relaxed">Access 150+ curated B-school competitions and MNC internships with winning roadmaps.</p>
                        </div>
                    </div>
                    <Link href="/opportunities" className="relative z-10">
                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                            Enter Hub <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                    {/* Decorative circle */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>

            {/* Pitch Decks Advertisement Section */}
            <Link href="/opportunities/pitch-decks" className="md:col-span-2 group">
                <div className="bg-[#1A1A1A] text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/5">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 font-black text-[10px] tracking-widest uppercase mb-2">
                                <Trophy className="w-3.5 h-3.5" /> High-Impact Resource
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter leading-none">
                                Pro Pitch <span className="text-emerald-500">Decks.</span>
                            </h2>
                            <p className="text-stone-400 text-lg font-medium max-w-lg">
                                Master the architecture of winning with 50+ award-winning case decks from L'Oréal, Maersk, and more.
                            </p>
                            <div className="pt-4 flex items-center gap-4">
                                <span className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                    Browse Library <ArrowRight className="w-4 h-4 text-emerald-500" />
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center w-40 h-40 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                            <div className="relative">
                                <Rocket className="w-16 h-16 text-emerald-500 animate-pulse" />
                                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative flow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </Link>

            {/* Leaderboard Section card */}
            <Link href="/leaderboard" className="md:col-span-2 group">
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <Flame className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight leading-none mb-2">Community Leaderboard</h3>
                            <p className="text-on-surface-variant font-medium">See where you stand among your peers. Earn tomatoes, climb ranks.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-surface-container-low px-6 py-4 rounded-2xl border border-outline-variant/10">
                        <div className="text-center border-r border-outline-variant/20 pr-6">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Your Rank</p>
                            <p className="text-2xl font-black text-primary leading-none">#{totalTomatoesEarned}</p>
                        </div>
                        <div className="pl-2">
                             <ArrowRight className="w-6 h-6 text-on-surface-variant" />
                        </div>
                    </div>
                </div>
            </Link>
        </section>

        {/* Minimal MatchForge Footer Card */}
        <Link href="/matchforge" className="group block mt-8">
            <div className="bg-surface-container-high border border-outline-variant/10 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black font-headline text-on-surface">MatchForge Network</h4>
                        <p className="text-sm text-on-surface-variant font-medium">Find learning partners & cofounders in your academic community.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                    Launch Engine <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
      </div>

      {/* Right iPad Sidebar */}
      <div className="lg:col-span-4">
         <IPadSidebar />
      </div>
    </div>
  );
}
