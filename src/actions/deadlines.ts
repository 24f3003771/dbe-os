"use server";

import { prisma } from "@/lib/db.server";
import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getAuth() {
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function ensureUser(userId: string, email: string, name: string) {
    return await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: email,
            name: name,
        },
    });
}

export async function getDeadlinesAction() {
    const user = await getAuth();
    if (!user) throw new Error("Unauthorized");

    await ensureUser(user.id, user.email || "pending@iimb.ac.in", user.user_metadata?.full_name || "Student");

    const deadlines = await prisma.deadline.findMany({
        where: { userId: user.id },
        orderBy: { dueDate: 'asc' }
    });
    
    return deadlines.map((d: any) => ({
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
    const user = await getAuth();
    if (!user) throw new Error("Unauthorized");

    await ensureUser(user.id, user.email || "pending@iimb.ac.in", user.user_metadata?.full_name || "Student");

    const newDeadline = await prisma.deadline.create({
        data: {
            userId: user.id,
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
    const user = await getAuth();
    if (!user) throw new Error("Unauthorized");

    await prisma.deadline.update({
        where: { id, userId: user.id },
        data: { completed }
    });
}

export async function deleteDeadlineAction(id: string) {
    const user = await getAuth();
    if (!user) throw new Error("Unauthorized");

    await prisma.deadline.delete({
        where: { id, userId: user.id }
    });
}
