import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User as UserIcon, Mail, MapPin, Building, Phone, GraduationCap, Compass, Trophy, Star, Shield } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

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
        type: 1,
        role: 'USER',
    };

    const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MS';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
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
                        <Trophy className="w-5 h-5 text-secondary" /> Account Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-lg">🍅</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tomatoes</p>
                                <p className="font-bold text-on-surface">0</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Access Tier</p>
                                <p className="font-bold text-on-surface">Tier {profile.type}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6 space-y-3">
                        <Link href="/" className="block">
                            <button className="w-full py-3 bg-surface border border-outline-variant/20 rounded-xl font-black text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
                                Return to Dashboard
                            </button>
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button type="submit" className="w-full py-3 bg-error/5 border border-error/20 rounded-xl font-black text-sm text-error hover:bg-error/10 transition-all flex items-center justify-center gap-2">
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
