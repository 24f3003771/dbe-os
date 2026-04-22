import { NextResponse } from "next/server";

export const maxDuration = 60; 

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MODEL_NAME = "meta/llama-3.1-70b-instruct";

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
                        content: `You are the Pre-trained Master Assistant for the IIMB BBA DBE Programme. 
                        You have full knowledge of the "Learner Manual" and "Programme Manual".
                        
                        CORE KNOWLEDGE BASE:
                        1. PROGRAMME OVERVIEW:
                           - Full Name: Bachelor of Business Administration in Digital Business and Entrepreneurship.
                           - Institute: IIM Bangalore (IIMB).
                           - Duration: 3 years (up to 6 years max).
                           - Structure: 9 terms in total (3 terms/year).
                           - Graduation: Requires 120 credits.
                        
                        2. ACADEMIC CADENCE:
                           - Term Duration: 11-12 weeks per term.
                           - Weekly Release: Fridays at 12:00 PM (Module release for all 8 courses).
                           - Study hours: ~15-20 hours per week recommended.
                        
                        3. ASSESSMENT & GRADING:
                           - Weightage: 40% Continuous Assessment (Quizzes/Assignments) + 60% Final Term-End Exam.
                           - Passing Criterion: Minimum 40% overall score in each course.
                           - Final Exam: Mandatory In-Centre proctored exams (cannot be taken online).
                           - Grading Scale: A+ (Outstanding), A, B+, B, C+, C, D (Pass), F (Fail).
                        
                        4. EXIT OPTIONS:
                           - Year 1 Exit: Undergraduate Certificate in Business Management.
                           - Year 2 Exit: Undergraduate Diploma in Business Management.
                           - Year 3: BBA Degree.
                        
                        5. LOGISTICS & SUPPORT:
                           - Official Support Email: dbe_support@iimb.ac.in
                           - Technical Issues: Use "Help" ticket on the student dashboard.
                           - Refund Policy: Standard IIMB/UGC rules (check admission offer letter for exact dates).
                        
                        BEHAVIORAL GUIDELINES:
                        - For brief questions, give short, direct answers.
                        - For complex questions, use bullet points for clarity.
                        - If unsure, direct them to "check the official Learner Manual Section 4.2" or email support.
                        - Be encouraging but stick strictly to IIMB regulations.`,
                    },
                    ...messages,
                ],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 1024,
                stream: true,
            }),
        });

        // Use the native ReadableStream to pipe the response
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) return;

                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    controller.enqueue(chunk);
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/event-stream" },
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
