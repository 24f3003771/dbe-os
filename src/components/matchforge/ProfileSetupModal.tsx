"use client";

import { useState } from "react";
import { UserCircle, Linkedin, Phone, Save, Loader2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "@/actions/matchforge";
import { MatchProfile } from "@/types/matchforge";

const ROLES = ['Finance', 'Marketing', 'Operations', 'Product', 'Strategy', 'Design', 'Data', 'UI/UX'];
const COMMON_SKILLS = [
  'Financial Modeling', 'Market Research', 'Pitch Deck Design', 
  'Operations', 'Marketing Strategy', 'Product Management', 
  'Data Analytics', 'Public Speaking', 'UI/UX Design'
];

export default function ProfileSetupModal({ isOpen, initialData }: { isOpen: boolean, initialData?: MatchProfile | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState(!initialData?.is_complete);
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'academic'>('basic');
  const [formData, setFormData] = useState({
    roles: initialData?.roles || [] as string[],
    bio: initialData?.bio || '',
    skills: initialData?.skills || [] as string[],
    education: initialData?.education || [] as any[],
    experience: initialData?.experience || [] as any[],
    location: initialData?.location || '',
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
    // Simulate LinkedIn Fetch with AI logic
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        bio: prev.bio || "Student at IIM Bangalore specializing in Business Analytics and Digital Business. Passionate about product strategy and market operations.",
        experience: [{ company: "IIMB", role: "Student Researcher", duration: "2024 - Present" }],
        education: [{ school: "IIM Bangalore", degree: "BBA DBE", year: "2026" }],
        skills: [...new Set([...prev.skills, 'Strategy', 'Analytics', 'Product Management'])]
      }));
      setIsSubmitting(false);
      setOnboardingMode(false);
      alert("Profile data fetched and simulated from LinkedIn!");
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.roles.length === 0 || !formData.bio || formData.skills.length === 0) {
      alert("Please fill in roles, bio, and skills");
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
        <div className="p-8 md:p-10 border-b border-outline-variant/5 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-headline tracking-tight">MatchForge Identity</h2>
                <p className="text-indigo-100 text-sm font-medium">Build your professional presence</p>
              </div>
            </div>
            {!onboardingMode && (
              <button 
                type="button"
                onClick={handleFetchLinkedIn}
                className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Fetch LinkedIn
              </button>
            )}
          </div>

          {!onboardingMode && (
            <div className="flex items-center gap-1 mt-8 bg-black/10 p-1 rounded-2xl w-fit">
              {(['basic', 'professional', 'academic'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600' : 'text-white/60 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {onboardingMode ? (
          <div className="p-10 space-y-8 text-center">
            <div className="space-y-4 max-w-sm mx-auto">
              <h3 className="text-xl font-black font-headline text-on-surface">Auto-Build Your Profile</h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                Enter your LinkedIn URL and we'll handle the heavy lifting. We'll fetch your education, experience, and bio automatically.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  placeholder="https://linkedin.com/in/yourname"
                  className="w-full bg-surface-container p-6 pl-14 rounded-[2rem] border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium transition-all"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFetchLinkedIn}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Fetch My Details"}
              </button>
              <button
                onClick={() => setOnboardingMode(false)}
                className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-indigo-600 transition-colors py-2"
              >
                Or setup manually
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'basic' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Select Roles (Multi-select)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formData.roles.includes(role)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Professional Headline & Bio</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Craft a compelling story... What are you building? What do you bring to the table?"
                  className="w-full bg-surface-container p-6 rounded-[2.5rem] border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium leading-relaxed shadow-inner"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'professional' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Top Skills</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                        formData.skills.includes(skill)
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      required
                      placeholder="linkedin.com/in/..."
                      className="w-full bg-surface-container p-4 pl-12 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      placeholder="+91..."
                      className="w-full bg-surface-container p-4 pl-12 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'academic' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Location</label>
                  <input
                    placeholder="City/State"
                    className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Grad Year</label>
                  <input
                    type="number"
                    className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                    value={formData.grad_year}
                    onChange={(e) => setFormData({ ...formData, grad_year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Term</label>
                  <select
                    className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                    value={formData.current_term}
                    onChange={(e) => setFormData({ ...formData, current_term: parseInt(e.target.value) })}
                  >
                    {[1,2,3,4,5,6,7,8].map(t => <option key={t} value={t}>Term {t}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-4">
            <button
              disabled={isSubmitting}
              className="w-full bg-on-surface text-surface-container-lowest py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Save MatchForge Profile
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </motion.div>
    </div>
  );
}
