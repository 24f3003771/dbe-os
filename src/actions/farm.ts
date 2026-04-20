"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_USER_EMAIL = "scholar@dbe-os.com";

// Helper to get or create the default user (mocking auth)
async function getDefaultUser() {
    let user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: DEFAULT_USER_EMAIL,
                name: "Scholar",
                streak: 1,
                tomatoesBalance: 10,
                totalTomatoesEarned: 10,
            }
        });
    }
    return user;
}

export async function getFarmState() {
    const user = await getDefaultUser();
    
    return {
        totalTomatoesEarned: user.totalTomatoesEarned,
        tomatoesBalance: user.tomatoesBalance,
        streak: user.streak,
        plots: [] // Return empty array to avoid breaking UI that expects it
    };
}

export async function updateTomatoes(amount: number) {
    const user = await getDefaultUser();
    
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
    const user = await getDefaultUser();
    if (user.tomatoesBalance < amount) return false;
    
    await prisma.user.update({
        where: { id: user.id },
        data: { tomatoesBalance: { decrement: amount } }
    });
    return true;
}

