"use client";

import { useState } from "react";
import { UserCircle, Linkedin, Phone, Save, Loader2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, MatchProfile } from "@/actions/matchforge";

const ROLES = ['Finance', 'Marketing', 'Operations', 'Product', 'Strategy', 'Design', 'Data', 'UI/UX'];
const COMMON_SKILLS = [
  'Financial Modeling', 'Market Research', 'Pitch Deck Design', 
  'Operations', 'Marketing Strategy', 'Product Management', 
  'Data Analytics', 'Public Speaking', 'UI/UX Design'
];

export default function ProfileSetupModal({ isOpen, initialData }: { isOpen: boolean, initialData?: MatchProfile | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: initialData?.role || 'Finance',
    bio: initialData?.bio || '',
    skills: initialData?.skills || [] as string[],
    linkedin_url: initialData?.linkedin_url || '',
    whatsapp_number: initialData?.whatsapp_number || ''
  });

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bio || formData.skills.length === 0 || !formData.linkedin_url) {
      alert("Please fill in all required fields (Bio, Skills, and LinkedIn)");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      window.location.reload(); // Refresh to update state
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
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-headline tracking-tight">Complete Your Profile</h2>
              <p className="text-indigo-100 text-sm font-medium">To join the MatchForge community, we need a few details.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Your Primary Role</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formData.role === role 
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
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Professional Bio</label>
            <textarea
              required
              rows={3}
              placeholder="Tell others about your interests, goals, and what you're looking for in a teammate..."
              className="w-full bg-surface-container p-5 rounded-[2rem] border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium resize-none leading-relaxed"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

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
                  placeholder="linkedin.com/in/yourname"
                  className="w-full bg-surface-container p-4 pl-12 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">WhatsApp (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-container p-4 pl-12 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-on-surface text-surface-container-lowest py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Launch Into MatchForge
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
