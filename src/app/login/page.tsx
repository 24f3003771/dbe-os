"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
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
        <div className="h-screen w-screen overflow-hidden relative flex flex-col font-body bg-[#FAF9F6]">
            {/* Background Image perfectly fitted, no scroll */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/login-bg.jpg')" }}
            />
            {/* Slight overlay just to ensure the login box has enough contrast if needed, but keeping it very subtle */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />

            {/* Main Content - Only the Login Box */}
            <div className="flex-1 w-full h-full flex items-center justify-center relative z-10 px-4">
                
                {/* Login Form Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#FFF0EB] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <KeyRound className="w-8 h-8 text-[#FF5F56]" />
                        </div>
                        <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Welcome Back.</h2>
                        <p className="text-sm font-bold text-stone-500">Sign in to the DBE Scholar OS</p>
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
                                {/* Email Input */}
                                <div className="space-y-1.5 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 group-focus-within:text-[#FF5F56] transition-colors">Email Address</label>
                                    <div className="relative hover:scale-[1.01] transition-transform duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 text-stone-400 group-focus-within:text-[#FF5F56] transition-colors" />
                                        </div>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com" 
                                            className="w-full bg-[#FAF9F6] border border-stone-200/60 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 hover:border-[#FF5F56]/50 focus:outline-none focus:border-[#FF5F56] focus:ring-4 focus:ring-[#FF5F56]/10 transition-all shadow-sm focus:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5 group">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-focus-within:text-[#FF5F56] transition-colors">Password</label>
                                        <button type="button" onClick={() => setIsOtpMode(true)} className="text-[10px] font-black uppercase tracking-widest text-[#FF5F56] hover:text-[#e0443e] transition-colors">
                                            Forgot / Use OTP?
                                        </button>
                                    </div>
                                    <div className="relative hover:scale-[1.01] transition-transform duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-4 h-4 text-stone-400 group-focus-within:text-[#FF5F56] transition-colors" />
                                        </div>
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••" 
                                            className="w-full bg-[#FAF9F6] border border-stone-200/60 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 hover:border-[#FF5F56]/50 focus:outline-none focus:border-[#FF5F56] focus:ring-4 focus:ring-[#FF5F56]/10 transition-all shadow-sm focus:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[#FF9056] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 group/btn"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
                                </button>
                            </motion.form>
                        ) : isOtpVerified ? (
                            <motion.form 
                                key="setNewPassword"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                onSubmit={handleSetNewPassword}
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h2 className="text-xl font-black text-stone-900 tracking-tight mb-2">Code Verified!</h2>
                                    <p className="text-xs font-bold text-stone-500 px-4">
                                        Please set a new secure password for your account before continuing.
                                    </p>
                                </div>

                                <div className="space-y-1.5 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 group-focus-within:text-[#FF5F56]">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 group-focus-within:text-[#FF5F56]" />
                                        <input 
                                            type="password" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••" 
                                            className="w-full bg-[#FAF9F6] border border-stone-200/60 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#FF5F56] focus:ring-4 focus:ring-[#FF5F56]/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || newPassword.length < 8}
                                        className="w-full py-4 bg-[#FF9056] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                        <div className="space-y-1.5 group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 group-focus-within:text-[#FF5F56]">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="w-4 h-4 text-stone-400 group-focus-within:text-[#FF5F56]" />
                                                </div>
                                                <input 
                                                    type="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="your.email@example.com" 
                                                    className="w-full bg-[#FAF9F6] border border-stone-200/60 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#FF5F56] focus:ring-4 focus:ring-[#FF5F56]/10 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="w-full py-4 bg-[#FF9056] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Login Code <ArrowRight className="w-4 h-4" /></>}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl mb-6">
                                            <p className="text-xs font-bold text-center text-orange-600">We sent a 6-digit login code to<br/><span className="text-stone-900 font-black mt-1 inline-block">{email}</span></p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">6-Digit Code</label>
                                            <input 
                                                type="text" 
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="123456" 
                                                className="w-full bg-[#FAF9F6] border border-stone-200/60 rounded-2xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-black text-stone-900 focus:outline-none focus:border-[#FF5F56] focus:ring-4 focus:ring-[#FF5F56]/10 transition-all"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isLoading || otp.length !== 6}
                                            className="w-full py-4 bg-[#FF9056] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center mt-4"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                                        </button>
                                    </>
                                )}
                                
                                <div className="text-center pt-4">
                                    <button type="button" onClick={() => setIsOtpMode(false)} className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                        Return to Password Login
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
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
