import { NextRequest, NextResponse } from "next/server";
import { enhanceBulletPoints } from "@/lib/ai/resume-ai";

export async function POST(req: NextRequest) {
  try {
    const { highlights, jobDescription } = await req.json();

    if (!highlights || !Array.isArray(highlights)) {
      return NextResponse.json({ error: "Invalid highlights provided" }, { status: 400 });
    }

    const enhanced = await enhanceBulletPoints(highlights, jobDescription);
    return NextResponse.json({ enhanced });
  } catch (error: any) {
    console.error("API Error (enhance-bullets):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
