"use server";

import { prisma } from "@/lib/db.server";
const auth = async () => ({ userId: "temp-user-id" });
const currentUser = async () => ({ id: "temp-user-id" });

// Helper to get or create the authenticated user
async function getAuthUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userRecord = await currentUser();
    const email = userRecord?.emailAddresses[0]?.emailAddress || "pending@iimb.ac.in";
    const name = userRecord?.firstName || "Scholar";

    return await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: email,
            name: name,
            streak: 1,
            tomatoesBalance: 10,
            totalTomatoesEarned: 10,
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
            plots: [] // Return empty array to avoid breaking UI
        };
    } catch (error) {
        console.error("Database connection error in getFarmState:", error);
        return {
            totalTomatoesEarned: 0,
            tomatoesBalance: 0,
            streak: 0,
            plots: [],
            error: "Database unreachable"
        };
    }
}

export async function updateTomatoes(amount: number) {
    try {
        const user = await getAuthUser();
        
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                tomatoesBalance: { increment: amount },
                totalTomatoesEarned: amount > 0 ? { increment: amount } : undefined
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

