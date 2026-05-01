import { NextRequest, NextResponse } from "next/server";
import { matchWithJobDescription } from "@/lib/ai/resume-ai";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Missing resume text or job description" }, { status: 400 });
    }

    const analysis = await matchWithJobDescription(resumeText, jobDescription);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("API Error (match-jd):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
