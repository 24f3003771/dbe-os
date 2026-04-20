import { prisma } from "@/lib/db.server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/deadlines — list all deadlines for the authenticated user
export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deadlines = await prisma.deadline.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(deadlines);
}

// POST /api/deadlines — create a new deadline for the authenticated user
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, subject, type, dueDate } = body;

    if (!title || !subject || !dueDate) {
        return NextResponse.json(
            { error: "Title, subject, and dueDate are required" },
            { status: 400 }
        );
    }

    const deadline = await prisma.deadline.create({
        data: {
            userId,
            title,
            subject,
            type: type || "assignment",
            dueDate: new Date(dueDate),
        },
    });

    return NextResponse.json(deadline, { status: 201 });
}
