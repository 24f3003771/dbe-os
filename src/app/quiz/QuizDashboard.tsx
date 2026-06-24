"use client";

import { useState } from "react";
import { 
    Target, Play, Bookmark, XCircle, Clock, BarChart3, 
    MoreHorizontal, ChevronRight, CheckCircle2, History,
    Trophy, Download, ChevronDown, Calculator, Leaf, 
    Megaphone, Scale, Lightbulb, BookOpen, Activity
} from "lucide-react";
import Link from "next/link";

type SubjectWithCount = {
    id: string;
    name: string;
    code: string;
    module_count: number;
    questionCount: number;
};

// Helper for consistent mock data
const getMockData = (id: string, name: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const accuracy = (hash % 40) + 50; // 50% to 90%
    
    let icon = <BookOpen className="w-6 h-6" />;
    let colorClass = "text-indigo-500";
    let bgClass = "bg-indigo-50";

    const lowerName = name.toLowerCase();
    if (lowerName.includes('statistic') || lowerName.includes('account') || lowerName.includes('math')) {
        icon = <Calculator className="w-6 h-6" />;
        colorClass = "text-blue-500";
        bgClass = "bg-blue-50";
    } else if (lowerName.includes('micro') || lowerName.includes('eco') || lowerName.includes('env')) {
        icon = <Leaf className="w-6 h-6" />;
        colorClass = "text-green-600";
        bgClass = "bg-green-50";
    } else if (lowerName.includes('communication') || lowerName.includes('market')) {
        icon = <Megaphone className="w-6 h-6" />;
        colorClass = "text-orange-500";
        bgClass = "bg-orange-50";
    } else if (lowerName.includes('law') || lowerName.includes('ethic')) {
        icon = <Scale className="w-6 h-6" />;
        colorClass = "text-teal-600";
        bgClass = "bg-teal-50";
    } else if (lowerName.includes('knowledge') || lowerName.includes('sys') || lowerName.includes('logic')) {
        icon = <Lightbulb className="w-6 h-6" />;
        colorClass = "text-rose-500";
        bgClass = "bg-rose-50";
    }

    return { accuracy, icon, colorClass, bgClass };
};

export default function QuizDashboard({
    subjects,
    termName,
    batch,
}: {
    subjects: SubjectWithCount[];
    termName: string;
    batch: string;
}) {

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20 font-body">
            
            <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Left Column */}
                <div className="flex-1 space-y-6">
                    
                    {/* Hero Banner */}
                    <div className="bg-[#FFF0EB] rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-2">Quiz Arena</h1>
                            <p className="text-stone-600 font-bold text-sm">Practice. Analyze. Improve. Repeat.</p>
                        </div>

                        {/* Banner Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 md:gap-12 mt-8 relative z-10 bg-white/60 backdrop-blur-md w-fit px-6 py-4 rounded-2xl border border-white/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#FF5F56] shadow-sm">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-stone-900 leading-none">1,245</div>
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Questions Solved</div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-stone-200 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-stone-900 leading-none">84%</div>
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Accuracy</div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-stone-200 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                                    <span className="text-xl">🔥</span>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-stone-900 leading-none">12</div>
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Day Streak</div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-stone-200 hidden lg:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-stone-900 leading-none">#2</div>
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Current Rank</div>
                                </div>
                            </div>
                        </div>

                        {/* Background Graphic (Target) */}
                        <div className="absolute right-0 top-0 w-64 h-64 opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4 text-[#FF5F56]">
                            <Target className="w-full h-full stroke-[1]" />
                        </div>
                    </div>

                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest pl-2 pt-2">Quick Access</h2>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="bg-white border border-stone-200/60 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Bookmark className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-bold text-stone-500 leading-tight">Bookmarked<br/>Questions</div>
                            </div>
                            <span className="text-orange-500 font-black text-sm">42</span>
                        </button>
                        <button className="bg-white border border-stone-200/60 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                <XCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-bold text-stone-500 leading-tight">Wrong<br/>Questions</div>
                            </div>
                            <span className="text-red-500 font-black text-sm">128</span>
                        </button>
                        <button className="bg-white border border-stone-200/60 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-bold text-stone-500 leading-tight">Recent<br/>Attempts</div>
                            </div>
                            <span className="text-purple-500 font-black text-sm">16</span>
                        </button>
                        <button className="bg-white border border-stone-200/60 p-4 rounded-2xl flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <div className="text-[11px] font-bold text-stone-500 leading-tight">Performance<br/>Analytics</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                        </button>
                    </div>

                    {/* Continue Last Quiz Bar */}
                    <div className="bg-white border border-stone-200/60 p-5 rounded-[1.5rem] flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
                        <div className="flex items-center gap-4 md:w-1/4">
                            <div className="w-12 h-12 rounded-full bg-[#FFF0EB] text-[#FF5F56] flex items-center justify-center shrink-0">
                                <Play className="w-5 h-5 ml-0.5 fill-current" />
                            </div>
                            <span className="font-black text-stone-900 text-sm">Continue Your Last Quiz</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-sm font-black text-stone-900">Business Statistics for Entrepreneurs II</div>
                                    <div className="text-xs font-bold text-stone-500">Question 47 of 93</div>
                                </div>
                                <span className="text-xs font-black text-stone-900">78%</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF5F56] rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <button className="bg-[#FFF0EB] hover:bg-[#FFEBE5] text-[#FF5F56] px-6 py-3 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 shrink-0">
                            Resume Quiz <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 pl-2">
                        <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">All Subjects</h2>
                        <button className="text-xs font-bold text-stone-500 flex items-center gap-1 hover:text-stone-800">
                            Sort by: <span className="text-stone-900">Recently Used</span> <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {subjects.map((subject) => {
                            const mockData = getMockData(subject.id, subject.name);
                            return (
                                <div key={subject.id} className="bg-white border border-stone-200/60 p-6 rounded-[2rem] shadow-sm flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${mockData.bgClass} ${mockData.colorClass}`}>
                                            {mockData.icon}
                                        </div>
                                        <button className="text-stone-400 hover:text-stone-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <h3 className="text-lg font-black text-stone-900 leading-tight mb-6 pr-4 min-h-[50px]">
                                        {subject.name}
                                    </h3>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-xs font-bold text-stone-500">{subject.questionCount || 100} Questions</div>
                                        <div className="text-xs font-bold text-stone-500">{mockData.accuracy}% Accuracy</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                        {/* Colored line matching the design */}
                                        <div className="w-20 h-1.5 rounded-full overflow-hidden bg-stone-100">
                                            <div className={`h-full ${mockData.colorClass.replace('text-', 'bg-')}`} style={{width: `${mockData.accuracy}%`}}></div>
                                        </div>
                                        <Link href={`/${subject.id}`} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${mockData.bgClass} ${mockData.colorClass} hover:opacity-80`}>
                                            Continue <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full xl:w-80 space-y-6 shrink-0">
                    
                    {/* Progress Card */}
                    <div className="bg-white border border-stone-200/60 p-6 rounded-[2rem] shadow-sm">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest flex items-center gap-2 mb-8">
                            <Activity className="w-4 h-4" /> Your Progress
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-600 flex-1">Overall Accuracy</span>
                                    <span className="text-sm font-black text-stone-900">84%</span>
                                </div>
                                <div className="w-full h-1.5 bg-stone-100 rounded-full ml-9 overflow-hidden w-[calc(100%-2.25rem)]">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '84%'}}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-600 flex-1">Questions Attempted</span>
                                    <span className="text-sm font-black text-stone-900">1,245</span>
                                </div>
                                <div className="w-full h-1.5 bg-stone-100 rounded-full ml-9 overflow-hidden w-[calc(100%-2.25rem)]">
                                    <div className="h-full bg-blue-500 rounded-full" style={{width: '100%'}}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-600 flex-1">Correct Answers</span>
                                    <span className="text-sm font-black text-stone-900">1,045</span>
                                </div>
                                <div className="w-full h-1.5 bg-stone-100 rounded-full ml-9 overflow-hidden w-[calc(100%-2.25rem)]">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '84%'}}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                        <XCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-600 flex-1">Incorrect Answers</span>
                                    <span className="text-sm font-black text-stone-900">200</span>
                                </div>
                                <div className="w-full h-1.5 bg-stone-100 rounded-full ml-9 overflow-hidden w-[calc(100%-2.25rem)]">
                                    <div className="h-full bg-red-500 rounded-full" style={{width: '16%'}}></div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 bg-[#FFF0EB] hover:bg-[#FFEBE5] text-[#FF5F56] py-3 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2">
                            View Detailed Analytics <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Shortcuts Card */}
                    <div className="bg-white border border-stone-200/60 p-6 rounded-[2rem] shadow-sm">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6">
                            More Shortcuts
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-stone-700">Mock Test History</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] text-[#FF5F56] flex items-center justify-center">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-stone-700">Topic Wise Practice</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-stone-700">Leaderboard</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-stone-700">Download Solutions</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
