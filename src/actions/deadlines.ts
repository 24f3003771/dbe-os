"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

async function ensureUser(userId: string) {
    return await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: "pending@iimb.ac.in",
            name: "Student",
        },
    });
}

export async function getDeadlinesAction() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await ensureUser(userId);

    const deadlines = await prisma.deadline.findMany({
        where: { userId },
        orderBy: { dueDate: 'asc' }
    });
    
    return deadlines.map(d => ({
        id: d.id,
        title: d.title,
        subject: d.subject,
        type: d.type as any,
        priority: d.priority as any,
        dueDate: d.dueDate.toISOString(),
        completed: d.completed
    }));
}

export async function addDeadlineAction(data: {
    title: string;
    subject: string;
    type: string;
    priority: string;
    dueDate: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await ensureUser(userId);

    const newDeadline = await prisma.deadline.create({
        data: {
            userId,
            title: data.title,
            subject: data.subject,
            type: data.type,
            priority: data.priority,
            dueDate: new Date(data.dueDate),
            completed: false
        }
    });

    return {
        ...newDeadline,
        dueDate: newDeadline.dueDate.toISOString()
    };
}

export async function toggleDeadlineAction(id: string, completed: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.deadline.update({
        where: { id, userId },
        data: { completed }
    });
}

export async function deleteDeadlineAction(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.deadline.delete({
        where: { id, userId }
    });
}
