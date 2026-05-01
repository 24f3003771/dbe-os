"use server";

import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getRank } from "@/constants/tomato";

// ─── Supabase clients ──────────────────────────────────────────────────────────

async function getUserSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
}

// Service role client — used for system-level operations if available
function getServiceSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) return null;
    return createServiceClient(url, key);
}

async function getAuthUser() {
    const supabase = await getUserSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    return user;
}

// ─── Event Metadata Type ───────────────────────────────────────────────────────

export type TomatoEventPayload = {
    actionType: string;   // e.g. "exam", "practice", "casecomp", "ai_builder"
    description: string;  // e.g. "Attempted MOC1 Practice · Hindi"
    tomatoes: number;
    metadata?: Record<string, unknown>;
};

// ─── Get Farm State ────────────────────────────────────────────────────────────

export async function getFarmState() {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();

        // 1. Get profile data
        const { data: profile } = await supabase
            .from("user_profiles")
            .select("total_tomatoes_earned, tomatoes_balance")
            .eq("id", user.id)
            .maybeSingle();

        // 2. Fetch numerical position from leaderboard view
        const { data: rankData } = await supabase
            .from("leaderboard")
            .select("position")
            .eq("id", user.id)
            .maybeSingle();

        // 3. Calculate Community Total
        const { data: communityData } = await supabase
            .from("user_profiles")
            .select("total_tomatoes_earned");
        
        const communityTotal = communityData?.reduce((acc, curr) => acc + Number(curr.total_tomatoes_earned), 0) ?? 0;

        // 4. Calculate Community Median (Approximate)
        let medianTomatoes = 0;
        if (communityData && communityData.length > 0) {
            const sorted = [...communityData].sort((a, b) => Number(a.total_tomatoes_earned) - Number(b.total_tomatoes_earned));
            const mid = Math.floor(sorted.length / 2);
            medianTomatoes = Number(sorted[mid].total_tomatoes_earned);
        }

        const totalEarned = profile?.total_tomatoes_earned ?? 0;

        return {
            totalTomatoesEarned: Number(totalEarned),
            tomatoesBalance: Number(profile?.tomatoes_balance ?? 0),
            position: rankData?.position ?? 0,
            leaderboardRank: rankData?.position ?? 0,
            medianTomatoes: medianTomatoes,
            communityTotal: communityTotal,
            streak: 0, // Fallback as streak column is not in user_profiles yet
            rank: getRank(Number(totalEarned)),
            plots: [],
        };
    } catch (error) {
        console.error("getFarmState error:", error);
        return {
            totalTomatoesEarned: 0,
            tomatoesBalance: 0,
            leaderboardRank: 0,
            medianTomatoes: 0,
            communityTotal: 0,
            streak: 0,
            rank: "Scholar",
            plots: [],
        };
    }
}

// ─── Record Tomato Event ───────────────────────────────────────────────────────

export async function recordTomatoEvent(payload: TomatoEventPayload) {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();
        
        const displayName = user.user_metadata?.full_name
            || user.email?.split("@")[0]
            || "Scholar";
        const avatarUrl = user.user_metadata?.avatar_url ?? null;

        // 1. Get current stats
        const { data: profile } = await supabase
            .from("user_profiles")
            .select("tomatoes_balance, total_tomatoes_earned")
            .eq("id", user.id)
            .maybeSingle();

        const currentBalance = Number(profile?.tomatoes_balance ?? 0);
        const currentEarned  = Number(profile?.total_tomatoes_earned ?? 0);

        // 2. Update Profile (using explicit check for better RLS reliability)
        if (profile) {
            const { error: updateError } = await supabase
                .from("user_profiles")
                .update({
                    display_name: displayName,
                    avatar_url: avatarUrl,
                    total_tomatoes_earned: currentEarned + payload.tomatoes,
                    tomatoes_balance: currentBalance + payload.tomatoes,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);
            
            if (updateError) {
                console.error("Profile update error:", updateError);
                throw updateError;
            }
        } else {
            const { error: insertError } = await supabase
                .from("user_profiles")
                .insert({
                    id: user.id,
                    display_name: displayName,
                    avatar_url: avatarUrl,
                    total_tomatoes_earned: payload.tomatoes,
                    tomatoes_balance: payload.tomatoes,
                    updated_at: new Date().toISOString(),
                });
            
            if (insertError) {
                console.error("Profile insert error:", insertError);
                throw insertError;
            }
        }

        // 3. Log Event
        const { error: eventError } = await supabase
            .from("tomato_events")
            .insert({
                user_id: user.id,
                action_type: payload.actionType,
                description: payload.description,
                tomatoes: payload.tomatoes,
                metadata: payload.metadata ?? null,
            });

        if (eventError) {
            console.error("Event logging failed:", eventError);
        }

        return { success: true };
    } catch (e) {
        console.error("recordTomatoEvent error:", e);
        return { success: false, error: e };
    }
}

// ─── Get User Tomato History ───────────────────────────────────────────────────

export async function getTomatoHistory(limit = 50) {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();

        const { data, error } = await supabase
            .from("tomato_events")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data ?? [];
    } catch (e) {
        console.error("getTomatoHistory error:", e);
        return [];
    }
}

// ─── Get Top 50 Leaderboard ────────────────────────────────────────────────────

export async function getLeaderboard() {
    try {
        const supabase = await getUserSupabase();

        const { data, error } = await supabase
            .from("leaderboard")
            .select("id, display_name, avatar_url, total_tomatoes_earned, position");

        if (error) throw error;
        return data ?? [];
    } catch (e) {
        console.error("getLeaderboard error:", e);
        return [];
    }
}

// ─── Spend Tomatoes ────────────────────────────────────────────────────────────

export async function spendTomatoesAction(amount: number) {
    try {
        const user = await getAuthUser();
        const supabase = await getUserSupabase();

        const { data: profile } = await supabase
            .from("user_profiles")
            .select("tomatoes_balance")
            .eq("id", user.id)
            .single();

        if (!profile || Number(profile.tomatoes_balance) < amount) return false;

        const { error } = await supabase
            .from("user_profiles")
            .update({ tomatoes_balance: Number(profile.tomatoes_balance) - amount })
            .eq("id", user.id);

        if (error) throw error;
        return true;
    } catch (e) {
        console.error("spendTomatoesAction error:", e);
        return false;
    }
}
