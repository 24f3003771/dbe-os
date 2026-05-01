import { Resume } from "@/types/resume";

// Polyfill for DOMMatrix which is required by pdf-parse's internal pdf.js dependency in Node environment
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
    static fromFloat32Array() { return new DOMMatrix(); }
    static fromFloat64Array() { return new DOMMatrix(); }
  };
}

const apiKey = process.env.NVIDIA_API_KEY;
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Extracts raw text from a PDF buffer.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Directly require the lib file to avoid module wrapping issues in Turbopack
    const pdf = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdf(buffer);
    return data.text;
  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    throw new Error(`PDF Extraction failed: ${error.message || "Unknown error"}.`);
  }
}

/**
 * Uses AI to structure raw resume text into the unified Resume JSON schema.
 */
export async function structureResumeText(text: string): Promise<Resume> {
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set. Please add it to your environment variables.");
  }

  const prompt = `You are a world-class resume parser. Extract the information from the following raw text and structure it into a valid JSON object matching the provided schema.

RAW TEXT:
"${text}"

SCHEMA:
{
  "basics": { "name": "", "label": "", "email": "", "phone": "", "url": "", "summary": "", "location": { "city": "", "countryCode": "", "region": "" }, "profiles": [] },
  "work": [{ "name": "", "position": "", "startDate": "", "endDate": "", "summary": "", "highlights": [] }],
  "education": [{ "institution": "", "area": "", "studyType": "", "startDate": "", "endDate": "", "score": "", "details": "" }],
  "awards": [{ "summary": "" }],
  "volunteer": [{ "organization": "", "position": "", "startDate": "", "highlights": [] }],
  "skills": [{ "name": "", "keywords": [] }],
  "projects": [{ "name": "", "description": "", "highlights": [] }],
  "meta": { "version": "1.1.0", "lastModified": "${new Date().toISOString()}" }
}

RULES:
- Respond ONLY with a valid JSON object.
- "awards" should contain key achievements, honors, and competition wins.
- "volunteer" should contain Positions of Responsibility (POR).
- "education.details" should contain specializations or focus areas.
- "skills.name" is the category (e.g., "Data Analytics"), and "keywords" are the specific tools.
- If information is missing, leave the field as an empty string or empty array.
- Standardize dates to YYYY-MM-DD or Month YYYY where possible.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for parsing

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "z-ai/glm-5.1",
        messages: [{ role: "user", content: prompt }],
        temperature: 0, 
        max_tokens: 3000,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI API Error: ${err}`);
    }

    const json = await response.json();
    const result = json.choices?.[0]?.message?.content?.trim();

    // Clean up markdown blocks if LLM adds them
    const cleanedResult = result.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    try {
      return JSON.parse(cleanedResult);
    } catch (e) {
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("AI returned invalid JSON.");
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("AI Parse Error:", error);
    if (error.name === 'AbortError') {
      throw new Error("AI parsing timed out. The resume might be too long or the service is slow.");
    }
    throw new Error(error.message || "Failed to structure resume data.");
  }
}
