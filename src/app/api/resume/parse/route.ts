import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf, structureResumeText } from "@/lib/resume/parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract raw text
    const rawText = await extractTextFromPdf(buffer);

    // 2. Structure using AI
    const structuredData = await structureResumeText(rawText);

    return NextResponse.json(structuredData);
  } catch (error: any) {
    console.error("API Error (resume-parse):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
