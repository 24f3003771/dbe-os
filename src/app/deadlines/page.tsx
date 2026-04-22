"use client";

import { useState, useEffect } from "react";
import {
    CalendarClock,
    Plus,
    Download,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Trash2,
    BookOpen,
    FileText,
    GraduationCap,
    Info,
    ChevronDown,
    ChevronRight,
    LayoutGrid,
    ListTodo,
    Sparkles
} from "lucide-react";
import { useDeadlines, getDeadlineStatus, DeadlineStatus, Deadline } from "@/hooks/useDeadlines";
import { downloadICS } from "@/utils/calendarExport";
import { getAllSubjects } from "@/data/db";
import AddDeadlineModal from "@/components/AddDeadlineModal";

// Term-2 Official Data
const TERM_2_COURSES = [
    { id: "SE21x", name: "Persuasive Communication", credits: 1.5 },
    { id: "DS21x", name: "Business Statistics for Entrepreneurs II", credits: 1.5 },
    { id: "PJ21x", name: "Venturing on a Budget: Rs250 Venture", credits: 1.5 },
    { id: "ID22x", name: "Indian Knowledge System", credits: 3.0 },
    { id: "FA31x", name: "Management Accounting", credits: 1.5 },
    { id: "ES21x", name: "Principles of Microeconomics", credits: 1.5 },
    { id: "AE21x", name: "Foundations of Business Communication II", credits: 1.5 },
    { id: "ID21x", name: "Website Development", credits: 3.0 },
];

const OFFICIAL_SCHEDULE = [
    { date: "06-Feb-26", items: ["PC-Module 1", "WEB Module 1", "250V-Module 1"] },
    { date: "13-Feb-26", items: ["PC-Module 2", "WEB Module 2", "Stats 2-Module 1"] },
    { date: "20-Feb-26", items: ["PC-Module 3", "WEB Module 3", "Stats 2-Module 2"] },
    { date: "27-Feb-26", items: ["PC-Module 4", "WEB Module 4", "Stats 2-Module 3"] },
    { date: "06-Mar-26", items: ["IKS-Module 1", "WEB Module 5", "Stats 2-Module 4", "250 V-Module 2"] },
    { date: "13-Mar-26", items: ["IKS-Module 2", "WEB Module 6", "250 V-Module 3"] },
    { date: "20-Mar-26", items: ["IKS-Module 3", "WEB Module 7", "250 V-Module 4"] },
    { date: "27-Mar-26", items: ["IKS-Module 4", "WEB Module 8", "Economics-Module 1"] },
    { date: "03-Apr-26", items: ["IKS-Module 5", "MA-Module 1", "Economics-Module 2"] },
    { date: "10-Apr-26", items: ["IKS-Module 6", "MA-Module 2", "Economics-Module 3"] },
    { date: "17-Apr-26", items: ["IKS-Module 7", "MA-Module 3", "Economics-Module 4"] },
    { date: "24-Apr-26", items: ["IKS-Module 8", "MA-Module 4", "FoBC 2-Module 1 & 2"] },
    { date: "01-May-26", items: ["FoBC 2-Module 3 & 4"] },
    { date: "10-May-26", items: ["Course Content Ends"], isMilestone: true },
    { date: "23-May-26", items: ["Final In-Centre Exam (Starts)"], isMilestone: true },
    { date: "24-May-26", items: ["Final In-Centre Exam (Ends)"], isMilestone: true },
];

const statusConfig: Record<
    DeadlineStatus,
    { label: string; color: string; bg: string; border: string }
> = {
    overdue: { label: "Overdue", color: "text-error", bg: "bg-error/10", border: "border-error/20" },
    "due-today": { label: "Due Today", color: "text-on-surface", bg: "bg-tertiary/20", border: "border-tertiary/30" },
    upcoming: { label: "Upcoming", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    completed: { label: "Completed", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
};

const typeIcons: Record<string, React.ReactNode> = {
    assignment: <FileText className="w-4 h-4" />,
    quiz: <BookOpen className="w-4 h-4" />,
    exam: <GraduationCap className="w-4 h-4" />,
};

function CountdownTimer({ dueDate }: { dueDate: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calc = () => {
            const now = new Date();
            const due = new Date(dueDate);
            const diff = due.getTime() - now.getTime();
            if (diff <= 0) { setTimeLeft("Past due"); return; }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            if (days > 0) setTimeLeft(`${days}d ${hours}h ${mins}m`);
            else setTimeLeft(`${hours}h ${mins}m ${secs}s`);
        };
        calc();
        const interval = setInterval(calc, 1000);
        return () => clearInterval(interval);
    }, [dueDate]);
    return <span className="font-mono tabular-nums">{timeLeft}</span>;
}

export default function DeadlinesPage() {
    const { deadlines, isLoaded, addDeadline, toggleComplete, deleteDeadline, getNearestDeadline } = useDeadlines();
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<"official" | "personal">("official");
    const [filter, setFilter] = useState<"all" | DeadlineStatus>("all");
    const subjects = getAllSubjects();
    const nearest = getNearestDeadline();

    const filtered = deadlines
        .filter((d) => filter === "all" || getDeadlineStatus(d) === filter)
        .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

    const grouped: Record<string, Deadline[]> = {};
    filtered.forEach((d) => {
        const subjectName = subjects.find((s) => s.id === d.subject)?.title || d.subject;
        if (!grouped[subjectName]) grouped[subjectName] = [];
        grouped[subjectName].push(d);
    });

    if (!isLoaded) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
            {/* Minimal Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                         <Sparkles className="w-3.5 h-3.5" /> Academic Tracker
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface font-headline italic">
                        Tasks & <span className="text-primary italic">Calendar.</span>
                    </h1>
                </div>
                
                <div className="flex bg-surface-container-high p-1.5 rounded-2xl border border-outline-variant/10 shadow-inner">
                    <button 
                        onClick={() => setViewMode("official")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'official' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                        <GraduationCap className="w-4 h-4" /> Official Term-2
                    </button>
                    <button 
                        onClick={() => setViewMode("personal")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'personal' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                        <ListTodo className="w-4 h-4" /> My Checklist
                    </button>
                </div>
            </header>

            {viewMode === "official" ? (
                <div className="space-y-10">
                    {/* Course Directory */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {TERM_2_COURSES.map(course => (
                            <div key={course.id} className="bg-surface-container p-5 rounded-[1.5rem] border border-outline-variant/10 hover:border-primary/20 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{course.id}</span>
                                    <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">{course.credits} Credits</span>
                                </div>
                                <h4 className="font-bold text-sm leading-tight text-on-surface group-hover:text-primary transition-colors">{course.name}</h4>
                            </div>
                        ))}
                    </section>

                    {/* Timeline View */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                             <h3 className="text-xl font-black font-headline italic text-on-surface">Release Schedule 2026</h3>
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ongoing Term</span>
                             </div>
                        </div>

                        <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="divide-y divide-outline-variant/10">
                                {OFFICIAL_SCHEDULE.map((slot, index) => (
                                    <div key={index} className={`flex flex-col md:flex-row gap-4 md:gap-12 p-6 md:p-8 transition-colors hover:bg-surface-container ${slot.isMilestone ? 'bg-indigo-500/[0.03]' : ''}`}>
                                        <div className="md:w-32 shrink-0">
                                            <p className="text-xl font-black tabular-nums text-on-surface leading-none">{slot.date.split('-')[0]}</p>
                                            <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-[0.2em] mt-1 opacity-60">
                                                {slot.date.split('-')[1]} {slot.date.split('-')[2]}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2">
                                                {slot.items.map((item, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                            slot.isMilestone 
                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 my-2' 
                                                            : 'bg-white border-outline-variant/10 text-on-surface shadow-sm hover:border-primary/30'
                                                        }`}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-5 h-5 text-on-surface-variant/20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-amber-500/10 p-6 rounded-[2rem] border border-amber-500/20 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="font-black text-amber-900 italic tracking-tight">Final In-Centre Exams</h4>
                                <p className="text-sm text-amber-900/70 font-medium italic">Scheduled for <span className="font-bold underline">23 May & 24 May 2026</span> tentatively. Any schedule changes will be shared via email.</p>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Personal Deadlines View */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {["all", "overdue", "due-today", "upcoming", "completed"].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as any)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === key ? "bg-primary text-white shadow-lg" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
                                >
                                    {key.replace("-", " ")}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Task
                        </button>
                    </div>

                    {Object.keys(grouped).length === 0 ? (
                        <div className="text-center py-24 bg-surface-container-low rounded-[2.5rem] border-2 border-dashed border-outline-variant/10">
                            <CalendarClock className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-xl font-black italic text-on-surface-variant/40 uppercase">No Custom Tasks</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(grouped).map(([subjectName, items]) => (
                                <div key={subjectName} className="space-y-4">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] pl-2">{subjectName}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {items.map((d) => {
                                            const status = getDeadlineStatus(d);
                                            const cfg = statusConfig[status];
                                            return (
                                                <div key={d.id} className="bg-white border border-outline-variant/10 p-6 rounded-[2rem] hover:shadow-xl transition-all group flex flex-col justify-between h-40">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                             <button 
                                                                onClick={() => toggleComplete(d.id)}
                                                                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${d.completed ? 'bg-secondary border-secondary text-white' : 'border-stone-200 hover:border-primary'}`}
                                                             >
                                                                {d.completed && <CheckCircle2 className="w-5 h-5" />}
                                                             </button>
                                                             <div className="min-w-0">
                                                                <h4 className={`font-black text-lg leading-tight uppercase truncate ${d.completed ? 'line-through text-stone-400' : 'text-on-surface'}`}>{d.title}</h4>
                                                                <span className={`text-[8px] font-black uppercase tracking-widest ${cfg.color}`}>{cfg.label} • {d.type}</span>
                                                             </div>
                                                        </div>
                                                        <button onClick={() => deleteDeadline(d.id)} className="p-2 text-stone-300 hover:text-error opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant opacity-60">
                                                         <span>{new Date(d.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                                         {!d.completed && <CountdownTimer dueDate={d.dueDate} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <AddDeadlineModal open={showModal} onClose={() => setShowModal(false)} onAdd={addDeadline} />
        </div>
    );
}
