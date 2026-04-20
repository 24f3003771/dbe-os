"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLeaderboardData() {
    const users = await prisma.user.findMany({
        orderBy: {
            totalTomatoesEarned: 'desc'
        },
        take: 10,
        select: {
            id: true,
            name: true,
            totalTomatoesEarned: true,
            streak: true,
        }
    });

    return users.map((u, index) => ({
        ...u,
        rank: index + 1
    }));
}
