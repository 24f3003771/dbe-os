"use client";

import { useState } from "react";
import { 
    MoreHorizontal, ChevronRight, CheckCircle2, ChevronDown, Calculator, Leaf, 
    Megaphone, Scale, Lightbulb, BookOpen, Activity, XCircle
} from "lucide-react";
import Link from "next/link";

type SubjectWithCount = {
    id: string;
    name: string;
    code: string;
    module_count: number;
    questionCount: number;
    completedLevels?: number;
    totalLevels?: number;
    progressPercent?: number;
    accuracy?: number;
};

type UserStats = {
    totalQuestions?: number;
    overallAccuracy: number;
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
    hasProgress?: boolean;
};

// Helper for consistent UI styling
const getMockData = (id: string, name: string) => {
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

    return { icon, colorClass, bgClass };
};

export default function QuizDashboard({
    subjects,
    userStats,
    termName,
    batch,
}: {
    subjects: SubjectWithCount[];
    userStats?: UserStats;
    termName: string;
    batch: string;
}) {
    const stats = userStats ?? { totalQuestions: 0, overallAccuracy: 0, totalAttempted: 0, totalCorrect: 0, totalIncorrect: 0, hasProgress: false };
    const totalSubjectQuestions = stats.totalQuestions ?? subjects.reduce((sum, s) => sum + s.questionCount, 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20 font-body">
            
            <div className="flex flex-col gap-10">
                
                {/* Progress Banner */}
                <div className="bg-white border border-stone-200/60 p-6 md:p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-600" /> Concept Builder Progress
                        </h3>
                        <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                            {termName || "Active Term"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Accuracy</span>
                                </div>
                                <span className="text-lg font-black text-stone-900">{stats.overallAccuracy}%</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{width: `${stats.overallAccuracy}%`}}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Total Questions</span>
                                </div>
                                <span className="text-lg font-black text-stone-900">{totalSubjectQuestions.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Attempted</span>
                                </div>
                                <span className="text-lg font-black text-stone-900">{stats.totalAttempted.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width: stats.totalAttempted > 0 ? '100%' : '0%'}}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Correct</span>
                                </div>
                                <span className="text-lg font-black text-stone-900">{stats.totalCorrect.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{width: `${stats.overallAccuracy}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subjects Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between pl-2">
                        <h2 className="text-lg md:text-xl font-black text-stone-900 tracking-tight">Select Subject</h2>
                        <button className="text-xs font-bold text-stone-500 flex items-center gap-1 hover:text-stone-800 bg-white border border-stone-200/60 px-3 py-1.5 rounded-lg shadow-sm">
                            Sort by: <span className="text-stone-900 ml-1">Recently Used</span> <ChevronDown className="w-3.5 h-3.5 ml-1" />
                        </button>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {subjects.map((subject) => {
                            const styleData = getMockData(subject.id, subject.name);
                            const progressPercent = subject.progressPercent ?? 0;
                            const accuracy = subject.accuracy ?? 0;

                            return (
                                <div key={subject.id} className="bg-white border border-stone-200/60 p-6 rounded-[2rem] shadow-sm flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${styleData.bgClass} ${styleData.colorClass} group-hover:scale-110 transition-transform`}>
                                            {styleData.icon}
                                        </div>
                                        <button className="text-stone-400 hover:text-stone-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <h3 className="text-lg font-black text-stone-900 leading-tight mb-6 pr-4 min-h-[50px]">
                                        {subject.name}
                                    </h3>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-xs font-bold text-stone-500">{subject.questionCount || 0} Questions</div>
                                        <div className="text-xs font-bold text-stone-500">{accuracy}% Accuracy</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                                        <div className="flex flex-col gap-1">
                                            <div className="w-24 h-2 rounded-full overflow-hidden bg-stone-100" title={`Concept Builder: ${progressPercent}% completed (${subject.completedLevels || 0}/${subject.totalLevels || 12} levels)`}>
                                                <div className={`h-full ${styleData.colorClass.replace('text-', 'bg-')}`} style={{width: `${progressPercent}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-stone-400">
                                                {progressPercent}% Concept Builder
                                            </span>
                                        </div>
                                        <Link href={`/${subject.id}`} className={`px-4 py-2 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${styleData.bgClass} ${styleData.colorClass} hover:opacity-80`}>
                                            Continue <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
