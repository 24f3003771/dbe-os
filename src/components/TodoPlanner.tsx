"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock } from "lucide-react";
import { useTodos, formatDateKey } from "@/hooks/useTodos";
import { getAllSubjects } from "@/data/db";

function getDateLabel(d: Date): string {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const dKey = formatDateKey(d);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dKey === todayKey) return "Today";
    if (dKey === formatDateKey(yesterday)) return "Yesterday";
    if (dKey === formatDateKey(tomorrow)) return "Tomorrow";
    return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

export default function TodoPlanner() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { tasks, addTask, toggleTask, deleteTask, completedCount, total } = useTodos(currentDate);
    const [showAdd, setShowAdd] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("09:00");
    const [newSubject, setNewSubject] = useState("general");
    const subjects = getAllSubjects();

    const prevDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 1);
        setCurrentDate(d);
    };
    const nextDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 1);
        setCurrentDate(d);
    };

    const handleAdd = () => {
        if (!newTitle.trim()) return;
        addTask({ title: newTitle.trim(), subject: newSubject, time: newTime });
        setNewTitle("");
        setShowAdd(false);
    };

    return (
        <div className="glass-panel rounded-2xl border border-white/5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                    <p className="text-white font-bold text-sm">{getDateLabel(currentDate)}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{formatDateKey(currentDate)}</p>
                </div>
                <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            {total > 0 && (
                <div className="px-4 pt-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Progress</span>
                        <span className="text-[10px] text-gray-400 font-mono">{completedCount}/{total}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Task list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-0">
                {tasks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 text-xs">No tasks for this day</p>
                        <p className="text-gray-700 text-[10px] mt-1">Click + to plan your study</p>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const subjectLabel = subjects.find((s) => s.id === task.subject)?.title || task.subject;
                        return (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${task.completed ? "opacity-40" : "hover:bg-white/[0.03]"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    disabled={task.completed}
                                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed
                                            ? "bg-indigo-500/50 border-indigo-500/50 cursor-not-allowed"
                                            : "border-white/20 hover:border-indigo-400"
                                        }`}
                                >
                                    {task.completed && (
                                        <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />{task.time}
                                        </span>
                                        {task.subject !== "general" && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium truncate max-w-[100px]">
                                                {subjectLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Task */}
            <div className="border-t border-white/5 p-3">
                {showAdd ? (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="What do you want to study?"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-indigo-500/50"
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50 w-24"
                            />
                            <select
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50 appearance-none truncate"
                            >
                                <option value="general" className="bg-[#111]">General</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id} className="bg-[#111]">{s.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowAdd(false)} className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAdd} className="flex-1 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors">
                                Add
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-gray-500 hover:text-indigo-400 hover:bg-white/[0.03] rounded-lg transition-all text-xs font-medium"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add task
                    </button>
                )}
            </div>
        </div>
    );
}
