"use client";

import { useState, useRef, useEffect } from "react";
import { 
    MessageCircle, 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    Search, 
    BookOpen, 
    HelpCircle, 
    ChevronRight, 
    Info, 
    GraduationCap,
    School,
    ShieldCheck,
    ScrollText,
    Zap
} from "lucide-react";

// Programme Data Curated from Learner/Programme Manuals
const KNOWLEDGE_BASE = [
    {
        category: "Academic Structure",
        icon: School,
        pointers: [
            "Digital Business & Entrepreneurship (DBE) is a undergraduate level programme by IIMB.",
            "Term-based structure with 8 courses per term (Standard).",
            "Credits range from 1.5 to 3.0 per course based on difficulty and hours.",
            "Course content is released weekly on Fridays at 12:00 PM."
        ]
    },
    {
        category: "Assessment & Grading",
        icon: ScrollText,
        pointers: [
            "Weightage: 40% Continuous Assessment (Quizzes/Assignments) + 60% Final Exam.",
            "In-Centre Proctored Exams: Mandatory for final assessment.",
            "Passing Criterion: Minimum 40% overall and 35% in the final exam (Tentative).",
            "Continuous Assessment: Weekly quizzes must be completed before the next module release."
        ]
    },
    {
        category: "Student Conduct",
        icon: ShieldCheck,
        pointers: [
            "Academic Integrity: Zero tolerance for plagiarism in assignments.",
            "Attendance: Monitored via platform engagement and video viewing metrics.",
            "Exam Conduct: Proctored environment; ID proof mandatory.",
            "Communication: Official announcements only via programme dashboard/email."
        ]
    }
];

const FAQS = [
    "What is the passing criteria?",
    "When is the Term-2 final exam?",
    "How to access course recordings?",
    "Is the final exam online or offline?"
];

export default function DoubtsPage() {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I am your DBE Programme Assistant. I've been trained on the latest Learner and Programme Manuals. Ask me anything regarding your course structure, grading, or regulations!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulated Local "Manual-Grounded" Response
        setTimeout(() => {
            let response = "I couldn't find specific details for that in the programme manual. However, based on general IIMB DBE regulations, you should contact the programme office. Would you like me to look up information regarding Grading or Course Structure?";
            
            const lowerInput = input.toLowerCase();
            if (lowerInput.includes("pass") || lowerInput.includes("criteria") || lowerInput.includes("mark")) {
                response = "According to the Programme Manual, the passing criteria involves a weighted average of your continuous assessment (40%) and final exam (60%). You generally need a minimum of 40% overall score to pass a course.";
            } else if (lowerInput.includes("exam") || lowerInput.includes("centre")) {
                response = "Final Exams are In-Centre and Proctored. For Term-2, the tentative dates are May 23rd and May 24th, 2026. You must carry your official ID and hall ticket.";
            } else if (lowerInput.includes("module") || lowerInput.includes("release")) {
                response = "New modules for all courses are released weekly on Fridays. Quizzes associated with these modules should be attempted promptly to stay on track with the academic calendar.";
            } else if (lowerInput.includes("credit")) {
                response = "Courses are weighted differently. Foundations of Business Communication is 1.5 credits, while Indian Knowledge System and Website Development are 3.0 credits each.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left: The Programme "Wiki" (Beautifully Curated Data) */}
            <aside className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                         <BookOpen className="w-3.5 h-3.5" /> DBE Knowledge Base
                    </div>
                    <h1 className="text-3xl font-black font-headline italic tracking-tighter text-on-surface">
                        Programme <span className="text-primary italic">Manual.</span>
                    </h1>
                    <p className="text-sm text-on-surface-variant font-medium italic">
                        "Distilled intelligence from the official DBE Learner & batch manuals."
                    </p>
                </div>

                <div className="space-y-4">
                    {KNOWLEDGE_BASE.map((section, idx) => (
                        <div key={idx} className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-xs uppercase tracking-widest text-on-surface">{section.category}</h3>
                            </div>
                            <ul className="space-y-3">
                                {section.pointers.map((p, i) => (
                                    <li key={i} className="flex gap-3 text-xs font-bold text-on-surface-variant leading-relaxed">
                                        <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-indigo-500/10 p-6 rounded-[2rem] border border-indigo-500/20">
                     <div className="flex items-center gap-3 mb-2">
                        <Info className="w-5 h-5 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Pro Tip</span>
                     </div>
                     <p className="text-[11px] font-bold text-indigo-900/70 italic leading-relaxed">
                        The AI assistant below is grounded in these rules. If you find any discrepancy, always refer to the official email communications from IIMB.
                     </p>
                </div>
            </aside>

            {/* Right: AI Doubt Resolver Chat */}
            <main className="flex-1 bg-white rounded-[3rem] border border-stone-100 shadow-2xl flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg relative">
                             <Bot className="w-6 h-6" />
                             <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                             <h2 className="font-black text-lg tracking-tight leading-none italic">DBE Assistant</h2>
                             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mt-1">Grounded in Manual V2.0</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'bot' ? 'bg-primary text-white' : 'bg-stone-100 text-stone-500'}`}>
                                    {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`p-5 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm ${
                                    msg.role === 'bot' 
                                    ? 'bg-stone-50 text-on-surface border border-stone-100' 
                                    : 'bg-primary text-white'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-stone-50 p-4 rounded-[1.5rem] border border-stone-100 flex gap-2">
                                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Suggestions Area */}
                {messages.length < 3 && (
                     <div className="px-10 pb-4 flex flex-wrap gap-2">
                        {FAQS.map(faq => (
                            <button 
                                key={faq}
                                onClick={() => setInput(faq)}
                                className="px-4 py-2 bg-stone-100/50 hover:bg-stone-100 rounded-full text-[10px] font-black text-stone-500 hover:text-primary transition-all active:scale-95"
                            >
                                {faq}
                            </button>
                        ))}
                     </div>
                )}

                {/* Input Area */}
                <div className="p-6 md:p-8 bg-stone-50/50">
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full bg-white border border-stone-100 rounded-[2rem] py-5 pl-8 pr-20 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                            placeholder="Ask about grading, exams, or schedule..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-center mt-4 font-black uppercase tracking-widest text-stone-300 flex items-center justify-center gap-2">
                        <Zap className="w-3 h-3" /> Locally processed doubt resolution engine
                    </p>
                </div>
            </main>
        </div>
    );
}
