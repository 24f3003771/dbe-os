"use client";

import { useState, useEffect } from "react";
import { 
    Edit2, X, Loader2, GraduationCap, User as UserIcon, Mail, 
    MapPin, Building, Phone, Compass, Trophy, Star, Shield,
    ExternalLink, Plus
} from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";
import { useFarmStore } from "@/hooks/useFarmStore";
import Link from "next/link";

interface ProfileClientProps {
    profile: any;
    availableBatches: string[];
}

export default function ProfileClient({ profile: initialProfile, availableBatches }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    // Live Tomato Count
    const { tomatoesBalance, fetchFarmData } = useFarmStore();
    
    useEffect(() => {
        fetchFarmData();
    }, [fetchFarmData]);

    const [formData, setFormData] = useState({
        name: initialProfile.name || "",
        batch: initialProfile.batch || "",
        phone: initialProfile.phone || "",
        city: initialProfile.city || "",
        state: initialProfile.state || "",
        pincode: initialProfile.pincode || "",
        linkedin_url: initialProfile.linkedin_url || "",
        instagram_url: initialProfile.instagram_url || "",
        twitter_url: initialProfile.twitter_url || "",
        roll_number: initialProfile.roll_number || "",
        current_term: initialProfile.current_term || "",
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

    const initials = initialProfile.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MS';

    const handleSocialClick = (url: string, type: string) => {
        if (!url) {
            setIsEditing(true);
            // Optionally scroll to social section or highlight it
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
            {/* Edit Trigger */}
            <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-8 right-8 p-3 bg-surface-container-highest/50 backdrop-blur-sm rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-outline-variant/10 shadow-sm group z-20"
            >
                <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Header Card */}
            <div className="bg-surface-container rounded-3xl p-8 relative overflow-hidden shadow-sm border border-outline-variant/10">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-primary/20 border-4 border-surface">
                        {initials}
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight">
                                {initialProfile.name}
                            </h1>
                            {initialProfile.role === 'SUPER_ADMIN' && (
                                <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-error/20 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> HQ Admin
                                </span>
                            )}
                            {initialProfile.role === 'MODERATOR' && (
                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Moderator
                                </span>
                            )}
                        </div>
                        <p className="text-on-surface-variant font-medium text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-5 h-5 opacity-50" /> {initialProfile.email}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold text-on-surface flex items-center gap-2 border border-outline-variant/10">
                                <GraduationCap className="w-4 h-4 text-primary" /> {initialProfile.batch || 'Batch Unknown'}
                            </div>
                            <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold text-on-surface flex items-center gap-2 border border-outline-variant/10">
                                <Compass className="w-4 h-4 text-secondary" /> {initialProfile.zone || 'No Zone'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/15 space-y-6">
                    <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                        <UserIcon className="w-5 h-5 text-primary" /> Contact Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Phone Number</p>
                                <p className="font-bold text-on-surface">{initialProfile.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <Building className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">State & City</p>
                                <p className="font-bold text-on-surface">{initialProfile.city ? `${initialProfile.city}, ${initialProfile.state}` : 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Pincode</p>
                                <p className="font-bold text-on-surface">{initialProfile.pincode || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/15 space-y-6">
                    <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                        <GraduationCap className="w-5 h-5 text-primary" /> Academic Profile
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Roll Number</p>
                            <p className="font-black text-on-surface text-sm">{initialProfile.roll_number || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Current Term</p>
                            <p className="font-black text-on-surface text-sm">{initialProfile.current_term || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Social Presence</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleSocialClick(initialProfile.linkedin_url, 'linkedin')}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm group relative ${
                                    initialProfile.linkedin_url 
                                    ? "bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white" 
                                    : "bg-surface-container text-on-surface-variant/30 border border-dashed border-outline-variant/20 hover:border-primary/50 hover:text-primary"
                                }`}
                            >
                                <div className="font-black text-sm">in</div>
                                {initialProfile.linkedin_url && (
                                    <ExternalLink className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                {!initialProfile.linkedin_url && (
                                    <Plus className="w-3 h-3 absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5" />
                                )}
                            </button>

                            <button 
                                onClick={() => handleSocialClick(initialProfile.instagram_url, 'instagram')}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm group relative ${
                                    initialProfile.instagram_url 
                                    ? "bg-[#e4405f]/10 text-[#e4405f] hover:bg-[#e4405f] hover:text-white" 
                                    : "bg-surface-container text-on-surface-variant/30 border border-dashed border-outline-variant/20 hover:border-primary/50 hover:text-primary"
                                }`}
                            >
                                <div className="font-black text-sm">ig</div>
                                {initialProfile.instagram_url && (
                                    <ExternalLink className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                {!initialProfile.instagram_url && (
                                    <Plus className="w-3 h-3 absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/15 space-y-6 md:col-span-2">
                    <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                        <Trophy className="w-5 h-5 text-secondary" /> Academic Stats
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-6 bg-surface rounded-3xl border border-outline-variant/5">
                            <span className="text-2xl mb-2">🍅</span>
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Tomatoes</p>
                            <p className="text-xl font-black text-on-surface animate-in zoom-in duration-300" key={tomatoesBalance}>
                                {tomatoesBalance.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-surface rounded-3xl border border-outline-variant/5">
                            <span className="text-2xl mb-2">📚</span>
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Notes Viewed</p>
                            <p className="text-xl font-black text-on-surface">12</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-surface rounded-3xl border border-outline-variant/5">
                            <span className="text-2xl mb-2">🎯</span>
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Quizzes</p>
                            <p className="text-xl font-black text-on-surface">4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Link href="/" className="flex-1">
                    <button className="w-full py-4 bg-surface-container border border-outline-variant/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                        Return to Dashboard
                    </button>
                </Link>
                <form action="/auth/signout" method="post" className="flex-1">
                    <button type="submit" className="w-full py-4 bg-error/5 border border-error/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-error hover:bg-error/10 transition-all shadow-sm flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                    </button>
                </form>
            </div>

            {/* Edit Modal */}
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
                                        <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
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
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Social Profiles (Optional)</p>
                                    
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
        </div>
    );
}
