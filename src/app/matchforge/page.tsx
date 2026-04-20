"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, Target, Zap, Clock, ShieldCheck, ChevronRight, 
    Linkedin, Heart, User, Briefcase, GraduationCap, 
    Layers, MessageSquare, ArrowRight, CheckCircle, Info
} from "lucide-react";
import { saveOnboardingData, getMatches, connectWithUser } from "@/actions/matchforge";

const steps = [
    { id: "intro", title: "MatchForge V2", icon: Users },
    { id: "identity", title: "Who are you?", icon: User },
    { id: "capability", title: "What can you do?", icon: Zap },
    { id: "goals", title: "What is your intent?", icon: Target },
    { id: "style", title: "How do you work?", icon: Layers },
    { id: "logistics", title: "Logistics & Sync", icon: Clock },
];

export default function MatchForgePage() {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // V2 Form State (25+ signals)
    const [formData, setFormData] = useState({
        // A. Identity
        ageRange: "18-22",
        location: "",
        educationLevel: "Undergraduate",
        currentStatus: "STUDENT",
        
        // B. Skills
        skills: [
            { name: "React", level: 4, isPrimary: true },
            { name: "Node.js", level: 3, isPrimary: false }
        ],
        domainExpertise: ["Tech", "SaaS"],
        
        // C. Goals
        goal: "LEARNING",
        timeHorizon: "MEDIUM_TERM",
        goalDescription: "",
        industryInterest: ["AI", "FinTech"],
        
        // D. Work Style & Personality
        workStyle: "ASYNC",
        workingHours: "FLEXIBLE",
        commitmentLevel: "SERIOUS",
        riskAppetite: "MEDIUM",
        decisionStyle: "ANALYTICAL",
        
        // Personality (1-10)
        introvertExtrovert: 5,
        plannerExecutor: 5,
        leaderSupporter: 5,
        
        // E. Logistics
        hoursPerWeek: 10,
        preferredTimeSlots: ["Evenings", "Weekends"],
        
        // F. Collaboration
        partnerSkillPref: "SAME",
        teamSizePref: "1:1",
        commTools: ["WhatsApp", "Discord"],
        
        // G. Trust
        linkedinUrl: "",
        portfolioUrl: "",
        bio: ""
    });

    useEffect(() => {
        const checkProfile = async () => {
            const m = await getMatches();
            setMatches(m);
            // Defaulting to onboarding for this demo if matches were empty but now seeded
            setLoading(false);
        };
        checkProfile();
    }, []);

    const nextStep = () => setStep(s => Math.min(steps.length - 1, s + 1));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const handleComplete = async () => {
        setSaving(true);
        try {
            await saveOnboardingData(formData);
            const m = await getMatches();
            setMatches(m);
            setProfile(formData);
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    if (profile) return <MatchFeed matches={matches} />;

    return (
        <div className="max-w-4xl mx-auto pb-20 pt-10 px-4">
            <header className="text-center mb-12 space-y-4">
                 <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-4 py-1.5 rounded-full text-indigo-600 font-bold text-xs tracking-widest uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" /> High-Precision Matchmaking
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-[#1A1A1A]">Forge. V2</h1>
                <p className="text-stone-500 font-medium text-lg max-w-xl mx-auto italic">"Similarity is a starting point. Complementarity is the goal."</p>
            </header>

            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-200/60 shadow-2xl relative min-h-[650px] flex flex-col">
                {/* Progress Bar */}
                <div className="h-1.5 bg-stone-100 flex">
                    {steps.map((s, i) => (
                        <div key={s.id} className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-stone-100'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-8 md:p-16 flex-1 flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                {(() => { const Icon = steps[step].icon; return <Icon className="w-6 h-6" />; })()}
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600/60">Step {step + 1} of {steps.length}</h3>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">{steps[step].title}</h2>
                            </div>
                        </div>

                        {step === 0 && (
                            <div className="space-y-8 flex-1 flex flex-col justify-center text-center">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-[#1A1A1A] leading-tight">Beyond keyword matching.</h2>
                                    <p className="text-stone-500 text-xl font-medium max-w-lg mx-auto">25+ parameters analyze your identity, capability, intent, and work-style compatibility.</p>
                                </div>
                                <button onClick={nextStep} className="mt-12 px-10 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 mx-auto">
                                    Start Smart Onboarding <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Current Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['STUDENT', 'PROFESSIONAL', 'FOUNDER', 'FREELANCER'].map(s => (
                                                <button 
                                                    key={s} 
                                                    onClick={() => setFormData({...formData, currentStatus: s})}
                                                    className={`py-3 px-2 rounded-xl text-[10px] font-black border-2 transition-all ${formData.currentStatus === s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-stone-100 text-stone-400 hover:border-stone-200'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Age Range</label>
                                        <select 
                                            value={formData.ageRange}
                                            onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                                            className="w-full p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold outline-none focus:border-indigo-600 transition-all cursor-pointer"
                                        >
                                            <option>18-22</option>
                                            <option>23-28</option>
                                            <option>29-35</option>
                                            <option>35+</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Location (City)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Bangalore, Mumbai"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold outline-none focus:border-indigo-600 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Education</label>
                                        <select 
                                            value={formData.educationLevel}
                                            onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                                            className="w-full p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold outline-none focus:border-indigo-600 transition-all cursor-pointer"
                                        >
                                            <option>Undergraduate</option>
                                            <option>Postgraduate</option>
                                            <option>PhD</option>
                                            <option>Self-taught</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-end">
                                    <button onClick={nextStep} className="px-10 py-5 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg hover:bg-black transition-all">Next Component</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 flex-1">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Domain Expertise</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Product'].map(d => (
                                                <button 
                                                    key={d}
                                                    onClick={() => {
                                                        const exists = formData.domainExpertise.includes(d);
                                                        setFormData({...formData, domainExpertise: exists ? formData.domainExpertise.filter(x => x !== d) : [...formData.domainExpertise, d]});
                                                    }}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-2 ${formData.domainExpertise.includes(d) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-stone-100 text-stone-400 hover:border-stone-200'}`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Tools known (SaaS Skills)</label>
                                        <div className="p-6 bg-stone-50 rounded-2xl space-y-4">
                                            {formData.skills.map((s, i) => (
                                                <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-stone-200 last:border-0 last:pb-0">
                                                    <span className="font-bold text-stone-700 min-w-[80px]">{s.name}</span>
                                                    <div className="flex-1 flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(lvl => (
                                                            <button 
                                                                key={lvl}
                                                                onClick={() => {
                                                                    const newSkills = [...formData.skills];
                                                                    newSkills[i].level = lvl;
                                                                    setFormData({...formData, skills: newSkills});
                                                                }}
                                                                className={`w-10 h-10 rounded-lg font-black text-xs border-2 transition-all ${s.level === lvl ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-stone-100 text-stone-300'}`}
                                                            >
                                                                {lvl}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-between">
                                    <button onClick={prevStep} className="px-8 py-4 font-bold text-stone-400 hover:text-stone-600">Back</button>
                                    <button onClick={nextStep} className="px-10 py-5 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg hover:bg-black transition-all">Continue Onboarding</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 col-span-full">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Primary Partner Goal</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: "LEARNING", label: "Learn Buddy", icon: GraduationCap },
                                                { id: "COFOUNDER", label: "Cofounder", icon: Briefcase },
                                                { id: "TEAM", label: "Team Member", icon: Users },
                                                { id: "ACCOUNTABILITY", label: "Accountability", icon: ShieldCheck }
                                            ].map(g => (
                                                <button 
                                                    key={g.id}
                                                    onClick={() => setFormData({...formData, goal: g.id})}
                                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 gap-3 transition-all ${formData.goal === g.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-stone-100 text-stone-400'}`}
                                                >
                                                    <g.icon className="w-6 h-6" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-center">{g.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Time Horizon</label>
                                        <select 
                                            value={formData.timeHorizon}
                                            onChange={(e) => setFormData({...formData, timeHorizon: e.target.value})}
                                            className="w-full p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold"
                                        >
                                            <option value="SHORT_TERM">{"< 1 Month (Fast-paced)"}</option>
                                            <option value="MEDIUM_TERM">{"1-3 Months (Balanced)"}</option>
                                            <option value="LONG_TERM">{"3-12 Months (Serious Build)"}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Goal Description</label>
                                        <input 
                                            type="text" 
                                            placeholder="What exactly are you building?"
                                            value={formData.goalDescription}
                                            onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                                            className="w-full p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold outline-none focus:border-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-between">
                                    <button onClick={prevStep} className="px-8 py-4 font-bold text-stone-400">Back</button>
                                    <button onClick={nextStep} className="px-10 py-5 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg hover:bg-black transition-all">Next Component</button>
                                </div>
                            </div>
                        )}

                         {step === 4 && (
                            <div className="space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-stone-400 tracking-widest flex justify-between">Introvert ↔ Extrovert <span>{formData.introvertExtrovert}</span></label>
                                            <input type="range" min="1" max="10" className="w-full accent-indigo-600" value={formData.introvertExtrovert} onChange={(e) => setFormData({...formData, introvertExtrovert: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-stone-400 tracking-widest flex justify-between">Planner ↔ Executor <span>{formData.plannerExecutor}</span></label>
                                            <input type="range" min="1" max="10" className="w-full accent-indigo-600" value={formData.plannerExecutor} onChange={(e) => setFormData({...formData, plannerExecutor: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-stone-400 tracking-widest flex justify-between">Leader ↔ Supporter <span>{formData.leaderSupporter}</span></label>
                                            <input type="range" min="1" max="10" className="w-full accent-indigo-600" value={formData.leaderSupporter} onChange={(e) => setFormData({...formData, leaderSupporter: parseInt(e.target.value)})} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Work Preference</label>
                                            <div className="flex gap-2">
                                                {['ASYNC', 'SYNC'].map(s => (
                                                    <button key={s} onClick={() => setFormData({...formData, workStyle: s})} className={`flex-1 py-4 px-2 rounded-xl text-xs font-black border-2 ${formData.workStyle === s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-stone-100 text-stone-400'}`}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Decision Style</label>
                                            <div className="flex gap-2">
                                                {['FAST', 'ANALYTICAL'].map(s => (
                                                    <button key={s} onClick={() => setFormData({...formData, decisionStyle: s})} className={`flex-1 py-4 px-2 rounded-xl text-xs font-black border-2 ${formData.decisionStyle === s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-stone-100 text-stone-400'}`}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-between">
                                    <button onClick={prevStep} className="px-8 py-4 font-bold text-stone-400">Back</button>
                                    <button onClick={nextStep} className="px-10 py-5 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg hover:bg-black transition-all">Final Logistics</button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Hours per Week (Numeric Only)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                min="2" 
                                                max="80"
                                                value={formData.hoursPerWeek}
                                                onChange={(e) => setFormData({...formData, hoursPerWeek: parseInt(e.target.value)})}
                                                className="w-32 p-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-extrabold text-2xl text-center"
                                            />
                                            <p className="text-stone-400 font-bold">hours of dedicated output</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">LinkedIn Profile URL</label>
                                        <div className="relative">
                                            <input 
                                                type="url" 
                                                placeholder="https://linkedin.com/..."
                                                value={formData.linkedinUrl}
                                                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                                                className="w-full p-4 pl-12 rounded-xl bg-stone-50 border-2 border-stone-100 font-bold"
                                            />
                                            <Linkedin className="absolute left-4 top-4 w-5 h-5 text-[#0077b5]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 col-span-full">
                                        <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Short Match Bio</label>
                                        <textarea 
                                            placeholder="Write something that makes a partner want to build with you..."
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className="w-full p-6 rounded-[2rem] bg-stone-50 border-2 border-stone-100 font-medium text-lg min-h-[120px] outline-none focus:border-indigo-600 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-between items-center bg-white border-t border-stone-100 mt-auto">
                                    <button onClick={prevStep} className="px-8 py-4 font-bold text-stone-400">Back</button>
                                    <button onClick={handleComplete} disabled={saving} className="px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3">
                                        {saving ? "AI Synthesis..." : "Generate Matches"} <Zap className="w-6 h-6 fill-white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
                {steps.map((s, i) => (
                    <button key={s.id} onClick={() => setStep(i)} className={`w-3 h-3 rounded-full transition-all ${i === step ? 'bg-indigo-600 w-8' : 'bg-stone-200'}`} />
                ))}
            </div>
        </div>
    );
}

function MatchFeed({ matches }: { matches: any[] }) {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 text-center md:text-left">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                        Feed Regenerated
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-[#1A1A1A]">Top 10.</h1>
                    <p className="text-[#A69994] font-medium text-xl">High-precision matches based on {matches.length > 0 ? "30+" : "0"} verified signals.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-8 py-4 bg-white border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-all shadow-sm">Refine Filters</button>
                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">Force Refresh</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map((match, index) => (
                    <motion.div 
                        key={match.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all group flex flex-col h-[550px]"
                    >
                        {/* Upper Half: Identity */}
                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-4xl text-indigo-600 relative">
                                    {match.name.charAt(0)}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-indigo-600 leading-none">{match.score}%</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">Compat Score</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-black font-headline text-[#1A1A1A] tracking-tight group-hover:text-indigo-600 transition-colors">
                                    {match.name}
                                </h3>
                                <p className="text-[10px] font-black text-indigo-600/70 uppercase tracking-[0.3em]">{match.matchType.replace(/_/g, ' ')}</p>
                            </div>

                            <p className="text-stone-500 text-sm font-medium leading-relaxed line-clamp-3">
                                {match.bio || "This scholar is focusing on depth and has yet to complete their bio. Their skills speak loud enough."}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {match.skills.map((s: string) => (
                                    <span key={s} className="px-3 py-1 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-black text-stone-400 uppercase tracking-wider">{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Lower Half: Logic & Actions */}
                        <div className="p-8 pt-0 space-y-6">
                            <div className="p-5 bg-indigo-600/[0.03] rounded-3xl border border-indigo-600/10 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                    <Info className="w-3 h-3" /> Core Match Logic
                                </p>
                                <p className="text-xs font-bold text-stone-700 leading-relaxed italic">
                                    "{match.explanation}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => connectWithUser(match.id)}
                                    className="flex items-center justify-center gap-2 py-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl font-black text-xs transition-all uppercase tracking-widest"
                                >
                                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Save
                                </button>
                                <button className="flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl font-black text-xs shadow-lg transition-all uppercase tracking-widest group">
                                    <Linkedin className="w-3.5 h-3.5 text-indigo-400" /> Connect <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
