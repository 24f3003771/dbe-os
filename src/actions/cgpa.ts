"use server";

import { getAuthUser, getUserSupabase } from "./farm";

/**
 * Fetches the CGPA marks data for the current authenticated user.
 */
export async function getCGPADataAction() {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();

        const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("cgpa_data")
            .eq("id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Error fetching CGPA data:", error);
            return {};
        }

        return profile?.cgpa_data || {};
    } catch (error) {
        console.error("getCGPADataAction error:", error);
        return {};
    }
}

/**
 * Saves the CGPA marks data for the current authenticated user.
 */
export async function saveCGPADataAction(grades: Record<number, Record<string, number>>) {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();

        const { error } = await supabase
            .from("user_profiles")
            .update({ 
                cgpa_data: grades,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id);

        if (error) {
            console.error("Error saving CGPA data:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        console.error("saveCGPADataAction error:", error);
        return { success: false, error: error.message };
    }
}
