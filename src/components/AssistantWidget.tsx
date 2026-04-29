"use client";

import { useState, useRef, useEffect } from "react";
import { 
    MessageCircle, 
    X, 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    Zap,
    Maximize2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hey! I'm your DBE Assistant. Ask me anything about the programme, grading, or Term-2 schedule!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input } as const;
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        // Add a placeholder bot message for streaming
        setMessages(prev => [...prev, { role: 'bot', text: "" }]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: newMessages.map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.text
                    }))
                }),
            });

            if (!response.body) throw new Error("No response body");
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");
                
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === "[DONE]") continue;
                        try {
                            const data = JSON.parse(dataStr);
                            const content = data.choices[0]?.delta?.content || "";
                            accumulatedResponse += content;
                            
                            setMessages(prev => {
                                const newPrev = [...prev];
                                newPrev[newPrev.length - 1] = { role: 'bot', text: accumulatedResponse };
                                return newPrev;
                            });
                        } catch (e) {
                            // Incomplete chunk
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center border-2 border-white/20 backdrop-blur-xl transition-transform active:scale-95 hover:scale-105"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

            {/* Chat Dialogue Box */}
            <AnimatePresence>
                {isOpen && (
                    <div
                        className="fixed bottom-40 md:bottom-28 right-6 md:right-8 z-[100] w-[calc(100vw-48px)] md:w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.15)] border border-stone-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-stone-50/50 border-b border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tight italic">DBE Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Active Manual v2</span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/doubts" onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-primary transition-colors">
                                <Maximize2 className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                        >
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center mt-1 outline outline-1 ${msg.role === 'bot' ? 'bg-primary text-white outline-primary/20' : 'bg-stone-50 text-stone-400 outline-stone-100'}`}>
                                            {msg.role === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${
                                            msg.role === 'bot' 
                                            ? 'bg-stone-50 text-stone-800' 
                                            : 'bg-primary text-white'
                                        }`}>
                                            {msg.text || (isTyping && idx === messages.length - 1 ? "..." : "")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && messages[messages.length-1].text === "" && (
                                <div className="flex justify-start">
                                    <div className="bg-stone-50 p-4 rounded-2xl flex gap-1.5 border border-stone-100">
                                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-stone-50">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask about Term-2 schedule..."
                                    className="w-full bg-stone-50 border-none rounded-2xl py-4 pl-6 pr-14 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button 
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[9px] text-center mt-3 font-black uppercase text-stone-300 tracking-wider flex items-center justify-center gap-1.5 opacity-60">
                                <Zap className="w-2.5 h-2.5 text-secondary" /> Locally processed by NVIDIA 70B
                            </p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
