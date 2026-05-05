/**
 * AI Service for Resume Enhancement and Job Matching
 * Uses NVIDIA GLM-5.1 for fast and accurate processing.
 */

const apiKey = process.env.NVIDIA_API_KEY;
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function fetchAi(prompt: string) {
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set.");
  }

  console.log("[AI Request] Sending prompt to NVIDIA NIM...");
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.text();
      console.error("[AI Error] Response not OK:", err);
      throw new Error(`AI API Error: ${err}`);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content?.trim();
    console.log("[AI Response] Received content successfully.");
    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("AI request timed out. The model took too long to respond.");
    }
    throw error;
  }
}

/**
 * Rewrites a list of bullet points to be more action-oriented and metric-driven.
 */
export async function enhanceBulletPoints(highlights: string[], jobDescription?: string): Promise<string[]> {
  const prompt = `You are an expert resume writer. Rewrite the following resume bullet points to be high-impact, action-oriented, and metric-driven (if possible).
Keep the original meaning but make them sound more professional and ATS-friendly.
${jobDescription ? `\nVERY IMPORTANT: Tailor these bullets specifically to align with this Job Description: "${jobDescription}".\nUse keywords and phrasing from the job description to ensure high ATS compatibility while maintaining truthfulness.` : ''}

Bullet Points:
${highlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Respond ONLY with a JSON array of strings:
["Improved version 1", "Improved version 2", ...]`;

  const result = await fetchAi(prompt);
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("AI Parse Error (Enhance):", result);
    return highlights; // Fallback to original
  }
}

/**
 * Compares a resume against a job description and provides a match score + missing keywords.
 */
export async function matchWithJobDescription(resumeText: string, jobDescription: string) {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Compare the following Resume against the Job Description.
  
JOB DESCRIPTION:
"${jobDescription}"

RESUME:
"${resumeText}"

Analyze:
1. Match Score (0-100)
2. Missing Keywords/Skills
3. Tailoring Suggestions (3 bullet points)

Respond ONLY with a valid JSON object:
{
  "score": 85,
  "missingKeywords": ["React Native", "PostgreSQL", "System Design"],
  "suggestions": ["Add a metric to your project about user growth", "Highlight experience with cloud-native architectures", "Mention specific tools used in the data pipeline"]
}`;

  const result = await fetchAi(prompt);
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found");
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("AI Parse Error (Match):", result);
    return { score: 0, missingKeywords: [], suggestions: ["AI analysis failed. Please try again."] };
  }
}
