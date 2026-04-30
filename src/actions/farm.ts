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

// Service role client — bypasses RLS for atomic upserts
function getServiceSupabase() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
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

        const { data: profile } = await supabase
            .from("user_profiles")
            .select("total_tomatoes_earned, tomatoes_balance")
            .eq("id", user.id)
            .single();

        // Fetch numerical position from leaderboard view
        const { data: rankData } = await supabase
            .from("leaderboard")
            .select("position")
            .eq("id", user.id)
            .maybeSingle();

        const totalEarned = profile?.total_tomatoes_earned ?? 0;

        return {
            totalTomatoesEarned: totalEarned,
            tomatoesBalance: profile?.tomatoes_balance ?? 0,
            position: rankData?.position ?? 0,
            leaderboardRank: rankData?.position ?? 0,
            medianTomatoes: 0, // Placeholder, requires Supabase equivalent view
            rank: getRank(totalEarned),
            plots: [],
        };
    } catch (error) {
        console.error("getFarmState error:", error);
        return {
            totalTomatoesEarned: 0,
            tomatoesBalance: 0,
            streak: 0,
            rank: "Tomato Seedling",
            plots: [],
        };
    }
}

// ─── Record Tomato Event ───────────────────────────────────────────────────────
// This is the SINGLE source of truth for all tomato earning.
// 1. Inserts a tomato_events row (full audit log)
// 2. Upserts user_profiles (increments running totals + updates streak)

export async function recordTomatoEvent(payload: TomatoEventPayload) {
    try {
        const user = await getAuthUser();
        const db = getServiceSupabase(); // service role for atomic upserts

        const displayName = user.user_metadata?.full_name
            || user.email?.split("@")[0]
            || "Scholar";
        const avatarUrl = user.user_metadata?.avatar_url ?? null;

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // ── 1. Get current profile ──────────────────
        const { data: existingProfile } = await db
            .from("user_profiles")
            .select("tomatoes_balance, total_tomatoes_earned")
            .eq("id", user.id)
            .single();

        // ── 2. Upsert user_profiles ───────────────────────────────────────────
        const currentBalance = existingProfile?.tomatoes_balance ?? 0;
        const currentEarned  = existingProfile?.total_tomatoes_earned ?? 0;

        const { error: profileError } = await db
            .from("user_profiles")
            .upsert({
                id: user.id,
                display_name: displayName,
                avatar_url: avatarUrl,
                total_tomatoes_earned: currentEarned + payload.tomatoes,
                tomatoes_balance: currentBalance + payload.tomatoes,
                updated_at: new Date().toISOString(),
            }, { onConflict: "id" });

        if (profileError) console.error("Profile upsert error:", profileError);

        // ── 3. Insert tomato event (audit log) ────────────────────────────────
        const { error: eventError } = await db
            .from("tomato_events")
            .insert({
                user_id: user.id,
                action_type: payload.actionType,
                description: payload.description,
                tomatoes: payload.tomatoes,
                metadata: payload.metadata ?? null,
            });

        if (eventError) console.error("Tomato event insert error:", eventError);

        return { success: true };
    } catch (e) {
        console.error("recordTomatoEvent error:", e);
        return { success: false };
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
            .from("leaderboard")  // the view we created in the migration
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
        const db = getServiceSupabase();

        const { data: profile } = await db
            .from("user_profiles")
            .select("tomatoes_balance")
            .eq("id", user.id)
            .single();

        if (!profile || profile.tomatoes_balance < amount) return false;

        const { error } = await db
            .from("user_profiles")
            .update({ tomatoes_balance: profile.tomatoes_balance - amount })
            .eq("id", user.id);

        if (error) throw error;
        return true;
    } catch (e) {
        console.error("spendTomatoesAction error:", e);
        return false;
    }
}
