"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, ArrowLeft, MapPin, Building, Phone, GraduationCap, Compass, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form Data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pincode, setPincode] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zone, setZone] = useState("");
    const [batch, setBatch] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    useEffect(() => {
        if (pincode.length === 6) {
            setIsFetchingLocation(true);
            fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data[0] && data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice[0];
                        setState(postOffice.State);
                        setCity(postOffice.District || postOffice.Region);
                    }
                })
                .catch(err => console.error("Failed to fetch location", err))
                .finally(() => setIsFetchingLocation(false));
        }
    }, [pincode]);

    const router = useRouter();
    const supabase = createClient();

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Step 1 Validation
        if (step === 1) {
            setIsLoading(true);
            try {
                const { data: settings } = await supabase
                    .from('app_settings')
                    .select('restrict_emails')
                    .eq('id', 1)
                    .single();
                    
                const restrictEmails = settings ? settings.restrict_emails : true;
                
                if (restrictEmails && !email.toLowerCase().endsWith("@iimb.ac.in")) {
                    setError("Only official @iimb.ac.in email addresses are currently allowed to register.");
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Failed to check settings", err);
            } finally {
                setIsLoading(false);
            }

            if (password.length < 8) {
                setError("Password must be at least 8 characters.");
                return;
            }
        }

        // Step 2 Validation
        if (step === 2) {
            if (!pincode || pincode.trim().length !== 6 || !city.trim() || !state.trim()) {
                setError("Please provide a valid 6-digit Pincode, City, and State.");
                return;
            }
        }

        setStep(prev => prev + 1);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Sign up the user via Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        pincode,
                        state,
                        city,
                        zone,
                        batch,
                        phone
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (signUpError) throw signUpError;
            
            // If we successfully created the user and they require email confirmation
            if (data?.user?.identities?.length === 0) {
                 throw new Error("This email is already registered. Please sign in.");
            }

            // Move to OTP/Success step
            setStep(4);
        } catch (err: any) {
            setError(err.message || "Failed to create account.");
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
                type: 'signup' // or email depending on supabase config
            });

            if (verifyError) throw verifyError;
            
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <Link href="/login" className="absolute top-8 left-8 p-3 bg-surface-container rounded-xl text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10 shadow-sm z-10 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-surface-container/80 backdrop-blur-2xl border border-outline-variant/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
            >
                {/* Progress Bar */}
                <div className="mb-8 flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-outline-variant/20'}`} />
                    ))}
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black font-headline text-on-surface tracking-tight">
                        {step === 1 ? "Create Account" : step === 2 ? "Location Details" : step === 3 ? "Academic Info" : "Verify Email"}
                    </h1>
                    <p className="text-xs font-bold text-on-surface-variant mt-2 uppercase tracking-widest">
                        {step === 1 ? "Step 1 of 3" : step === 2 ? "Step 2 of 3" : step === 3 ? "Final Step" : "Almost Done"}
                    </p>
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

                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {step === 1 && (
                            <motion.form 
                                key="step1"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                onSubmit={handleNextStep}
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form 
                                key="step2"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                onSubmit={handleNextStep}
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Pincode</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input required type="text" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="560076" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        {isFetchingLocation && <Loader2 className="absolute right-4 top-3.5 w-4 h-4 text-primary animate-spin" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">State</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input required type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-9 pr-3 text-sm font-bold focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                            <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangalore" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-9 pr-3 text-sm font-bold focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-6">
                                    <button type="button" onClick={() => setStep(1)} className="py-4 px-6 bg-surface border border-outline-variant/20 rounded-2xl font-black text-on-surface-variant hover:bg-surface-container transition-all">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isFetchingLocation} className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form 
                                key="step3"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                onSubmit={handleRegister}
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                                {email.toLowerCase().endsWith("@iimb.ac.in") && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Zone</label>
                                            <div className="relative">
                                                <Compass className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                                <select required value={zone} onChange={(e) => setZone(e.target.value)} className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-9 pr-3 text-xs font-bold focus:border-primary transition-all outline-none appearance-none">
                                                    <option value="" disabled>Select Zone</option>
                                                    <option value="NORTH ZONE 01">NORTH ZONE 01</option>
                                                    <option value="NORTH ZONE 02">NORTH ZONE 02</option>
                                                    <option value="SOUTH ZONE 01">SOUTH ZONE 01</option>
                                                    <option value="SOUTH ZONE 02">SOUTH ZONE 02</option>
                                                    <option value="WEST ZONE 01">WEST ZONE 01</option>
                                                    <option value="WEST ZONE 02">WEST ZONE 02</option>
                                                    <option value="EAST ZONE">EAST ZONE</option>
                                                    <option value="CENTRAL ZONE">CENTRAL ZONE</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Batch</label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                                                <select required value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-3.5 pl-9 pr-3 text-sm font-bold focus:border-primary transition-all outline-none appearance-none">
                                                    <option value="" disabled>Select Batch</option>
                                                    <option value="Batch 1">Batch 1</option>
                                                    <option value="Batch 2">Batch 2</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 pt-6">
                                    <button type="button" onClick={() => setStep(2)} className="py-4 px-6 bg-surface border border-outline-variant/20 rounded-2xl font-black text-on-surface-variant hover:bg-surface-container transition-all">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish & Verify</>}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 4 && (
                            <motion.form 
                                key="step4"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-5 flex flex-col justify-center"
                                onSubmit={handleVerifyOtp}
                            >
                                <div className="text-center mb-2">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <p className="text-sm font-bold text-on-surface-variant px-4">
                                        We've sent a 6-digit verification code to <span className="text-on-surface font-black">{email}</span>
                                    </p>
                                </div>

                                <div className="space-y-1.5 px-4">
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456" 
                                        className="w-full bg-surface border border-outline-variant/20 rounded-2xl py-4 px-4 text-center text-3xl tracking-[0.5em] font-black text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                <div className="px-4 mt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || otp.length !== 6}
                                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
