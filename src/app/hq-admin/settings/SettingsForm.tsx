"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ShieldCheck, Mail, AlertTriangle } from "lucide-react";

export default function SettingsForm({ initialRestrictEmails, initialToolsEnabled = true }: { initialRestrictEmails: boolean, initialToolsEnabled?: boolean }) {
    const [restrictEmails, setRestrictEmails] = useState(initialRestrictEmails);
    const [toolsEnabled, setToolsEnabled] = useState(initialToolsEnabled);
    const [isLoading, setIsLoading] = useState(false);
    const [isToolsLoading, setIsToolsLoading] = useState(false);

    const supabase = createClient();

    const toggleRestriction = async () => {
        setIsLoading(true);
        const newValue = !restrictEmails;
        try {
            const { error } = await supabase.from('app_settings').update({ restrict_emails: newValue }).eq('id', 1);
            if (error) throw error;
            setRestrictEmails(newValue);
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings. Please ensure your account has SUPER_ADMIN role.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTools = async () => {
        setIsToolsLoading(true);
        const newValue = !toolsEnabled;
        try {
            const { error } = await supabase.from('app_settings').update({ tools_enabled: newValue }).eq('id', 1);
            if (error) throw error;
            setToolsEnabled(newValue);
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings. Please ensure your account has SUPER_ADMIN role.");
        } finally {
            setIsToolsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Email Restriction */}
            <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm max-w-3xl">
                <div className="flex items-start justify-between gap-6 mb-8 pb-8 border-b border-outline-variant/10">
                    <div>
                        <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Global Email Restriction
                        </h3>
                        <p className="text-sm font-bold text-on-surface-variant mt-2 max-w-xl">
                            When active, only users with an official <strong className="text-on-surface">@iimb.ac.in</strong> email address will be allowed to register or sign in.
                        </p>
                    </div>
                    <button
                        onClick={toggleRestriction}
                        disabled={isLoading}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus:outline-none ${restrictEmails ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    >
                        <span className="sr-only">Toggle Email Restriction</span>
                        {isLoading && <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 className="w-4 h-4 animate-spin text-white" /></div>}
                        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ${restrictEmails ? 'translate-x-3' : '-translate-x-3'}`} />
                    </button>
                </div>
                <div className={`p-5 rounded-2xl border flex gap-4 items-start ${restrictEmails ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-error/5 border-error/20 text-error'}`}>
                    {restrictEmails ? (
                        <>
                            <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-primary" />
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-primary">High Security Mode Active</h4>
                                <p className="text-xs font-bold opacity-80 mt-1">The system is strictly enforcing official institution emails only.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-error" />
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-error">Open Registration Active</h4>
                                <p className="text-xs font-bold opacity-80 mt-1">WARNING: Any user with any email domain can currently register and access the system.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tools Access Restriction */}
            <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm max-w-3xl">
                <div className="flex items-start justify-between gap-6 mb-8 pb-8 border-b border-outline-variant/10">
                    <div>
                        <h3 className="text-xl font-black font-headline text-on-surface flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Tools Hub Access
                        </h3>
                        <p className="text-sm font-bold text-on-surface-variant mt-2 max-w-xl">
                            When active, students can access all Tools. If deactivated, tools show a maintenance overlay. The CGPA Calculator is always accessible regardless.
                        </p>
                    </div>
                    <button
                        onClick={toggleTools}
                        disabled={isToolsLoading}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus:outline-none ${toolsEnabled ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    >
                        <span className="sr-only">Toggle Tools Access</span>
                        {isToolsLoading && <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 className="w-4 h-4 animate-spin text-white" /></div>}
                        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ${toolsEnabled ? 'translate-x-3' : '-translate-x-3'}`} />
                    </button>
                </div>
                <div className={`p-5 rounded-2xl border flex gap-4 items-start ${toolsEnabled ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-error/5 border-error/20 text-error'}`}>
                    {toolsEnabled ? (
                        <>
                            <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-primary" />
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-primary">Tools Active</h4>
                                <p className="text-xs font-bold opacity-80 mt-1">Students can currently access and use all platform tools.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-error" />
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-error">Tools Disabled</h4>
                                <p className="text-xs font-bold opacity-80 mt-1">The Tools hub is locked. Students will see a maintenance overlay. CGPA Calculator remains open.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
