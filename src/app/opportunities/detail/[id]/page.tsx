"use client";

import { useState, useEffect, use } from "react";
import { getOpportunityById } from "@/actions/opportunities";
import { 
    ChevronLeft, Calendar, User, MapPin, 
    Rocket, BookOpen, Star, ArrowRight, CheckCircle2,
    Briefcase, Globe, Info, Download
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [opp, setOpp] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"roadmap" | "guide" | "winners">("roadmap");

    useEffect(() => {
        getOpportunityById(id).then(data => {
            setOpp(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!opp) return <div className="text-center py-20 font-black">Opportunity not found.</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 pb-32">
            {/* Nav */}
            <Link href={`/opportunities/${opp.type}`} className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {opp.type.toLowerCase()}s
            </Link>

            {/* Title Block */}
            <header className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-6 flex-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest rounded-full">{opp.type}</span>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">{opp.domain}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-[#1A1A1A] leading-none">
                            {opp.name}
                        </h1>
                        <p className="text-stone-400 font-bold text-lg uppercase tracking-widest">Organized by {opp.organizer}</p>
                    </div>

                    <p className="text-xl font-medium text-stone-500 max-w-3xl leading-relaxed">
                        {opp.description}
                    </p>

                    <div className="flex flex-wrap gap-8 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">Deadline</p>
                                <p className="font-bold text-stone-700">{new Date(opp.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">Locality</p>
                                <p className="font-bold text-stone-700">{opp.mode}</p>
                            </div>
                        </div>
                        {opp.stipend && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">Stipend</p>
                                    <p className="font-bold text-stone-700">{opp.stipend}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-3">
                    <button className="w-full md:w-64 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        Apply Externally <Globe className="w-5 h-5" />
                    </button>
                    <button className="w-full md:w-64 py-5 bg-white border border-stone-100 rounded-2xl font-black text-lg hover:border-stone-300 transition-all flex items-center justify-center gap-3">
                        Share <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Detail Navigation */}
            <div className="flex gap-1 bg-stone-50 p-1.5 rounded-2xl w-full md:w-fit">
                {[
                    { id: "roadmap", label: "Visual Roadmap", icon: Rocket },
                    { id: "guide", label: "Prep Guide", icon: BookOpen },
                    { id: "winners", label: "Winners Bank", icon: Star }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 md:p-20 min-h-[600px]">
                {activeTab === "roadmap" && (
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="text-center space-y-4 mb-20">
                             <h2 className="text-4xl font-black text-[#1A1A1A]">Engineered Path to Success.</h2>
                             <p className="text-stone-400 font-medium italic">"The process defines the result."</p>
                        </div>
                        
                        <div className="relative space-y-20">
                            {/* Roadmap Line */}
                            <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-stone-50" />
                            
                            {opp.stages.map((stage: any, i: number) => (
                                <div key={stage.id} className="relative flex gap-10">
                                    <div className="z-10 w-12 h-12 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center font-black text-indigo-600 text-lg shadow-xl shadow-indigo-100">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 space-y-3 pt-1">
                                        <h3 className="text-2xl font-black text-[#1A1A1A] flex items-center gap-3 uppercase tracking-tight">
                                            {stage.title}
                                            {i === 0 && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-md border border-emerald-100">Active Now</span>}
                                        </h3>
                                        <p className="text-stone-500 font-medium text-lg leading-relaxed">
                                            {stage.description}
                                        </p>
                                        <div className="flex gap-4 pt-4">
                                            <button className="flex items-center gap-2 px-6 py-2.5 bg-stone-50 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all">
                                                Resource Link <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="relative flex gap-10">
                                <div className="z-10 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-2 pt-1">
                                    <h3 className="text-2xl font-black text-indigo-600 uppercase tracking-tight">Selection & Offer</h3>
                                    <p className="text-stone-400 font-medium">Follow the above steps precisely to reach the podium.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "guide" && (
                    <div className="max-w-4xl mx-auto prose prose-indigo max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#1A1A1A] prose-p:text-stone-600 prose-p:text-xl prose-p:font-medium prose-p:leading-relaxed">
                        {opp.guide ? (
                            <ReactMarkdown>{opp.guide.content}</ReactMarkdown>
                        ) : (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto text-stone-200">
                                    <BookOpen className="w-10 h-10" />
                                </div>
                                <p className="text-stone-400 font-medium">Preparation guide being curated by top performers. Check back soon.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "winners" && (
                    <div className="max-w-5xl mx-auto space-y-12">
                         <div className="text-center space-y-4 mb-20">
                             <h2 className="text-4xl font-black text-[#1A1A1A]">Winning Solutions.</h2>
                             <p className="text-stone-400 font-medium italic">"Analyze why they won. Mirror the strategy, innovate the solution."</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {opp.submissions.map((sub: any) => (
                                <div key={sub.id} className="bg-stone-50 rounded-3xl p-8 space-y-6 border border-stone-100 hover:border-indigo-600/20 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-[#1A1A1A]">{sub.title}</h4>
                                            <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">{sub.author}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <p className="text-stone-500 text-sm font-medium leading-relaxed">{sub.description}</p>
                                        <div className="p-4 bg-indigo-50/30 rounded-2xl space-y-2 border border-indigo-50">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">Winning Strategy</p>
                                            <p className="text-xs font-bold text-stone-600 italic">"{sub.strategy}"</p>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-4 bg-white border border-stone-200 rounded-xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Download PPT (PDF)
                                    </button>
                                </div>
                            ))}
                            
                            {opp.submissions.length === 0 && (
                                <div className="col-span-full text-center py-20 text-stone-400 font-medium italic">No verified winning submissions in the bank yet.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
