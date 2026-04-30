"use server";

import { prisma } from "@/lib/db.server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { RANKS, getRank } from "@/constants/tomato";

// Helper to get or create the authenticated user from Supabase
async function getAuthUser() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) throw new Error("Unauthorized");

    const email = authUser.email || "scholar@dbeos.in";
    const name = authUser.user_metadata?.full_name || "Scholar";

    return await prisma.user.upsert({
        where: { id: authUser.id },
        update: {},
        create: {
            id: authUser.id,
            email: email,
            name: name,
            streak: 0,
            tomatoesBalance: 0,
            totalTomatoesEarned: 0,
        },
    });
}

export async function getFarmState() {
    try {
        const user = await getAuthUser();
        
        return {
            totalTomatoesEarned: user.totalTomatoesEarned,
            tomatoesBalance: user.tomatoesBalance,
            streak: user.streak,
            rank: getRank(user.totalTomatoesEarned),
            plots: [] 
        };
    } catch (error) {
        console.error("Database connection error in getFarmState:", error);
        return {
            totalTomatoesEarned: 0,
            tomatoesBalance: 0,
            streak: 0,
            rank: "Guest",
            plots: [],
            error: "Authentication required"
        };
    }
}

export async function updateTomatoes(amount: number) {
    try {
        const user = await getAuthUser();
        
        // Streak Logic
        let newStreak = user.streak;
        const now = new Date();
        const lastDate = user.lastTomatoDate;

        if (!lastDate) {
            newStreak = 1;
        } else {
            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day!
                newStreak += 1;
            } else if (diffDays > 1) {
                // Missed a day, reset
                newStreak = 1;
            }
            // If diffDays === 0, it's the same day, keep streak as is
        }
        
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                tomatoesBalance: { increment: amount },
                totalTomatoesEarned: amount > 0 ? { increment: amount } : undefined,
                streak: newStreak,
                lastTomatoDate: now
            }
        });

        return updatedUser.tomatoesBalance;
    } catch (e) {
        console.error("Database error in updateTomatoes:", e);
        return 0;
    }
}

export async function spendTomatoesAction(amount: number) {
    try {
        const user = await getAuthUser();
        if (user.tomatoesBalance < amount) return false;
        
        await prisma.user.update({
            where: { id: user.id },
            data: { tomatoesBalance: { decrement: amount } }
        });
        return true;
    } catch (e) {
        console.error("Database error in spendTomatoesAction:", e);
        return false;
    }
}

