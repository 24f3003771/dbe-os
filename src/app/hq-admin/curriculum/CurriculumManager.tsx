"use client";

import { useState, useEffect } from "react";
import { updateSubjectSchedule, getNoteContent, updateNoteContent } from "@/actions/curriculum";
import { BookOpen, Calendar, Save, CheckCircle2, FileText, Server } from "lucide-react";

export default function CurriculumManager({ initialCurriculum, initialSchedules }: { initialCurriculum: any[], initialSchedules: any }) {
    const [selectedTerm, setSelectedTerm] = useState<number>(initialCurriculum[1]?.term || 2); // Default to Term 2
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"schedule" | "notes">("schedule");
    
    // Editor State
    const [scheduleJson, setScheduleJson] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const currentTermData = initialCurriculum.find(c => c.term === selectedTerm);

    useEffect(() => {
        if (selectedSubject) {
            // Load Schedule
            const schedule = initialSchedules[selectedSubject.id] || [];
            setScheduleJson(JSON.stringify(schedule, null, 2));

            // Load Notes
            getNoteContent(selectedSubject.id).then(content => {
                setNoteContent(content);
            });
            
            setSuccessMessage("");
        }
    }, [selectedSubject, initialSchedules]);

    const handleSaveSchedule = async () => {
        if (!selectedSubject) return;
        setSaving(true);
        try {
            const parsed = JSON.parse(scheduleJson);
            const res = await updateSubjectSchedule(selectedSubject.id, parsed);
            if (res.success) {
                setSuccessMessage("Schedule saved successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                alert("Failed to save schedule: " + res.error);
            }
        } catch (e: any) {
            alert("Invalid JSON format: " + e.message);
        }
        setSaving(false);
    };

    const handleSaveNotes = async () => {
        if (!selectedSubject) return;
        setSaving(true);
        const res = await updateNoteContent(selectedSubject.id, noteContent);
        if (res.success) {
            setSuccessMessage("Notes saved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } else {
            alert("Failed to save notes: " + res.error);
        }
        setSaving(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface-container border border-outline-variant/10 p-5 rounded-2xl shadow-sm">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 block">Select Semester</label>
                    <select 
                        value={selectedTerm}
                        onChange={(e) => {
                            setSelectedTerm(Number(e.target.value));
                            setSelectedSubject(null);
                        }}
                        className="w-full bg-white border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    >
                        {initialCurriculum.map(term => (
                            <option key={term.term} value={term.term}>{term.name}</option>
                        ))}
                    </select>
                </div>

                {currentTermData && (
                    <div className="bg-surface-container border border-outline-variant/10 p-3 rounded-2xl shadow-sm max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-2 block mb-2 border-b border-outline-variant/10">Subjects</label>
                        <div className="space-y-1">
                            {currentTermData.subjects.map((sub: any) => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                        selectedSubject?.id === sub.id 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'text-on-surface-variant hover:bg-black/5 hover:text-on-surface'
                                    }`}
                                >
                                    <span className="truncate pr-2">{sub.name}</span>
                                    <span className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md ${
                                        selectedSubject?.id === sub.id ? 'bg-white/20 text-white' : 'bg-outline-variant/20 text-on-surface-variant'
                                    }`}>{sub.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-3">
                {selectedSubject ? (
                    <div className="bg-surface-container border border-outline-variant/10 rounded-[2rem] overflow-hidden flex flex-col h-[75vh] shadow-xl">
                        
                        {/* Editor Header */}
                        <div className="bg-surface-container-low border-b border-outline-variant/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-black text-on-surface">{selectedSubject.name}</h2>
                                <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1">Course Code: {selectedSubject.id}</p>
                            </div>
                            
                            <div className="flex bg-black/5 p-1 rounded-xl shrink-0">
                                <button 
                                    onClick={() => setActiveTab("schedule")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    <Calendar className="w-4 h-4" /> Schedule
                                </button>
                                <button 
                                    onClick={() => setActiveTab("notes")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    <BookOpen className="w-4 h-4" /> Notes
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 p-6 flex flex-col overflow-hidden">
                            {activeTab === "schedule" ? (
                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                                            <Server className="w-4 h-4 text-primary" /> Modify JSON Schedule Data
                                        </div>
                                    </div>
                                    <textarea
                                        value={scheduleJson}
                                        onChange={(e) => setScheduleJson(e.target.value)}
                                        className="flex-1 w-full bg-black/5 border border-outline-variant/20 rounded-2xl p-4 font-mono text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none custom-scrollbar"
                                        spellCheck={false}
                                    />
                                    <div className="flex items-center justify-between pt-2">
                                        {successMessage ? <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {successMessage}</span> : <div />}
                                        <button 
                                            onClick={handleSaveSchedule}
                                            disabled={saving}
                                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Schedule"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                                            <FileText className="w-4 h-4 text-primary" /> Markdown Content
                                        </div>
                                    </div>
                                    <textarea
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        className="flex-1 w-full bg-white border border-outline-variant/20 rounded-2xl p-6 font-mono text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none custom-scrollbar shadow-inner"
                                        placeholder="# Add module-wise notes here using markdown..."
                                    />
                                    <div className="flex items-center justify-between pt-2">
                                        {successMessage ? <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {successMessage}</span> : <div />}
                                        <button 
                                            onClick={handleSaveNotes}
                                            disabled={saving}
                                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Notes"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface-container border border-dashed border-outline-variant/20 rounded-[2rem] h-[75vh] flex flex-col items-center justify-center text-on-surface-variant/40">
                        <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-xl font-black italic uppercase tracking-widest">Select a Subject</p>
                        <p className="text-sm font-bold mt-2 opacity-70">Choose a course from the left to edit its schedule and notes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
