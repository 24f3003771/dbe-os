"use client";

import { useState } from "react";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createListing } from "@/actions/matchforge";
import { ListingType } from "@/types/matchforge";

const CATEGORIES = ['Case Competition', 'Hackathon', 'Co-founder', 'Learning Partner'];

export default function CreateListingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Case Competition" as ListingType,
    required_skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput && !formData.required_skills.includes(skillInput)) {
      setFormData({ ...formData, required_skills: [...formData.required_skills, skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, required_skills: formData.required_skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createListing(formData);
      setIsOpen(false);
      setFormData({
        title: "",
        description: "",
        type: "Case Competition",
        required_skills: []
      });
      alert("Listing created successfully!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        <Plus className="w-4 h-4" />
        Create Listing
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-surface-container-lowest rounded-[2.5rem] shadow-2xl border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-8 border-b border-outline-variant/5 flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black font-headline text-on-surface">Post a Request</h2>
                    <p className="text-xs text-on-surface-variant font-medium">Find your perfect match in the community</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Listing Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: cat as ListingType })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          formData.type === cat 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Title</label>
                  <input
                    required
                    placeholder="e.g., Looking for a Finance lead for IIMB Case Comp"
                    className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell the community about the project and what you're looking for..."
                    className="w-full bg-surface-container p-4 rounded-2xl border border-transparent focus:border-indigo-500/30 focus:outline-none transition-all text-sm font-medium resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Required Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      placeholder="Add a skill..."
                      className="flex-1 bg-surface-container p-3 rounded-xl border border-transparent focus:border-indigo-500/30 focus:outline-none text-sm font-medium"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="p-3 bg-surface-container text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.required_skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-100">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-on-surface text-surface-container-lowest py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Publish Listing"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
