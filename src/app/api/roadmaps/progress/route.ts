import { prisma } from "@/lib/db.server";
import { NextRequest, NextResponse } from "next/server";

// Mock auth matching other routes
const auth = async () => ({ userId: "temp-user-id" });

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
        return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    try {
        const userRoadmap = await prisma.userRoadmap.findUnique({
            where: {
                userId_roadmapId: {
                    userId,
                    roadmapId
                }
            },
            include: {
                completedTopics: true
            }
        });

        if (!userRoadmap) {
            return NextResponse.json({ started: false, completedTopics: [] });
        }

        return NextResponse.json({
            started: true,
            status: userRoadmap.status,
            completedTopics: userRoadmap.completedTopics.map(t => t.topicLabel)
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { roadmapId } = body;

    if (!roadmapId) {
        return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    try {
        const userRoadmap = await prisma.userRoadmap.upsert({
            where: {
                userId_roadmapId: {
                    userId,
                    roadmapId
                }
            },
            update: {},
            create: {
                userId,
                roadmapId,
                status: "IN_PROGRESS"
            }
        });

        return NextResponse.json({ started: true, userRoadmap }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
