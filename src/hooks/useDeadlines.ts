"use client";

import { useState, useEffect, useCallback } from "react";
import { useFarmStore } from "@/hooks/useFarmStore";

export interface Deadline {
    id: string;
    title: string;
    subject: string;
    type: "assignment" | "quiz" | "exam";
    dueDate: string; // ISO string
    completed: boolean;
    isOfficial?: boolean;
}

export type DeadlineStatus = "overdue" | "due-today" | "upcoming" | "completed";

export function getDeadlineStatus(deadline: Deadline): DeadlineStatus {
    if (deadline.completed) return "completed";

    const now = new Date();
    const due = new Date(deadline.dueDate);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    if (due < now) return "overdue";
    if (due >= todayStart && due < todayEnd) return "due-today";
    return "upcoming";
}

import { getDeadlinesAction, addDeadlineAction, toggleDeadlineAction, deleteDeadlineAction } from "@/actions/deadlines";
import { OFFICIAL_SUBJECT_CHECKLISTS } from "@/data/officialChecklist";

export function useDeadlines() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { earnTomatoes } = useFarmStore();

    const fetchDeadlines = useCallback(async () => {
        let fetched: Deadline[] = [];
        try {
            const data = await getDeadlinesAction();
            fetched = data;
        } catch {
            // fallback silently
        }

        let completedOfficial: string[] = [];
        if (typeof window !== "undefined") {
            try {
                completedOfficial = JSON.parse(localStorage.getItem('completedOfficialTasks') || '[]');
            } catch (e) { }
        }

        const officialTasks: Deadline[] = [];
        Object.values(OFFICIAL_SUBJECT_CHECKLISTS).forEach(tasks => {
            tasks.forEach(t => {
                officialTasks.push({
                    id: t.id,
                    title: t.title,
                    subject: t.subject,
                    type: t.type as any,
                    dueDate: t.dueDate,
                    completed: completedOfficial.includes(t.id),
                    isOfficial: true
                });
            });
        });

        setDeadlines([...officialTasks, ...fetched]);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        fetchDeadlines();
    }, [fetchDeadlines]);

    const addDeadline = useCallback(async (deadline: Omit<Deadline, "id" | "completed">) => {
        try {
            const newDeadline = await addDeadlineAction({
                title: deadline.title,
                subject: deadline.subject,
                type: deadline.type,
                priority: (deadline as any).priority || "medium",
                dueDate: deadline.dueDate
            });
            setDeadlines((prev) => [...prev, newDeadline as any]);
        } catch {
            // handle silently
        }
    }, []);

    const toggleComplete = useCallback(async (id: string) => {
        setDeadlines((prev) => {
            const target = prev.find(d => d.id === id);
            if (!target) return prev;
            
            const nextCompleted = !target.completed;
            if (nextCompleted) {
                earnTomatoes({
                    actionType: "deadline_complete",
                    description: `Completed deadline: ${target.title}`,
                    tomatoes: 5
                }); // Award 5 tomatoes for completing a deadline
            }
            
            if (target.isOfficial) {
                if (typeof window !== "undefined") {
                    try {
                        const completedOfficial = JSON.parse(localStorage.getItem('completedOfficialTasks') || '[]');
                        if (nextCompleted && !completedOfficial.includes(id)) {
                            completedOfficial.push(id);
                        } else if (!nextCompleted) {
                            const idx = completedOfficial.indexOf(id);
                            if (idx > -1) completedOfficial.splice(idx, 1);
                        }
                        localStorage.setItem('completedOfficialTasks', JSON.stringify(completedOfficial));
                    } catch (e) {}
                }
            } else {
                toggleDeadlineAction(id, nextCompleted).catch(console.error);
            }

            return prev.map((d) => d.id === id ? { ...d, completed: nextCompleted } : d);
        });
    }, [earnTomatoes]);

    const deleteDeadline = useCallback(async (id: string) => {
        setDeadlines((prev) => {
            const target = prev.find(d => d.id === id);
            if (target?.isOfficial) return prev; // Don't allow deleting official deadlines
            return prev.filter((d) => d.id !== id);
        });
        deleteDeadlineAction(id).catch(console.error);
    }, []);

    const getNearestDeadline = useCallback(() => {
        const now = new Date();
        const upcoming = deadlines
            .filter((d) => !d.completed && new Date(d.dueDate) > now)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        return upcoming[0] || null;
    }, [deadlines]);

    const getGroupedBySubject = useCallback(() => {
        const groups: Record<string, Deadline[]> = {};
        deadlines.forEach((d) => {
            if (!groups[d.subject]) groups[d.subject] = [];
            groups[d.subject].push(d);
        });
        return groups;
    }, [deadlines]);

    return {
        deadlines,
        isLoaded,
        addDeadline,
        toggleComplete,
        deleteDeadline,
        getNearestDeadline,
        getGroupedBySubject,
    };
}
