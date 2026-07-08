"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, KeyRound, ArrowLeft, CheckCircle2, Code2, BookOpen, BrainCircuit, FileText, Trophy, Calculator, Compass, Presentation, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPageContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setError(errorParam);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { data: settings } = await supabase
                .from('app_settings')
                .select('restrict_emails')
                .eq('id', 1)
                .single();
                
            const restrictEmails = settings ? settings.restrict_emails : true;
            
            if (restrictEmails && !email.toLowerCase().endsWith("@iimb.ac.in")) {
                setError("Only official @iimb.ac.in email addresses are currently allowed to sign in.");
                setIsLoading(false);
                return;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { data: settings } = await supabase
                .from('app_settings')
                .select('restrict_emails')
                .eq('id', 1)
                .single();
                
            const restrictEmails = settings ? settings.restrict_emails : true;
            
            if (restrictEmails && !email.toLowerCase().endsWith("@iimb.ac.in")) {
                setError("Only official @iimb.ac.in email addresses are currently allowed to sign in.");
                setIsLoading(false);
                return;
            }

            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (otpError) throw otpError;
            setIsOtpSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send login link.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });

            if (verifyError) throw verifyError;
            setIsOtpVerified(true);
        } catch (err: any) {
            setError(err.message || "Invalid login code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetNewPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to update password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB] font-body overflow-x-hidden">
            
            {/* Left Content Area (Marketing & iPad) */}
            <div className="relative w-full lg:w-[65%] xl:w-[70%] bg-white flex flex-col overflow-hidden min-h-[50vh]">
                
                {/* Navbar (Mock) */}
                <div className="flex items-center justify-between p-6 lg:px-12 lg:py-8 z-20 relative">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF9056] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-stone-900 text-xl tracking-tight">DBE Scholar OS</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 font-bold text-sm text-stone-500">
                        <Link href="/features" className="hover:text-stone-900 transition-colors">Features</Link>
                        <Link href="/resources" className="hover:text-stone-900 transition-colors">Resources</Link>
                        <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">Join our exclusive community !!</a>
                        <Link href="/about" className="hover:text-stone-900 transition-colors">About</Link>
                    </div>
                </div>

                {/* Main Marketing Content */}
                <div className="flex-1 flex items-center z-10 relative py-12 lg:py-0">
                    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center relative h-full">
                        
                        {/* Text Content */}
                        <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col z-20 relative">
                            <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-black text-stone-900 leading-[1.1] tracking-tight mb-6">
                                Everything you <br className="hidden md:block" /> need to excel in <br className="hidden md:block" /> your degree.
                            </h1>
                            <p className="text-stone-500 text-lg md:text-xl font-medium mb-10 max-w-[400px] leading-relaxed">
                                A modern academic OS built exclusively for IIM Bangalore DBE students.
                            </p>

                            <div className="space-y-4 mb-10">
                                {[
                                    { icon: <BookOpen className="w-5 h-5 text-[#FF9056]" />, text: "Structured learning" },
                                    { icon: <BrainCircuit className="w-5 h-5 text-[#FF9056]" />, text: "Smart tools" },
                                    { icon: <Briefcase className="w-5 h-5 text-[#FF9056]" />, text: "Career ready" },
                                    { icon: <Code2 className="w-5 h-5 text-[#FF9056]" />, text: "Community driven" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        {item.icon}
                                        <span className="font-bold text-stone-700 text-base md:text-lg">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="bg-[#FF9056] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all w-fit flex items-center gap-3 mb-12 lg:mb-16 text-base md:text-lg">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>

                            {/* Stats */}
                            <div className="flex items-center gap-4 md:gap-8 p-5 md:p-6 bg-white border border-stone-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] w-fit">
                                <div className="text-center">
                                    <h4 className="font-black text-xl md:text-2xl text-stone-900">4000+</h4>
                                    <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">DBE Students<br/>Onboarded</p>
                                </div>
                                <div className="w-px h-8 md:h-10 bg-stone-100" />
                                <div className="text-center">
                                    <h4 className="font-black text-xl md:text-2xl text-stone-900">4.8/5</h4>
                                    <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">Student<br/>Rating</p>
                                </div>
                                <div className="w-px h-8 md:h-10 bg-stone-100" />
                                <div className="text-center">
                                    <h4 className="font-black text-xl md:text-2xl text-stone-900">95%</h4>
                                    <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">Improved Weekly<br/>Consistency</p>
                                </div>
                            </div>
                        </div>

                        {/* 3D iPad Mockup */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-[-25%] lg:right-[-15%] xl:right-[-5%] w-[900px] h-[650px] hidden lg:block z-10 pointer-events-none" style={{ perspective: '2000px' }}>
                            <div 
                                className="w-full h-full relative rounded-[3rem] bg-black border-[12px] border-black p-2 shadow-[30px_50px_80px_-20px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
                                style={{
                                    transform: 'rotateY(-18deg) rotateX(8deg) rotateZ(-2deg) scale(0.95)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {/* Glare Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 pointer-events-none transform -skew-x-12 translate-x-1/4" />
                                
                                {/* Inner Screen */}
                                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative z-10 border border-stone-800">
                                    {/* Dashboard Image - falls back gracefully if image is not present */}
                                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 relative">
                                        <img 
                                            src="/dashboard-preview.png" 
                                            alt="DBE OS Dashboard"
                                            className="absolute inset-0 w-full h-full object-cover object-left-top z-10"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <div className="text-center z-0">
                                            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="font-medium">Dashboard Preview</p>
                                            <p className="text-xs mt-1">(Add public/dashboard-preview.png)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stylized Apple Pencil */}
                            <div 
                                className="absolute bottom-[-40px] left-[15%] w-[400px] h-4 bg-white rounded-full shadow-[5px_15px_30px_rgba(0,0,0,0.3)] z-0"
                                style={{
                                    transform: 'rotateZ(-15deg)',
                                    background: 'linear-gradient(to bottom, #ffffff, #e5e5e5)'
                                }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-stone-200 rounded-r-full border-l border-stone-300"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Sidebar Area (Login Form) */}
            <div className="w-full lg:w-[35%] xl:w-[30%] bg-[#F9FAFB] flex flex-col items-center justify-center p-6 lg:p-10 relative z-20 min-h-[50vh]">
                <div className="w-full max-w-[400px]">
                    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Sign in</h2>
                            <p className="text-sm font-medium text-stone-500">Welcome back! Please sign in to continue.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {!isOtpMode ? (
                                <motion.form 
                                    key="password-login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-5"
                                    onSubmit={handleLogin}
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-stone-700">Email</label>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email" 
                                            className="w-full bg-white border border-stone-200 rounded-xl py-3.5 px-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-stone-700">Password</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password" 
                                                className="w-full bg-white border border-stone-200 rounded-xl py-3.5 px-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
                                            <span className="text-sm font-medium text-stone-600">Remember me</span>
                                        </label>
                                        <button type="button" onClick={() => setIsOtpMode(true)} className="text-sm font-bold text-[#FF9056] hover:text-[#ff7a33] transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-md shadow-stone-900/20 hover:bg-stone-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-stone-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-stone-400 font-medium">or</span>
                                        </div>
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={() => setError("Google Sign-In is not currently configured.")}
                                        className="w-full py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl font-bold text-sm hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Sign in with Google
                                    </button>
                                    
                                    <div className="text-center pt-2">
                                        <p className="text-xs font-medium text-stone-500">
                                            Don't have an account?{' '}
                                            <Link href="/register" className="text-[#FF9056] font-bold hover:text-[#ff7a33] transition-colors">
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>
                                </motion.form>
                            ) : isOtpVerified ? (
                                <motion.form 
                                    key="setNewPassword"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5"
                                    onSubmit={handleSetNewPassword}
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-stone-900 tracking-tight mb-2">Code Verified!</h2>
                                        <p className="text-xs font-medium text-stone-500 px-4">
                                            Please set a new secure password for your account before continuing.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-stone-700">New Password</label>
                                        <input 
                                            type="password" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••" 
                                            className="w-full bg-white border border-stone-200 rounded-xl py-3.5 px-4 text-sm font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm"
                                            required
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={isLoading || newPassword.length < 8}
                                            className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Password & Continue"}
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.form 
                                    key="otp-login"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                    onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
                                >
                                    {!isOtpSent ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-stone-700">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email" 
                                                    className="w-full bg-white border border-stone-200 rounded-xl py-3.5 px-4 text-sm font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Login Code <ArrowRight className="w-4 h-4" /></>}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl mb-6">
                                                <p className="text-xs font-medium text-center text-stone-600">We sent a 6-digit login code to<br/><span className="text-stone-900 font-bold mt-1 inline-block">{email}</span></p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-stone-700">6-Digit Code</label>
                                                <input 
                                                    type="text" 
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="123456" 
                                                    className="w-full bg-white border border-stone-200 rounded-xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-black text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-sm"
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={isLoading || otp.length !== 6}
                                                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center mt-4"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                                            </button>
                                        </>
                                    )}
                                    
                                    <div className="text-center pt-4 border-t border-stone-100 mt-6">
                                        <button type="button" onClick={() => setIsOtpMode(false)} className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors">
                                            Return to Password Login
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF5F56]" /></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
