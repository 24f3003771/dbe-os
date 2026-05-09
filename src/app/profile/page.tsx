import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User as UserIcon, Mail, MapPin, Building, Phone, GraduationCap, Compass, Trophy, Star, Shield } from "lucide-react";
import Link from "next/link";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch full profile from the public.users table
    const { data: dbProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch unique batches from terms
    const { data: terms } = await supabase
        .from('terms')
        .select('assigned_batch');
    
    const availableBatches = Array.from(new Set((terms || [])
        .map(t => t.assigned_batch)
        .filter(Boolean) as string[]))
        .sort();

    // Fallback to Auth metadata if the database row is missing (e.g. for older accounts)
    const profile = dbProfile || {
        name: user.user_metadata?.full_name || 'Scholar',
        email: user.email,
        phone: user.user_metadata?.phone,
        city: user.user_metadata?.city,
        state: user.user_metadata?.state,
        pincode: user.user_metadata?.pincode,
        zone: user.user_metadata?.zone,
        batch: user.user_metadata?.batch,
        linkedin_url: user.user_metadata?.linkedin_url,
        instagram_url: user.user_metadata?.instagram_url,
        twitter_url: user.user_metadata?.twitter_url,
        roll_number: user.user_metadata?.roll_number,
        current_term: user.user_metadata?.current_term,
        type: 1,
        role: 'USER',
    };

    const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MS';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
            <ProfileClient profile={profile} availableBatches={availableBatches} />

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
                                {profile.name}
                            </h1>
                            {profile.role === 'SUPER_ADMIN' && (
                                <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-error/20 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> HQ Admin
                                </span>
                            )}
                            {profile.role === 'MODERATOR' && (
                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Moderator
                                </span>
                            )}
                        </div>
                        <p className="text-on-surface-variant font-medium text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-5 h-5 opacity-50" /> {profile.email}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold text-on-surface flex items-center gap-2 border border-outline-variant/10">
                                <GraduationCap className="w-4 h-4 text-primary" /> {profile.batch || 'Batch Unknown'}
                            </div>
                            <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold text-on-surface flex items-center gap-2 border border-outline-variant/10">
                                <Compass className="w-4 h-4 text-secondary" /> {profile.zone || 'No Zone'}
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
                                <p className="font-bold text-on-surface">{profile.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <Building className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">State & City</p>
                                <p className="font-bold text-on-surface">{profile.city ? `${profile.city}, ${profile.state}` : 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Pincode</p>
                                <p className="font-bold text-on-surface">{profile.pincode || 'Not provided'}</p>
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
                            <p className="font-black text-on-surface text-sm">{profile.roll_number || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Current Term</p>
                            <p className="font-black text-on-surface text-sm">{profile.current_term || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Social Presence</p>
                        <div className="flex gap-3">
                            {profile.linkedin_url ? (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all shadow-sm">
                                    <div className="font-black text-sm">in</div>
                                </a>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface-variant/30 flex items-center justify-center border border-dashed border-outline-variant/20">
                                    <div className="font-black text-sm">in</div>
                                </div>
                            )}
                            {profile.instagram_url ? (
                                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[#e4405f]/10 text-[#e4405f] flex items-center justify-center hover:bg-[#e4405f] hover:text-white transition-all shadow-sm">
                                    <div className="font-black text-sm">ig</div>
                                </a>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface-variant/30 flex items-center justify-center border border-dashed border-outline-variant/20">
                                    <div className="font-black text-sm">ig</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/15 space-y-6 md:col-span-2">
                    <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                        <Trophy className="w-5 h-5 text-secondary" /> Academic Stats
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center p-6 bg-surface rounded-3xl border border-outline-variant/5">
                            <span className="text-2xl mb-2">🍅</span>
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Tomatoes</p>
                            <p className="text-xl font-black text-on-surface">{profile.tomatoes_balance || 0}</p>
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
                        <div className="flex flex-col items-center p-6 bg-surface rounded-3xl border border-outline-variant/5">
                            <span className="text-2xl mb-2">🛡️</span>
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Access</p>
                            <p className="text-xl font-black text-on-surface">Tier {profile.type}</p>
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
        </div>
    );
}
