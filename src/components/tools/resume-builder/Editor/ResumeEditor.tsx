"use client";

import { useResumeStore } from "@/hooks/use-resume-store";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2, GraduationCap, Briefcase, Trophy, Users, Wrench, Target } from "lucide-react";
import { useState } from "react";

export default function ResumeEditor() {
  const { resume, updateResume, targetJob, jobDescription, setTargetJob, setJobDescription } = useResumeStore();
  const [activeSection, setActiveSection] = useState<string>("target");
  const [isEnhancing, setIsEnhancing] = useState<Record<string, boolean>>({});

  if (!resume) return null;

  const handleBasicsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({
      basics: { ...resume.basics, [name]: value }
    });
  };

  const addItem = (section: keyof any, newItem: any) => {
    const currentItems = (resume as any)[section] || [];
    updateResume({ [section]: [...currentItems, newItem] });
  };

  const removeItem = (section: keyof any, index: number) => {
    const currentItems = (resume as any)[section] || [];
    updateResume({ [section]: currentItems.filter((_: any, i: number) => i !== index) });
  };

  const updateItem = (section: keyof any, index: number, field: string, value: any) => {
    const currentItems = [...((resume as any)[section] || [])];
    currentItems[index] = { ...currentItems[index], [field]: value };
    updateResume({ [section]: currentItems });
  };

  const enhanceBullets = async (section: string, index: number) => {
    const items = (resume as any)[section];
    const item = items[index];
    const bullets = item.highlights || [item.summary];
    
    const key = `${section}-${index}`;
    setIsEnhancing(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await fetch("/api/resume/enhance-bullets", {
        method: "POST",
        body: JSON.stringify({ 
          highlights: bullets,
          jobDescription: targetJob === "specific" ? jobDescription : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.enhanced) {
        if (item.highlights) {
          updateItem(section as any, index, "highlights", data.enhanced);
        } else {
          updateItem(section as any, index, "summary", data.enhanced.join(" "));
        }
      } else {
        throw new Error("No enhanced content returned");
      }
    } catch (error: any) {
      console.error("Enhance error:", error);
      alert(`AI Fix failed: ${error.message || "Unknown error"}. Please check your connection.`);
    } finally {
      setIsEnhancing(prev => ({ ...prev, [key]: false }));
    }
  };

  const SectionHeader = ({ id, title, icon: Icon, count }: { id: string, title: string, icon: any, count?: number }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className="w-full p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors border-b border-outline-variant/5"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${activeSection === id ? 'bg-indigo-600 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black font-headline text-on-surface">{title}</h2>
        {count !== undefined && (
          <span className="bg-surface-container px-2 py-0.5 rounded-md text-[10px] font-black text-on-surface-variant uppercase">{count}</span>
        )}
      </div>
      {activeSection === id ? <ChevronUp className="w-5 h-5 text-on-surface-variant" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
    </button>
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Target Job Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="target" title="Job Targeting" icon={Target} />
        {activeSection === 'target' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="targetJob" value="general" checked={targetJob === "general"} onChange={() => setTargetJob("general")} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span className="text-sm font-bold text-on-surface">General Resume</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="targetJob" value="specific" checked={targetJob === "specific"} onChange={() => setTargetJob("specific")} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span className="text-sm font-bold text-on-surface">Specific Job</span>
              </label>
            </div>
            
            {targetJob === "specific" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Job Description</label>
                <textarea 
                  value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)} 
                  placeholder="Paste the job description here. Our AI will tweak your bullets to match keywords and be ATS friendly..." 
                  className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm min-h-[120px] resize-none" 
                />
                <p className="text-xs text-on-surface-variant italic">When you click 'AI Fix' on your experience or achievements, it will now optimize for this job description.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Basics Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="basics" title="Personal Information" icon={Users} />
        {activeSection === 'basics' && (
          <div className="p-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
              <input name="name" value={resume.basics.name} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Professional Title</label>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">LinkedIn / Portfolio URL</label>
              <input name="url" value={resume.basics.url} onChange={handleBasicsChange} className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium" />
            </div>
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="education" title="Education" icon={GraduationCap} count={resume.education.length} />
        {activeSection === 'education' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-4 relative border border-outline-variant/5 group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Institute (e.g. IIM Bangalore)" value={edu.institution} onChange={(e) => updateItem("education", idx, "institution", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-bold" />
                  <input placeholder="Degree (e.g. BBA Digital Business)" value={edu.area} onChange={(e) => updateItem("education", idx, "area", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                  <input placeholder="Year / Range (e.g. 2025-28)" value={edu.endDate} onChange={(e) => updateItem("education", idx, "endDate", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                  <input placeholder="Details/Focus" value={edu.details} onChange={(e) => updateItem("education", idx, "details", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                </div>
                <button onClick={() => removeItem("education", idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addItem("education", { institution: "", area: "", endDate: "", details: "" })} className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="work" title="Professional Experience" icon={Briefcase} count={resume.work.length} />
        {activeSection === 'work' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.work.map((work, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-4 relative border border-outline-variant/5 group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Position (e.g. Operations Intern)" value={work.position} onChange={(e) => updateItem("work", idx, "position", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-bold" />
                  <input placeholder="Company (e.g. Feeding Trends)" value={work.name} onChange={(e) => updateItem("work", idx, "name", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                  <input placeholder="Date Range (e.g. Dec 2025 - Jan 2026)" value={work.startDate} onChange={(e) => updateItem("work", idx, "startDate", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Bullet Points (Action Items)</label>
                    <button 
                      onClick={() => enhanceBullets("work", idx)} 
                      disabled={isEnhancing[`work-${idx}`]} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {isEnhancing[`work-${idx}`] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Fix
                    </button>
                  </div>
                  <textarea 
                    value={work.highlights.join('\n')} 
                    onChange={(e) => updateItem("work", idx, "highlights", e.target.value.split('\n'))} 
                    placeholder="• Developed a new feature...\n• Increased user engagement by 20%..." 
                    className="w-full bg-surface-container-lowest p-5 rounded-[1.5rem] border border-outline-variant/10 focus:border-indigo-500/30 focus:outline-none text-sm min-h-[120px] resize-none font-medium leading-relaxed" 
                  />
                </div>
                <button onClick={() => removeItem("work", idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addItem("work", { position: "", name: "", startDate: "", highlights: [] })} className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}
      </section>

      {/* Achievements Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="awards" title="Key Achievements & Awards" icon={Trophy} count={resume.awards?.length} />
        {activeSection === 'awards' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.awards?.map((award, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-4 relative border border-outline-variant/5 group">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Achievement Detail</label>
                  <div className="flex items-center gap-3">
                    <input 
                      placeholder="e.g. Won 1st place in National Case Study Competition..." 
                      value={award.summary} 
                      onChange={(e) => updateItem("awards", idx, "summary", e.target.value)} 
                      className="flex-1 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 focus:border-indigo-500/30 focus:outline-none text-sm font-medium" 
                    />
                    <button 
                      onClick={() => enhanceBullets("awards", idx)} 
                      disabled={isEnhancing[`awards-${idx}`]} 
                      className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {isEnhancing[`awards-${idx}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem("awards", idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addItem("awards", { summary: "" })} className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>
        )}
      </section>

      {/* POR Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="volunteer" title="Positions of Responsibility" icon={Users} count={resume.volunteer?.length} />
        {activeSection === 'volunteer' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.volunteer?.map((por, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-4 relative border border-outline-variant/5 group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Position (e.g. Sponsorship Coordinator)" value={por.position} onChange={(e) => updateItem("volunteer", idx, "position", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-bold" />
                  <input placeholder="Organization (e.g. Paradox)" value={por.organization} onChange={(e) => updateItem("volunteer", idx, "organization", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                  <input placeholder="Year (e.g. 2025)" value={por.startDate} onChange={(e) => updateItem("volunteer", idx, "startDate", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm" />
                </div>
                <textarea value={por.highlights.join('\n')} onChange={(e) => updateItem("volunteer", idx, "highlights", e.target.value.split('\n'))} placeholder="One bullet per line..." className="w-full bg-surface-container-lowest p-4 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm min-h-[80px] resize-none" />
                <button onClick={() => removeItem("volunteer", idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addItem("volunteer", { position: "", organization: "", startDate: "", highlights: [] })} className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add POR
            </button>
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2rem] overflow-hidden shadow-sm">
        <SectionHeader id="skills" title="Skills & Tools" icon={Wrench} count={resume.skills.length} />
        {activeSection === 'skills' && (
          <div className="p-8 pt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {resume.skills.map((skill, idx) => (
              <div key={idx} className="p-6 bg-surface-container-low rounded-3xl space-y-3 relative border border-outline-variant/5 group">
                <input placeholder="Category (e.g. Data Analytics)" value={skill.name} onChange={(e) => updateItem("skills", idx, "name", e.target.value)} className="bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-bold w-full" />
                <textarea placeholder="Skills (e.g. Python, SQL, Excel)" value={skill.keywords.join(', ')} onChange={(e) => updateItem("skills", idx, "keywords", e.target.value.split(',').map(s => s.trim()))} className="w-full bg-surface-container-lowest p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm min-h-[60px] resize-none" />
                <button onClick={() => removeItem("skills", idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addItem("skills", { name: "", keywords: [] })} className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Skill Category
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
