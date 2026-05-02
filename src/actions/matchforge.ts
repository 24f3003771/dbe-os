"use server";

import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { MatchProfile, MatchListing, ListingType } from "@/types/matchforge";

async function createClient() {
  const cookieStore = await cookies();
  return createSupabaseClient(cookieStore);
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('match_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as MatchProfile;
  } catch (err) {
    console.error("getProfile failed:", err);
    return null;
  }
}

export async function updateProfile(formData: Partial<MatchProfile>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const updateData = {
      id: user.id,
      roles: formData.roles,
      bio: formData.bio,
      skills: formData.skills,
      education: formData.education,
      experience: formData.experience,
      location: formData.location,
      grad_year: formData.grad_year,
      current_term: formData.current_term,
      linkedin_url: formData.linkedin_url,
      whatsapp_number: formData.whatsapp_number,
      is_complete: true,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('match_profiles')
      .upsert(updateData);

    if (error) throw new Error(error.message);
    
    revalidatePath('/matchforge');
    return { success: true };
  } catch (err: any) {
    console.error("updateProfile failed:", err);
    throw new Error(err.message || "Failed to update profile");
  }
}

export async function getMatches() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: myProfile } = await supabase
      .from('match_profiles')
      .select('skills, roles')
      .eq('id', user.id)
      .single();

    if (!myProfile || !myProfile.skills || myProfile.skills.length === 0) return [];

    const { data: others, error } = await supabase
      .from('match_profiles')
      .select('*')
      .neq('id', user.id)
      .eq('is_complete', true);

    if (error) return [];

    const matches = (others || []).map(profile => {
      // Skill match
      const profileSkills = profile.skills || [];
      const mySkills = myProfile.skills || [];
      const sharedSkills = profileSkills.filter((s: string) => mySkills.includes(s));
      const skillScore = (sharedSkills.length / Math.max(mySkills.length, profileSkills.length || 1)) * 100;
      
      // Role match (complementary or same)
      const profileRoles = profile.roles || [];
      const myRoles = myProfile.roles || [];
      const sharedRoles = profileRoles.filter((r: string) => myRoles.includes(r));
      const roleScore = sharedRoles.length > 0 ? 20 : 0;

      return { ...profile, matchScore: Math.round(Math.min(100, skillScore + roleScore)) };
    });

    return matches
      .filter(m => (m.matchScore || 0) > 10)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } catch (err) {
    console.error("getMatches failed:", err);
    return [];
  }
}

export async function getListings(filters: { type?: string; skills?: string[]; roles?: string[] } = {}) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('match_listings')
      .select(`
        *,
        profiles:match_profiles!match_listings_user_id_fkey(*)
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
      console.error("[MatchForge] Database Query Error:", error.message);
      return [];
    }

    let results = data as MatchListing[];
    
    // Filter by roles if provided (client-side since it's a nested filter)
    if (filters.roles && filters.roles.length > 0) {
      results = results.filter(l => 
        l.profiles?.roles?.some(r => filters.roles?.includes(r))
      );
    }

    return results;
  } catch (err) {
    console.error("getListings failed:", err);
    return [];
  }
}

export async function createListing(formData: {
  title: string;
  description: string;
  type: ListingType;
  required_skills: string[];
}) {
  try {
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
    return { success: true, data };
  } catch (err: any) {
    console.error("createListing failed:", err);
    throw new Error(err.message || "Failed to create listing");
  }
}
