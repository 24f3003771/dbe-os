"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Calendar } from "lucide-react";

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  created_at: string;
};

export default function AssignmentsPanel() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("global_assignments")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setAssignments(data);
    setIsLoading(false);
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const { data, error } = await supabase
      .from("global_assignments")
      .insert({ title, due_date: new Date(dueDate).toISOString() })
      .select()
      .single();

    if (data) {
      setAssignments([data, ...assignments]);
      setTitle("");
      setDueDate("");
    } else {
      console.error(error);
      alert("Failed to create assignment");
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment? It will be removed from all users' dashboards.")) return;

    await supabase.from("global_assignments").delete().eq("id", id);
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight mb-1">Global Assignments</h2>
          <p className="text-sm font-bold text-on-surface-variant">Push weekly assignments and deadlines to all student dashboards.</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden mb-6 p-6">
        <form onSubmit={createAssignment} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-on-surface-variant mb-2">Assignment Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Complete Economics Quiz 3"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2">Due Date</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2 h-[46px]"
          >
            <Plus className="w-4 h-4" /> Push Assignment
          </button>
        </form>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm font-bold text-on-surface-variant animate-pulse">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-on-surface-variant">No active assignments pushed.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {assignments.map(assignment => (
                <tr key={assignment.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-on-surface">{assignment.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                      <Calendar className="w-4 h-4" />
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors inline-flex"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
