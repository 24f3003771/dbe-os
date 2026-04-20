"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOpportunities(filters: { type?: string, domain?: string, difficulty?: string } = {}) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.domain) where.domain = filters.domain;
    if (filters.difficulty) where.difficulty = filters.difficulty;

    return await prisma.opportunity.findMany({
        where,
        orderBy: { deadline: 'asc' },
        include: { stages: true }
    });
}

export async function getOpportunityById(id: string) {
    return await prisma.opportunity.findUnique({
        where: { id },
        include: {
            stages: { orderBy: { stepNumber: 'asc' } },
            guide: true,
            submissions: true
        }
    });
}

export async function getWinningRepository() {
    return await prisma.winnerSubmission.findMany({
        include: { opportunity: true }
    });
}
