import { NextResponse } from "next/server";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MODEL_NAME = "meta/llama-3.1-405b-instruct";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "NVIDIA API Key not configured" }, { status: 500 });
        }

        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        role: "system",
                        content: `You are the official IIMB DBE Programme Assistant. 
                        Your primary goal is to resolve student doubts regarding the Digital Business and Entrepreneurship programme. 
                        
                        Grounded Knowledge:
                        - Programme: IIMB BBA DBE (Digital Business and Entrepreneurship).
                        - Term 2: Feb 2026 - May 2026.
                        - Courses: SE21x, DS21x, PJ21x, ID22x, FA31x, ES21x, AE21x, ID21x.
                        - Module Release: Fridays at 12:00 PM.
                        - Grading: 40% Continuous Assessment, 60% Final In-centre Exam.
                        - Passing: 40% overall.
                        - Exams: Mandatory In-centre proctored exams for each term.
                        
                        Behavioral Rules:
                        - Be professional, encouraging, and clear.
                        - If a student asks something NOT in the manuals or beyond your absolute knowledge, advise them to check the official programme email or visit the dashboard.
                        - Use short, impactful bullet points for complicated rules.
                        - Keep responses concise and academic.`,
                    },
                    ...messages,
                ],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return NextResponse.json({ text: data.choices[0].message.content });
        } else {
            console.error("NVIDIA Response Error:", data);
            return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
