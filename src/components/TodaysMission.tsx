"use client";

import { useEffect, useState } from "react";
import { Target, MoreHorizontal, Check, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Types
type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
};

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  is_completed: boolean; // Computed field from user_assignments
};

export default function TodaysMission({ userId }: { userId: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user's personal todos
      const { data: todosData } = await supabase
        .from("user_todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (todosData) setTodos(todosData);

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
        // Calculate the start of the current week (Sunday)
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const mappedAssignments = globalAssignments.map((ga: any) => {
          const ua = userAssignments?.find((u: any) => u.assignment_id === ga.id);
          let isCompleted = false;
          if (ua && ua.is_completed) {
            // Check if completed this week
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

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: newStatus } : t))
    );
    await supabase
      .from("user_todos")
      .update({ is_completed: newStatus })
      .eq("id", id);
  };

  const toggleAssignment = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_completed: newStatus } : a))
    );

    const completedAt = newStatus ? new Date().toISOString() : null;

    // Upsert the user assignment record
    await supabase.from("user_assignments").upsert({
      user_id: userId,
      assignment_id: id,
      is_completed: newStatus,
      completed_at: completedAt,
    }, { onConflict: 'user_id, assignment_id' });
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const title = newTaskTitle.trim();
    setNewTaskTitle("");

    // Optimistic UI
    const tempId = Math.random().toString();
    setTodos((prev) => [{ id: tempId, title, is_completed: false }, ...prev]);

    const { data, error } = await supabase
      .from("user_todos")
      .insert({ user_id: userId, title })
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
      <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm flex flex-col flex-1 min-h-[350px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-indigo-600">
            <Target className="w-5 h-5" />
            <h3 className="font-black text-stone-900 text-base">Today's Mission</h3>
          </div>
          <MoreHorizontal className="w-5 h-5 text-stone-400 cursor-pointer" />
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-sm text-stone-400 py-4 animate-pulse">Loading missions...</div>
          ) : totalItems === 0 ? (
            <div className="text-center text-sm text-stone-400 py-4">No missions yet. Add one below!</div>
          ) : (
            <>
              {/* Global Assignments */}
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => toggleAssignment(assignment.id, assignment.is_completed)}
                  className="flex flex-col cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        assignment.is_completed
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-200 group-hover:bg-rose-600"
                          : "border-2 border-stone-200 group-hover:border-rose-300"
                      }`}
                    >
                      {assignment.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm font-bold flex-1 ${
                        assignment.is_completed ? "text-stone-500 line-through" : "text-stone-900"
                      }`}
                    >
                      {assignment.title}
                    </span>
                  </div>
                  {assignment.due_date && !assignment.is_completed && (
                    <span className="text-[10px] font-bold text-rose-400 ml-8 uppercase tracking-wider">
                      {formatDeadline(assignment.due_date)}
                    </span>
                  )}
                </div>
              ))}

              {/* Personal Todos */}
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id, todo.is_completed)}
                  className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      todo.is_completed
                        ? "bg-rose-500 text-white shadow-sm shadow-rose-200 group-hover:bg-rose-600"
                        : "border-2 border-stone-200 group-hover:border-rose-300"
                    }`}
                  >
                    {todo.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-sm font-bold flex-1 ${
                      todo.is_completed ? "text-stone-500 line-through" : "text-stone-900"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Add new Task Input */}
        <form onSubmit={addTodo} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 text-sm bg-stone-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all text-stone-900 font-medium placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="bg-stone-900 text-white p-2 rounded-lg hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-stone-900 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500">{percentComplete}% Completed</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-rose-400 h-full rounded-l-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
