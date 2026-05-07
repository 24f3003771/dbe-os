"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    batch?: string;
    name?: string;
    phone?: string;
    city?: string;
    state?: string;
    pincode?: string;
}) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { success: false, error: "Not authenticated" };
    }

    // Update public.users table if it exists
    const { error: dbError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

    // Also update Auth metadata to keep it in sync
    const { error: authError } = await supabase.auth.updateUser({
        data: {
            ...data,
            full_name: data.name || user.user_metadata?.full_name,
        }
    });

    if (dbError && authError) {
        return { success: false, error: dbError.message || authError.message };
    }

    revalidatePath("/profile");
    return { success: true };
}
