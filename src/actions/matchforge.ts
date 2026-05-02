"use server";

import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function createClient() {
  const cookieStore = await cookies();
  return createSupabaseClient(cookieStore);
}

export type ListingType = 'Case Competition' | 'Hackathon' | 'Co-founder' | 'Learning Partner';

export interface MatchListing {
  id: string;
  user_id: string;
  type: ListingType;
  title: string;
  description: string;
  required_skills: string[];
  status: 'Open' | 'Closed';
  created_at: string;
  profiles?: {
    role: string;
    bio: string;
  };
}

export async function getListings(filters: { type?: string; skills?: string[] } = {}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('match_listings')
    .select(`
      *,
      profiles:user_id (
        role,
        bio
      )
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
    // Return empty array instead of crashing
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
