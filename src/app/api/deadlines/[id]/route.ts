import { prisma } from "@/lib/db.server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// PATCH /api/deadlines/:id — toggle complete
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    if (body.action === "toggleComplete") {
        const existing = await prisma.deadline.findUnique({ 
            where: { id, userId } 
        });
        if (!existing) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const deadline = await prisma.deadline.update({
            where: { id, userId },
            data: { completed: !existing.completed },
        });
        return NextResponse.json(deadline);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// DELETE /api/deadlines/:id
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    try {
        await prisma.deadline.delete({ 
            where: { id, userId } 
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }
}
