"use client";

import { useState, useEffect, Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
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
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );

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
            // Check global settings first
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
            // Check global settings first
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
            // If they were doing a forgot password flow, let them reset it now
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
        <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 p-3 bg-surface-container rounded-xl text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10 shadow-sm z-10 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-surface-container/50 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">Welcome Back.</h1>
                    <p className="text-sm font-medium text-on-surface-variant">Sign in to the DBE Scholar OS</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold text-center"
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
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-4 h-4 text-on-surface-variant/50" />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com" 
                                        className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Password</label>
                                    <button type="button" onClick={() => setIsOtpMode(true)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                                        Forgot / Use OTP?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-4 h-4 text-on-surface-variant/50" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••" 
                                        className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
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
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-xl font-black font-headline text-on-surface tracking-tight mb-2">Code Verified!</h2>
                                <p className="text-xs font-bold text-on-surface-variant px-4">
                                    Please set a new secure password for your account before continuing to your dashboard.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••" 
                                        className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isLoading || newPassword.length < 8}
                                    className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="w-4 h-4 text-on-surface-variant/50" />
                                            </div>
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your.email@example.com" 
                                                className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Login Code <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mb-6">
                                        <p className="text-xs font-bold text-center text-primary">We sent a 6-digit login code to<br/><span className="text-on-surface font-black">{email}</span></p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">6-Digit Code</label>
                                        <input 
                                            type="text" 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="123456" 
                                            className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-black text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || otp.length !== 6}
                                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center justify-center mt-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                                    </button>
                                </>
                            )}
                            
                            <div className="text-center pt-4">
                                <button type="button" onClick={() => setIsOtpMode(false)} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
                                    Return to Password Login
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
                    <p className="text-xs font-bold text-on-surface-variant">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary hover:underline font-black uppercase tracking-wider ml-1">Register Here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
