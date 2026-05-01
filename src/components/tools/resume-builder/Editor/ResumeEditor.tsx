"use client";

import { useResumeStore } from "@/hooks/use-resume-store";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ResumeEditor() {
  const { resume, updateResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [isEnhancing, setIsEnhancing] = useState<Record<number, boolean>>({});

  if (!resume) return null;

  const handleBasicsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({
      basics: { ...resume.basics, [name]: value }
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateResume({
      basics: {
        ...resume.basics,
        location: { ...resume.basics.location, [name]: value }
      }
    });
  };

  const addWork = () => {
    const newWork = [
      ...resume.work,
      { name: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [] }
    ];
    updateResume({ work: newWork });
  };

  const updateWork = (index: number, field: string, value: any) => {
    const newWork = [...resume.work];
    newWork[index] = { ...newWork[index], [field]: value };
    updateResume({ work: newWork });
  };

  const enhanceWorkBullets = async (index: number) => {
    const work = resume.work[index];
    if (!work.highlights.length) return;

    setIsEnhancing({ ...isEnhancing, [index]: true });
    try {
      const response = await fetch("/api/resume/enhance-bullets", {
        method: "POST",
        body: JSON.stringify({ highlights: work.highlights }),
      });
      const data = await response.json();
      if (data.enhanced) {
        updateWork(index, "highlights", data.enhanced);
      }
    } catch (error) {
      console.error("Enhance error:", error);
    } finally {
      setIsEnhancing({ ...isEnhancing, [index]: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basics Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden">
        <button 
          onClick={() => setActiveSection(activeSection === 'basics' ? '' : 'basics')}
          className="w-full p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black font-headline text-on-surface">Personal Information</h2>
          </div>
          {activeSection === 'basics' ? <ChevronUp className="w-5 h-5 text-on-surface-variant" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
        </button>

        {activeSection === 'basics' && (
          <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
              <input name="name" value={resume.basics.name} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Job Title</label>
              <input name="label" value={resume.basics.label} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
              <input name="email" value={resume.basics.email} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone</label>
              <input name="phone" value={resume.basics.phone} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Summary</label>
              <textarea name="summary" value={resume.basics.summary} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium h-32 resize-none" />
            </div>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden">
        <button 
          onClick={() => setActiveSection(activeSection === 'work' ? '' : 'work')}
          className="w-full p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black font-headline text-on-surface">Experience</h2>
            <span className="bg-surface-container px-2 py-0.5 rounded-md text-[10px] font-black text-on-surface-variant uppercase">{resume.work.length} Roles</span>
          </div>
          {activeSection === 'work' ? <ChevronUp className="w-5 h-5 text-on-surface-variant" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
        </button>

        {activeSection === 'work' && (
          <div className="p-8 pt-0 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.work.map((work, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-6 relative border border-outline-variant/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Company</label>
                    <input value={work.name} onChange={(e) => updateWork(idx, "name", e.target.value)} className="w-full bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Position</label>
                    <input value={work.position} onChange={(e) => updateWork(idx, "position", e.target.value)} className="w-full bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Highlights (Bullet Points)</label>
                    <button 
                      onClick={() => enhanceWorkBullets(idx)}
                      disabled={isEnhancing[idx]}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                    >
                      {isEnhancing[idx] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea 
                    value={work.highlights.join('\n')} 
                    onChange={(e) => updateWork(idx, "highlights", e.target.value.split('\n'))}
                    placeholder="Enter one highlight per line..."
                    className="w-full bg-surface-container-lowest p-4 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm min-h-[120px] resize-none" 
                  />
                </div>

                <button 
                  onClick={() => updateResume({ work: resume.work.filter((_, i) => i !== idx) })}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button 
              onClick={addWork}
              className="w-full py-4 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-xs uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}
      </section>

      {/* Add more sections (Education, Skills, etc.) similarly */}
      <div className="text-center py-4">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Education, Skills & Projects coming soon</p>
      </div>
    </div>
  );
}
