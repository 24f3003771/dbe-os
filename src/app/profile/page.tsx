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
        <ProfileClient profile={profile} availableBatches={availableBatches} />
    );
}
