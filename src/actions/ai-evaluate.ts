"use server";

/**
 * AI Evaluation for text-based exam questions.
 *
 * Sends the student's written answer and the model explanation to NVIDIA GLM-5.1.
 * Returns a percentage score (0–100) and one-line feedback.
 * Fast Mode: reasoning/thinking is disabled for ~4s response time.
 *
 * No negative marking — minimum score is always 0.
 */

export type AiEvalResult = {
    percentage: number;   // 0–100
    feedback: string;     // brief one-line feedback from AI
};

export async function evaluateTextAnswer(data: {
    question: string;
    userAnswer: string;
    modelAnswer: string;
}): Promise<AiEvalResult> {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        console.error("[AI Eval] NVIDIA_API_KEY is not set.");
        return { percentage: 0, feedback: "AI evaluation unavailable (no API key)." };
    }

    if (!data.userAnswer?.trim()) {
        return { percentage: 0, feedback: "No answer provided." };
    }

    const prompt = `You are a strict but fair academic evaluator for a business school exam.

Question: "${data.question}"

Model Answer / Key Concepts: "${data.modelAnswer}"

Student's Answer: "${data.userAnswer}"

Evaluate how well the student's answer covers the key concepts in the model answer.
Rules:
- Score 0–100 based on concept coverage and accuracy
- No negative marking (minimum is 0)
- Do NOT penalize for writing style or grammar
- Do NOT penalize for extra details
- Penalize for missing key concepts or factually wrong statements
- Be academic and concise

Respond ONLY with a valid JSON object. No markdown, no explanation outside JSON:
{"percentage": 75, "feedback": "Covers equity well but misses bootstrapping trade-offs."}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: "z-ai/glm-5.1",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.1,
                    top_p: 1,
                    max_tokens: 512, // Sufficient for JSON response
                    extra_body: {
                        chat_template_kwargs: {
                            enable_thinking: false, // FAST MODE: Disable reasoning for speed
                            clear_thinking: true
                        }
                    }
                }),
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const err = await response.text();
            console.error("[AI Eval] NVIDIA API error:", err);
            return { percentage: 0, feedback: "AI evaluation failed (API error)." };
        }

        const json = await response.json();
        const rawText = json.choices?.[0]?.message?.content?.trim();

        if (!rawText) {
            console.error("[AI Eval] Empty response from NVIDIA.");
            return { percentage: 0, feedback: "AI evaluation failed (empty response)." };
        }

        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("[AI Eval] No JSON block found:", rawText);
                return { percentage: 0, feedback: "AI evaluation failed (invalid format)." };
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return { 
                percentage: Math.min(100, Math.max(0, Number(parsed.percentage) || 0)), 
                feedback: String(parsed.feedback || "Evaluated.") 
            };
        } catch (parseError) {
            console.error("[AI Eval] Parse error:", rawText);
            return { percentage: 0, feedback: "AI evaluation failed (parse error)." };
        }
    } catch (e: any) {
        if (e.name === 'AbortError') {
            console.error("[AI Eval] Request timed out after 15s");
            return { percentage: 0, feedback: "AI evaluation timed out." };
        }
        console.error("[AI Eval] Unexpected error:", e);
        return { percentage: 0, feedback: "AI evaluation failed (unexpected error)." };
    }
}
