"use client";

import { useEffect, useState } from "react";
import { Target, MoreHorizontal, Check, Plus, Trash2, Clock, Flame, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useFarmStore } from "@/hooks/useFarmStore";

// Types
type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at?: string;
};

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
};

export default function TodaysMission({ userId }: { userId: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [genZAlert, setGenZAlert] = useState<string | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  const { earnTomatoes } = useFarmStore();
  const supabase = createClient();

  // Tick timer every second for 1-min snooze lock countdowns
  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const todayDateStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
      const lastSavedDate = localStorage.getItem("dbe_last_mission_date");

      // Daily auto-clear check
      if (lastSavedDate && lastSavedDate !== todayDateStr) {
        // Auto-clear completed personal todos from previous days
        await supabase
          .from("user_todos")
          .delete()
          .eq("user_id", userId)
          .eq("is_completed", true);
      }
      localStorage.setItem("dbe_last_mission_date", todayDateStr);

      // 1. Fetch user's personal todos
      const { data: todosData } = await supabase
        .from("user_todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (todosData) {
        // Filter out completed tasks from yesterday if any remain
        const filtered = todosData.filter((t) => {
          if (!t.created_at) return true;
          const taskDate = new Date(t.created_at).toLocaleDateString("en-CA");
          return !(t.is_completed && taskDate !== todayDateStr);
        });
        setTodos(filtered);
      }

      // 2. Fetch global assignments
      const { data: globalAssignments } = await supabase
        .from("global_assignments")
        .select("*")
        .order("created_at", { ascending: false });

      // 3. Fetch user's assignment progress
      const { data: userAssignments } = await supabase
        .from("user_assignments")
        .select("*")
        .eq("user_id", userId);

      if (globalAssignments) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const mappedAssignments = globalAssignments.map((ga: any) => {
          const ua = userAssignments?.find((u: any) => u.assignment_id === ga.id);
          let isCompleted = false;
          if (ua && ua.is_completed) {
            const completedAt = new Date(ua.completed_at);
            if (completedAt >= startOfWeek) {
              isCompleted = true;
            }
          }
          return {
            id: ga.id,
            title: ga.title,
            due_date: ga.due_date,
            is_completed: isCompleted,
          };
        });
        setAssignments(mappedAssignments);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSnoozeRemaining = (createdAt?: string) => {
    if (!createdAt) return 0;
    const createdMs = new Date(createdAt).getTime();
    const elapsedSec = Math.floor((nowTs - createdMs) / 1000);
    return Math.max(0, 60 - elapsedSec);
  };

  const toggleTodo = async (todo: Todo) => {
    const remainingSnooze = getSnoozeRemaining(todo.created_at);

    // 1-minute snooze / Anti-cheat check when completing
    if (!todo.is_completed && remainingSnooze > 0) {
      setGenZAlert(
        `Bro fr? 💀 Do the task genuinely first, no cap! 🧢 Lock active for ${remainingSnooze}s. Earn those +5 🍅 properly! 🔥`
      );
      return;
    }

    const newStatus = !todo.is_completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, is_completed: newStatus } : t))
    );

    // Reward 5 tomatoes if task is completed
    if (newStatus) {
      earnTomatoes({
        actionType: "mission_completed",
        description: `Completed mission: ${todo.title}`,
        tomatoes: 5,
      });
    }

    await supabase
      .from("user_todos")
      .update({ is_completed: newStatus })
      .eq("id", todo.id);
  };

  const deleteTodo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("user_todos").delete().eq("id", id);
  };

  const toggleAssignment = async (assignment: Assignment) => {
    const newStatus = !assignment.is_completed;
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignment.id ? { ...a, is_completed: newStatus } : a))
    );

    // Reward 5 tomatoes if assignment completed
    if (newStatus) {
      earnTomatoes({
        actionType: "mission_completed",
        description: `Completed assignment: ${assignment.title}`,
        tomatoes: 5,
      });
    }

    const completedAt = newStatus ? new Date().toISOString() : null;
    await supabase.from("user_assignments").upsert(
      {
        user_id: userId,
        assignment_id: assignment.id,
        is_completed: newStatus,
        completed_at: completedAt,
      },
      { onConflict: "user_id, assignment_id" }
    );
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const title = newTaskTitle.trim();
    setNewTaskTitle("");

    const nowIso = new Date().toISOString();
    const tempId = "temp-" + Date.now();

    // Optimistic UI update with timestamp for snooze lock
    setTodos((prev) => [
      { id: tempId, title, is_completed: false, created_at: nowIso },
      ...prev,
    ]);

    const { data, error } = await supabase
      .from("user_todos")
      .insert({ user_id: userId, title, is_completed: false })
      .select()
      .single();

    if (data) {
      setTodos((prev) => prev.map((t) => (t.id === tempId ? data : t)));
    }
  };

  const formatDeadline = (dateString: string) => {
    if (!dateString) return "";
    const due = new Date(dateString);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const totalItems = todos.length + assignments.length;
  const completedItems =
    todos.filter((t) => t.is_completed).length +
    assignments.filter((a) => a.is_completed).length;
  const percentComplete = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[350px] relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <Target className="w-5 h-5" />
            <h3 className="font-black text-stone-900 text-base">Today's Mission</h3>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-[11px] font-black text-amber-700">
            <span>+5 🍅 / task</span>
          </div>
        </div>

        {/* Gen-Z Anti-Cheat Alert Popup */}
        {genZAlert && (
          <div className="mb-4 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-3 rounded-2xl text-xs font-bold flex items-start justify-between shadow-lg border border-rose-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex gap-2.5 items-start">
              <span className="text-base shrink-0">💀</span>
              <p className="leading-snug text-rose-100">{genZAlert}</p>
            </div>
            <button
              onClick={() => setGenZAlert(null)}
              className="text-stone-400 hover:text-white p-0.5 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-sm text-stone-400 py-4 animate-pulse">Loading missions...</div>
          ) : totalItems === 0 ? (
            <div className="text-center text-sm text-stone-400 py-6 font-medium">No missions today. Add one below! 🚀</div>
          ) : (
            <>
              {/* Global Assignments */}
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => toggleAssignment(assignment)}
                  className="flex flex-col cursor-pointer group p-2 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                        assignment.is_completed
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-200 group-hover:bg-rose-600"
                          : "border-2 border-stone-300 group-hover:border-rose-400"
                      }`}
                    >
                      {assignment.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm font-bold flex-1 ${
                        assignment.is_completed ? "text-stone-400 line-through" : "text-stone-900"
                      }`}
                    >
                      {assignment.title}
                    </span>
                    {assignment.is_completed && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +5 🍅
                      </span>
                    )}
                  </div>
                  {assignment.due_date && !assignment.is_completed && (
                    <span className="text-[10px] font-bold text-rose-400 ml-8 uppercase tracking-wider mt-0.5">
                      {formatDeadline(assignment.due_date)}
                    </span>
                  )}
                </div>
              ))}

              {/* Personal Todos */}
              {todos.map((todo) => {
                const remainingSec = getSnoozeRemaining(todo.created_at);

                return (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo)}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                        todo.is_completed
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-200 group-hover:bg-rose-600"
                          : remainingSec > 0
                          ? "border-2 border-amber-300 bg-amber-50/50"
                          : "border-2 border-stone-300 group-hover:border-rose-400"
                      }`}
                    >
                      {todo.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm font-bold flex-1 ${
                        todo.is_completed ? "text-stone-400 line-through" : "text-stone-900"
                      }`}
                    >
                      {todo.title}
                    </span>

                    {/* Snooze Lock Indicator */}
                    {!todo.is_completed && remainingSec > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>{remainingSec}s lock</span>
                      </div>
                    )}

                    {/* Completed Reward Tag */}
                    {todo.is_completed && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        +5 🍅
                      </span>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteTodo(todo.id, e)}
                      title="Delete task"
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-all shrink-0 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Add new Task Input */}
        <form onSubmit={addTodo} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new mission task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 text-sm bg-stone-50 rounded-xl px-3.5 py-2.5 outline-none border border-stone-100 focus:border-rose-300 focus:bg-white transition-all text-stone-900 font-medium placeholder:text-stone-400 shadow-inner"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="bg-stone-900 text-white p-2.5 rounded-xl hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-stone-900 transition-all shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Progress Footer */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">{percentComplete}% Completed</span>
            <span className="text-[11px] font-black text-rose-500">
              {completedItems * 5} Tomatoes Earned Today 🍅
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-rose-500 h-full rounded-l-full transition-all duration-500 shadow-sm shadow-rose-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

