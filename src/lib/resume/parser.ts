import pdf from "pdf-parse";
import { Resume } from "@/types/resume";

const apiKey = process.env.NVIDIA_API_KEY;
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Extracts raw text from a PDF buffer.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Uses AI to structure raw resume text into the unified Resume JSON schema.
 */
export async function structureResumeText(text: string): Promise<Resume> {
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set.");
  }

  const prompt = `You are a world-class resume parser. Extract the information from the following raw text and structure it into a valid JSON object matching the provided schema.

RAW TEXT:
"${text}"

SCHEMA:
{
  "basics": { "name": "", "label": "", "email": "", "phone": "", "url": "", "summary": "", "location": { "city": "", "countryCode": "", "region": "" }, "profiles": [] },
  "work": [{ "name": "", "position": "", "startDate": "", "endDate": "", "summary": "", "highlights": [] }],
  "education": [{ "institution": "", "area": "", "studyType": "", "startDate": "", "endDate": "", "score": "" }],
  "skills": [{ "name": "", "level": "", "keywords": [] }],
  "projects": [{ "name": "", "description": "", "highlights": [] }],
  "languages": [{ "language": "", "fluency": "" }],
  "interests": [{ "name": "", "keywords": [] }],
  "meta": { "version": "1.0.0", "lastModified": "${new Date().toISOString()}" }
}

RULES:
- Respond ONLY with a valid JSON object.
- If information is missing, leave the field as an empty string or empty array.
- Standardize dates to YYYY-MM-DD where possible.
- Extract bullet points as "highlights".`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "z-ai/glm-5.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // Strict parsing
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI Parsing Error: ${err}`);
  }

  const json = await response.json();
  const result = json.choices?.[0]?.message?.content?.trim();

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found");
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("AI Parse Error (Structure):", result);
    throw new Error("Failed to structure resume data.");
  }
}
