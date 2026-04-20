"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

async function ensureUser(userId: string) {
    // Basic upsert to ensure the user exists in our local DB
    // In a production app, this would ideally be handled by a Clerk Webhook
    return await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: "pending@iimb.ac.in", // Placeholder until first real login sync
            name: "Student",
        },
    });
}

export async function getTodosAction(dateStr: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    await ensureUser(userId);

    const todos = await prisma.todo.findMany({
        where: { 
            date: dateStr,
            userId: userId 
        },
        orderBy: { time: 'asc' }
    });
    
    return todos;
}

export async function addTodoAction(data: {
    title: string;
    subject: string;
    time: string;
    date: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await ensureUser(userId);

    const newTodo = await prisma.todo.create({
        data: {
            userId: userId,
            title: data.title,
            subject: data.subject,
            time: data.time,
            date: data.date,
            completed: false
        }
    });

    return newTodo;
}

export async function toggleTodoAction(id: string, completed: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.todo.update({
        where: { id, userId }, // Ensure user owns the todo
        data: { completed }
    });
}

export async function deleteTodoAction(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.todo.delete({
        where: { id, userId } // Ensure user owns the todo
    });
}
