"use client";

import { useState } from "react";
import { UserCircle, Linkedin, Phone, Save, Loader2, Rocket, ArrowRight, Edit3, Sparkles, CheckCircle2, GraduationCap, Briefcase, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, scrapeLinkedInProfile } from "@/actions/matchforge";
import { MatchProfile } from "@/types/matchforge";

const ROLES = ['Finance', 'Marketing', 'Operations', 'Product', 'Strategy', 'Design', 'Data', 'UI/UX'];
const COMMON_SKILLS = [
  'Financial Modeling', 'Market Research', 'Pitch Deck Design', 
  'Operations', 'Marketing Strategy', 'Product Management', 
  'Data Analytics', 'Public Speaking', 'UI/UX Design'
];

type OnboardingStep = 'LANDING' | 'PREVIEW' | 'INTENT' | 'REVIEW' | 'MANUAL_JSON';

export default function ProfileSetupModal({ isOpen, initialData }: { isOpen: boolean, initialData?: MatchProfile | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<OnboardingStep>(initialData?.is_complete ? 'REVIEW' : 'LANDING');
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'academic'>('basic');
  
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    headline: initialData?.headline || '',
    roles: initialData?.roles || [] as string[],
    bio: initialData?.bio || '',
    skills: initialData?.skills || [] as string[],
    education: initialData?.education || [] as any[],
    experience: initialData?.experience || [] as any[],
    location: initialData?.location || 'IIM Bangalore',
    grad_year: initialData?.grad_year || 2026,
    current_term: initialData?.current_term || 1,
    linkedin_url: initialData?.linkedin_url || '',
    whatsapp_number: initialData?.whatsapp_number || ''
  });

  const toggleRole = (role: string) => {
    if (formData.roles.includes(role)) {
      setFormData({ ...formData, roles: formData.roles.filter(r => r !== role) });
    } else {
      setFormData({ ...formData, roles: [...formData.roles, role] });
    }
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleFetchLinkedIn = async () => {
    if (!formData.linkedin_url) return alert("Please enter your LinkedIn URL first");
    setIsSubmitting(true);
    
    try {
      const result = await scrapeLinkedInProfile(formData.linkedin_url);
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          full_name: result.data.full_name,
          headline: result.data.headline,
          bio: result.data.bio,
          location: result.data.location,
          skills: [...new Set([...prev.skills, ...result.data.skills])],
          experience: result.data.experience,
          education: result.data.education
        }));
        setStep('PREVIEW');
      } else {
        alert("Could not fetch detailed profile. Please check the URL or use the manual entry option.");
      }
    } catch (error) {
      console.error("Scrape Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualJson = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      setFormData(prev => ({
        ...prev,
        full_name: data.name || data.full_name || prev.full_name,
        headline: data.headline || prev.headline,
        bio: data.bio || data.about || prev.bio,
        skills: data.skills || prev.skills,
        experience: data.experience || prev.experience,
        education: data.education || prev.education,
      }));
      setStep('PREVIEW');
    } catch (e) {
      alert("Invalid JSON format. Please paste a valid profile object.");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (formData.roles.length === 0) {
      setStep('INTENT');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[3rem] shadow-2xl border border-outline-variant/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-outline-variant/5 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-headline tracking-tight">MatchForge Onboarding</h2>
                <p className="text-indigo-100 text-sm font-medium">Synced with your LinkedIn Profile</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 'LANDING' && (
              <motion.div 
                key="landing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-4 max-w-sm mx-auto">
                  <h3 className="text-2xl font-black font-headline text-on-surface">Auto-Sync Your Career</h3>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                    Enter your LinkedIn URL. Our AI will map your education, experience, and skills into the matrix instantly.
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="relative">
                    <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full bg-surface-container p-6 pl-16 rounded-[2rem] border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium transition-all"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleFetchLinkedIn}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Fetch Detailed Profile <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setStep('INTENT')}
                      className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-indigo-600 transition-colors py-2"
                    >
                      Setup manually
                    </button>
                    <span className="w-1 h-1 bg-outline-variant rounded-full" />
                    <button
                      onClick={() => setStep('MANUAL_JSON')}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:opacity-80 transition-opacity py-2"
                    >
                      Use JSON Import
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'MANUAL_JSON' && (
              <motion.div 
                key="manual_json"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-black font-headline text-on-surface">Import Profile JSON</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Paste the JSON output from your scraper repo here</p>
                </div>
                <textarea
                  rows={8}
                  placeholder='{ "name": "...", "headline": "...", "experience": [...] }'
                  className="w-full bg-surface-container p-6 rounded-[2rem] border border-transparent focus:border-indigo-500/30 focus:outline-none text-[10px] font-mono leading-relaxed"
                  onChange={(e) => {
                    try {
                      if (e.target.value.trim().startsWith('{')) {
                        handleManualJson(e.target.value);
                      }
                    } catch(err) {}
                  }}
                />
                <button
                  onClick={() => setStep('LANDING')}
                  className="w-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-indigo-600 transition-colors"
                >
                  Back to Auto-Sync
                </button>
              </motion.div>
            )}
            {step === 'PREVIEW' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <CheckCircle2 className="w-6 h-6" />
                  <p className="text-sm font-bold">Deep Scan Complete! Here's what we found:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[30vh] overflow-y-auto custom-scrollbar p-2">
                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
                        {formData.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-on-surface">{formData.full_name}</div>
                        <div className="text-[10px] font-medium text-on-surface-variant">{formData.headline}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">Education</span>
                    </div>
                    {formData.education.map((edu, i) => (
                      <div key={i} className="text-xs font-bold text-on-surface">
                        {edu.degree} at {edu.school}
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">Experience</span>
                    </div>
                    {formData.experience.map((exp, i) => (
                      <div key={i} className="text-xs font-bold text-on-surface">
                        {exp.role} @ {exp.company}
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 col-span-2">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <User className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">Summary</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                      {formData.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setStep('INTENT')}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    Looks Good, Continue <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStep('REVIEW')}
                    className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-indigo-600 transition-colors"
                  >
                    Wait, I want to edit this
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'INTENT' && (
              <motion.div 
                key="intent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-black font-headline text-on-surface">Almost Done!</h3>
                  <p className="text-sm text-on-surface-variant font-medium">What other details or roles would you like to add?</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Your Primary Roles</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ROLES.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          formData.roles.includes(role)
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                          : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="w-full bg-on-surface text-surface-container-lowest py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish & Explore <Rocket className="w-5 h-5" /></>}
                  </button>
                  <button
                    onClick={() => setStep('REVIEW')}
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-indigo-600 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Advanced Profile Edit
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'REVIEW' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-2xl w-fit mx-auto mb-4">
                  {(['basic', 'professional', 'academic'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 space-y-8">
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Professional Bio</label>
                        <textarea
                          rows={4}
                          className="w-full bg-surface-container p-6 rounded-[2.5rem] border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium leading-relaxed"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">WhatsApp (Optional)</label>
                        <input
                          placeholder="+91..."
                          className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                          value={formData.whatsapp_number}
                          onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'professional' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Focus Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {COMMON_SKILLS.map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${
                                formData.skills.includes(skill)
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-surface-container border-transparent text-on-surface-variant'
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'academic' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Academic Term</label>
                        <select
                          className="w-full bg-surface-container p-4 rounded-2xl border border-transparent text-sm font-medium"
                          value={formData.current_term}
                          onChange={(e) => setFormData({ ...formData, current_term: parseInt(e.target.value) })}
                        >
                          {[1,2,3,4,5,6,7,8].map(t => <option key={t} value={t}>Term {t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Base Location</label>
                        <input
                          className="w-full bg-surface-container p-4 rounded-2xl border border-transparent text-sm font-medium"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('INTENT')}
                    className="flex-1 bg-surface-container text-on-surface py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-surface-container-high transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="flex-[2] bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Profile"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
