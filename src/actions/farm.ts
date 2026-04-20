"use server";

import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

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
    const user = await getAuthUser();
    
    return {
        totalTomatoesEarned: user.totalTomatoesEarned,
        tomatoesBalance: user.tomatoesBalance,
        streak: user.streak,
        plots: [] // Return empty array to avoid breaking UI
    };
}

export async function updateTomatoes(amount: number) {
    const user = await getAuthUser();
    
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            tomatoesBalance: { increment: amount },
            totalTomatoesEarned: amount > 0 ? { increment: amount } : undefined
        }
    });

    return updatedUser.tomatoesBalance;
}

export async function spendTomatoesAction(amount: number) {
    const user = await getAuthUser();
    if (user.tomatoesBalance < amount) return false;
    
    await prisma.user.update({
        where: { id: user.id },
        data: { tomatoesBalance: { decrement: amount } }
    });
    return true;
}

