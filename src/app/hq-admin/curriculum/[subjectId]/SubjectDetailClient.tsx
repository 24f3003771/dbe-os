"use client";

import { useState } from "react";
import { ChevronLeft, BookOpen, HelpCircle, Layers, Clock, Hash } from "lucide-react";
import Link from "next/link";
import NotesTab from "./NotesTab";
import QuestionsTab from "./QuestionsTab";
import { type Subject, type Note, type Question, type Topic } from "@/actions/curriculum";

type Tab = "notes" | "questions";

export default function SubjectDetailClient({ subject, termName, initialNotes, initialQuestions, topics }: {
    subject: Subject; termName: string; initialNotes: Note[]; initialQuestions: Question[]; topics: Topic[];
}) {
    const [activeTab, setActiveTab] = useState<Tab>("notes");

    return (
        <div className="space-y-8">
            {/* Back */}
            <Link href="/hq-admin/curriculum" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Curriculum
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs font-black text-stone-500 bg-stone-100 border border-stone-200 px-2 py-1 rounded-lg">
                            {subject.code}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{termName}</span>
                    </div>
                    <h1 className="text-2xl font-black text-stone-800 tracking-tight">{subject.name}</h1>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> {subject.module_count} Modules</span>
                    {subject.strict_time_limit && (
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {subject.strict_time_limit}min Strict</span>
                    )}
                    <span className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> {topics.length} Topics</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-2xl p-1 w-fit">
                {([
                    { key: "notes",     icon: BookOpen,     label: `Notes (${initialNotes.length}/${subject.module_count})` },
                    { key: "questions", icon: HelpCircle,   label: `Questions (${initialQuestions.length})` },
                ] as const).map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                            activeTab === key ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
                        }`}
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === "notes"
                ? <NotesTab subject={subject} initialNotes={initialNotes} topics={topics} />
                : <QuestionsTab subject={subject} initialQuestions={initialQuestions} topics={topics} />
            }
        </div>
    );
}
