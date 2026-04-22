"use server";

import { prisma } from "@/lib/db.server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveExamResult(data: {
    subject: string;
    score: number;
    totalQuestions: number;
    timerPerQuestion: number;
    mistakes: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const result = await prisma.examResult.create({
            data: {
                userId,
                subject: data.subject,
                score: data.score,
                totalQuestions: data.totalQuestions,
                timerPerQuestion: data.timerPerQuestion,
                mistakes: data.mistakes,
            },
        });

        revalidatePath("/quiz");
        return result;
    } catch (error) {
        console.error("Error saving exam result:", error);
        return null;
    }
}

export async function getExamHistory() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        return await prisma.examResult.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching exam history:", error);
        return [];
    }
}

export async function deleteExamResult(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        return await prisma.examResult.delete({
            where: { id, userId },
        });
    } catch (error) {
        console.error("Error deleting exam result:", error);
        throw error;
    }
}
