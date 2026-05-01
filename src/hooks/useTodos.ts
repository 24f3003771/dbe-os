"use client";

import { useState, useEffect, useCallback } from "react";
import { getTodosAction, addTodoAction, toggleTodoAction, deleteTodoAction } from "@/actions/todos";

export interface TodoTask {
    id: string;
    title: string;
    subject: string;
    time: string; // "09:00", "14:30" etc
    completed: boolean;
    date: string; // "2026-03-03" ISO date string
}

export function formatDateKey(d: Date): string {
    return d.toISOString().split("T")[0];
}

export function useTodos(date: Date) {
    const dateKey = formatDateKey(date);
    const [tasks, setTasks] = useState<TodoTask[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        getTodosAction(dateKey)
            .then(data => {
                setTasks(data);
                setIsLoaded(true);
            })
            .catch(e => {
                console.error("Failed to load todos", e);
                setIsLoaded(true);
            });
    }, [dateKey]);

    const addTask = useCallback(
        (task: { title: string; subject: string; time: string }) => {
            // Optimistic update with a temp ID
            const tempId = Date.now().toString();
            const optimisticTask: TodoTask = {
                id: tempId,
                ...task,
                completed: false,
                date: dateKey,
            };
            
            setTasks((prev) => {
                return [...prev, optimisticTask].sort((a, b) => a.time.localeCompare(b.time));
            });
            
            // Background sync
            addTodoAction({ ...task, date: dateKey })
                .then(realTask => {
                    setTasks(prev => prev.map(t => t.id === tempId ? realTask : t));
                })
                .catch(console.error);
        },
        [dateKey]
    );

    const toggleTask = useCallback(
        async (id: string) => {
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            // 1. No undo rule (client side)
            if (task.completed) return;

            // 2. We don't do an optimistic update for toggling anymore 
            // because the server might reject it due to the 2-minute snooze.
            try {
                const result = await toggleTodoAction(id, true);
                if (result.success) {
                    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: true } : t));
                } else {
                    alert(result.message);
                }
            } catch (error: any) {
                alert(error.message || "Failed to complete task");
            }
        },
        [tasks]
    );

    const deleteTask = useCallback(
        (id: string) => {
            setTasks((prev) => prev.filter((t) => t.id !== id));
            deleteTodoAction(id).catch(console.error);
        },
        []
    );

    const completedCount = tasks.filter((t) => t.completed).length;

    return { tasks, isLoaded, addTask, toggleTask, deleteTask, completedCount, total: tasks.length };
}
