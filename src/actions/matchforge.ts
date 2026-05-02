"use server";

import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function createClient() {
  const cookieStore = await cookies();
  return createSupabaseClient(cookieStore);
}

export type ListingType = 'Case Competition' | 'Hackathon' | 'Co-founder' | 'Learning Partner';

export interface MatchProfile {
  id: string;
  role: string;
  bio: string;
  skills: string[];
  linkedin_url?: string;
  whatsapp_number?: string;
  is_complete: boolean;
}

export interface MatchListing {
  id: string;
  user_id: string;
  type: ListingType;
  title: string;
  description: string;
  required_skills: string[];
  status: 'Open' | 'Closed';
  created_at: string;
  profiles?: MatchProfile;
}

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('match_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows'
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as MatchProfile;
}

export async function updateProfile(formData: Partial<MatchProfile>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('match_profiles')
    .upsert({
      id: user.id,
      ...formData,
      is_complete: true,
      updated_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);
  revalidatePath('/matchforge');
  return data;
}

export async function getMatches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // 1. Get current user's skills
  const { data: myProfile } = await supabase
    .from('match_profiles')
    .select('skills')
    .eq('id', user.id)
    .single();

  if (!myProfile || !myProfile.skills || myProfile.skills.length === 0) return [];

  // 2. Get all other profiles
  const { data: others, error } = await supabase
    .from('match_profiles')
    .select('*')
    .neq('id', user.id)
    .eq('is_complete', true);

  if (error) return [];

  // 3. Calculate match score
  const matches = others.map(profile => {
    const sharedSkills = profile.skills.filter((s: string) => myProfile.skills.includes(s));
    const score = (sharedSkills.length / Math.max(myProfile.skills.length, profile.skills.length)) * 100;
    return { ...profile, matchScore: Math.round(score) };
  });

  // 4. Return top matches (> 30%)
  return matches
    .filter(m => m.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function getListings(filters: { type?: string; skills?: string[] } = {}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('match_listings')
    .select(`
      *,
      profiles:user_id (*)
    `)
    .order('created_at', { ascending: false });

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }

  if (filters.skills && filters.skills.length > 0) {
    query = query.contains('required_skills', filters.skills);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[MatchForge] Database Query Error:", error.message, error.details);
    return [];
  }

  return data as MatchListing[];
}

export async function createListing(formData: {
  title: string;
  description: string;
  type: ListingType;
  required_skills: string[];
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to create a listing");
  }

  const { data, error } = await supabase
    .from('match_listings')
    .insert([
      {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        required_skills: formData.required_skills,
        status: 'Open'
      }
    ]);

  if (error) {
    console.error("Error creating listing:", error);
    throw new Error(error.message);
  }

  revalidatePath('/matchforge');
  return data;
}
