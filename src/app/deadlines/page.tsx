"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CalendarClock, Bell, CheckCircle2, CircleDashed,
    Clock, AlertTriangle, PlayCircle, BookOpen,
    ListTodo, GraduationCap, Zap, Shield, Calendar,
    ChevronRight, Check, XCircle, MoreVertical,
    Coffee, Sun, Target, CalendarDays, BrainCircuit, Sparkles
} from "lucide-react";

// Mock Data for MVP Demo
const UPCOMING_TASKS = [
    { id: 1, title: "Python Assignment", subject: "Programming", due: "Tomorrow, 11:59 PM", priority: "Critical", est: "45 min", type: "assignment" },
    { id: 2, title: "Statistics Quiz 2", subject: "Statistics", due: "3 Days Left", priority: "Urgent", est: "30 min", type: "quiz" },
    { id: 3, title: "Financial Accounting Basics", subject: "Accounting", due: "7 Days Left", priority: "Medium", est: "2 hrs", type: "reading" },
];

const SCHEDULE = [
    { id: 1, title: "Live Session: Python", time: "10:00 AM - 12:00 PM", type: "live" },
    { id: 2, title: "Doubt Session: Stats", time: "4:00 PM - 5:00 PM", type: "doubt" },
];

const MISSED = [
    { id: 1, title: "Week 2 Quiz", subject: "Statistics", due: "Passed", type: "quiz" }
];

const TIMELINE = [
    { week: "Week 1", status: "completed" },
    { week: "Week 2", status: "completed" },
    { week: "Week 3", status: "completed" },
    { week: "Week 4", status: "completed" },
    { week: "Week 5", status: "today" },
    { week: "Week 6", status: "upcoming" },
];

export default function AcademicOSDashboard() {
    const [tasks, setTasks] = useState(UPCOMING_TASKS);
    const [progress] = useState({ completed: 18, total: 23, percent: 78 });

    const markComplete = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header / Daily Digest */}
            <div className="bg-gradient-to-b from-indigo-50/50 to-transparent pt-12 pb-8 px-6 md:px-12 border-b border-indigo-50/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 shadow-sm">
                                <Sun className="w-3.5 h-3.5" /> Good Morning, Ishaan
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-tight">
                                Today&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Priority.</span>
                            </h1>
                            <p className="text-stone-500 font-medium mt-2 max-w-md">
                                You have <strong className="text-indigo-600">2 Assignments</strong>, 1 Live Class, and 1 Quiz today. Estimated time: 3 hrs 20 mins.
                            </p>
                        </div>
                        
                        {/* Progress Quick View */}
                        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-stone-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-emerald-500" strokeDasharray={`${progress.percent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-sm font-black text-stone-800">{progress.percent}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-0.5">Semester Progress</p>
                                <p className="text-sm font-bold text-stone-800">{progress.completed} / {progress.total} Tasks Done</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* Upcoming Deadlines */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500" /> Upcoming Deadlines
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            <AnimatePresence>
                                {tasks.map((task) => (
                                    <motion.div 
                                        key={task.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                        className="group bg-white border border-stone-200 hover:border-indigo-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <button 
                                                onClick={() => markComplete(task.id)}
                                                className="w-6 h-6 rounded-full border-2 border-stone-300 flex items-center justify-center text-transparent hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors shrink-0 mt-1"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                        task.priority === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        task.priority === 'Urgent' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className="text-xs font-bold text-stone-400">{task.subject}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-stone-900">{task.title}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-stone-500">
                                                    <span className="flex items-center gap-1 text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg"><Clock className="w-3.5 h-3.5" /> Due {task.due}</span>
                                                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-lg"><Zap className="w-3.5 h-3.5 text-amber-500" /> Est. {task.est}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button className="sm:w-auto w-full px-5 py-2.5 bg-stone-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2">
                                            Start Now <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {tasks.length === 0 && (
                                <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                    <p className="font-bold text-stone-500">All caught up! Great job.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Today's Schedule */}
                    <section>
                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2 mb-6">
                            <CalendarDays className="w-5 h-5 text-indigo-500" /> Today&apos;s Schedule
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SCHEDULE.map((item) => (
                                <div key={item.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'live' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {item.type === 'live' ? <PlayCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">{item.time}</p>
                                        <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-4 space-y-10">
                    
                    {/* Student Timeline */}
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Timeline
                        </h2>
                        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                            <div className="relative border-l-2 border-stone-100 ml-3 space-y-6">
                                {TIMELINE.map((t, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                                            t.status === 'completed' ? 'bg-emerald-500 ring-4 ring-emerald-50' :
                                            t.status === 'today' ? 'bg-indigo-600 ring-4 ring-indigo-50 animate-pulse' :
                                            'bg-stone-200'
                                        }`}>
                                            {t.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <p className={`text-sm font-bold ${t.status === 'upcoming' ? 'text-stone-400' : 'text-stone-900'}`}>
                                            {t.week}
                                            {t.status === 'today' && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Today</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Missed Deadlines */}
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Action Needed
                        </h2>
                        <div className="space-y-3">
                            {MISSED.map(m => (
                                <div key={m.id} className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                                        <XCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-red-900">{m.title}</h3>
                                        <p className="text-xs text-red-700 font-medium">Missed • {m.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Smart AI Assistant Teaser */}
                    <section className="bg-gradient-to-br from-stone-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BrainCircuit className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/90 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3 h-3" /> Agent AI
                            </div>
                            <h3 className="text-lg font-bold mb-2">Ask your Semester Assistant</h3>
                            <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-medium text-white/70 backdrop-blur-sm cursor-text flex items-center justify-between hover:bg-white/20 transition-colors">
                                "When is my next quiz?"
                                <div className="w-6 h-6 bg-white text-stone-900 rounded-full flex items-center justify-center">
                                    <ChevronRight className="w-3 h-3 font-bold" />
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
