"use client";

import { useState } from "react";
import { Edit2, X, Loader2, GraduationCap, User, Phone, MapPin, Building } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    profile: any;
    availableBatches: string[];
}

export default function ProfileClient({ profile, availableBatches }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: profile.name || "",
        batch: profile.batch || "",
        phone: profile.phone || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        linkedin_url: profile.linkedin_url || "",
        instagram_url: profile.instagram_url || "",
        twitter_url: profile.twitter_url || "",
        roll_number: profile.roll_number || "",
        current_term: profile.current_term || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setIsEditing(false);
                router.refresh();
            } else {
                setError(result.error || "Failed to update profile");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-8 right-8 p-3 bg-surface-container-highest/50 backdrop-blur-sm rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-outline-variant/10 shadow-sm group z-20"
            >
                <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    
                    <div className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between">
                            <h2 className="text-2xl font-black font-headline text-on-surface">Edit Profile</h2>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {error && (
                                <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Academic Batch</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <select 
                                            value={formData.batch} 
                                            onChange={(e) => setFormData({...formData, batch: e.target.value})}
                                            className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Batch</option>
                                            {availableBatches.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                            {availableBatches.length === 0 && (
                                                <>
                                                    <option value="Batch 1">Batch 1</option>
                                                    <option value="Batch 2">Batch 2</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input 
                                            type="tel" 
                                            value={formData.phone} 
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input 
                                                type="text" 
                                                value={formData.city} 
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">State</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input 
                                                type="text" 
                                                value={formData.state} 
                                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Pincode</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input 
                                            type="text" 
                                            value={formData.pincode} 
                                            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                            className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Roll Number</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 24DBE001"
                                                value={formData.roll_number} 
                                                onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Current Term</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Term 2"
                                                value={formData.current_term} 
                                                onChange={(e) => setFormData({...formData, current_term: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Social Profiles</p>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">LinkedIn URL</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50 flex items-center justify-center font-black text-[10px]">in</div>
                                            <input 
                                                type="url" 
                                                placeholder="https://linkedin.com/in/..."
                                                value={formData.linkedin_url} 
                                                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Instagram URL</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50 flex items-center justify-center font-black text-[10px]">ig</div>
                                            <input 
                                                type="url" 
                                                placeholder="https://instagram.com/..."
                                                value={formData.instagram_url} 
                                                onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-4 bg-surface border border-outline-variant/20 rounded-2xl font-black text-sm uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
