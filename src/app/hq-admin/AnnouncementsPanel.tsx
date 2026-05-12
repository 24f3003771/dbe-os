"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Megaphone, Loader2 } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  batch: string;
  term: string;
  created_at: string;
};

export default function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [batch, setBatch] = useState("Batch 1");
  const [term, setTerm] = useState("Term 1");

  const supabase = createClient();

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setAnnouncements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setSaving(true);
    
    const { error } = await supabase.from("announcements").insert([{
      title,
      message,
      batch,
      term
    }]);

    if (!error) {
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  };

  return (
    <div className="mt-12 bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">Official Notices</h2>
          <p className="text-sm font-medium text-on-surface-variant">Push live announcements to student dashboards based on their batch and term.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-surface border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-6">Create Notice</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Notice Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Exam Schedule Released"
                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder="Write your announcement here..."
                rows={4}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Target Batch</label>
                <select 
                  value={batch} 
                  onChange={e => setBatch(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface focus:border-amber-500 outline-none"
                >
                  <option value="Batch 1">Batch 1</option>
                  <option value="Batch 2">Batch 2</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Term</label>
                <select 
                  value={term} 
                  onChange={e => setTerm(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface focus:border-amber-500 outline-none"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving || !title || !message}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-500 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Publish Notice
            </button>
          </form>
        </div>

        {/* Existing Notices */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-2">Live Notices</h3>
          
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
          ) : announcements.length === 0 ? (
            <div className="bg-surface border border-dashed border-outline-variant/20 rounded-2xl py-12 flex flex-col items-center justify-center text-on-surface-variant/50">
              <Megaphone className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">No active notices</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {announcements.map(a => (
                <div key={a.id} className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex gap-4 group hover:border-amber-500/30 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{a.batch}</span>
                      <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{a.term}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant/50 ml-auto">{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">{a.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed whitespace-pre-wrap">{a.message}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(a.id)}
                    className="shrink-0 p-2 text-error/40 hover:text-error hover:bg-error/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
