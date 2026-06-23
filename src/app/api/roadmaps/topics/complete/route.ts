import { prisma } from "@/lib/db.server";
import { NextRequest, NextResponse } from "next/server";

const auth = async () => ({ userId: "temp-user-id" });

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { roadmapId, topicLabel, completed } = body;

    if (!roadmapId || !topicLabel || completed === undefined) {
        return NextResponse.json({ error: "roadmapId, topicLabel, and completed are required" }, { status: 400 });
    }

    try {
        const userRoadmap = await prisma.userRoadmap.findUnique({
            where: {
                userId_roadmapId: {
                    userId,
                    roadmapId
                }
            }
        });

        if (!userRoadmap) {
            return NextResponse.json({ error: "Roadmap not started" }, { status: 400 });
        }

        if (completed) {
            // Add completed topic
            await prisma.completedTopic.upsert({
                where: {
                    userRoadmapId_topicLabel: {
                        userRoadmapId: userRoadmap.id,
                        topicLabel
                    }
                },
                update: {},
                create: {
                    userRoadmapId: userRoadmap.id,
                    topicLabel
                }
            });
        } else {
            // Remove completed topic
            await prisma.completedTopic.deleteMany({
                where: {
                    userRoadmapId: userRoadmap.id,
                    topicLabel
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
