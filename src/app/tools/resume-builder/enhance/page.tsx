"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useRouter } from "next/navigation";

export default function EnhancePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setResume } = useResumeStore();
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to parse resume.";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } else {
          errorMessage = `Server Error (${response.status}): The server encountered an issue. Please try again or check your API key configuration.`;
        }
        throw new Error(errorMessage);
      }

      const structuredData = await response.json();
      setResume(structuredData);
      router.push("/tools/resume-builder/build"); // Redirect to builder for editing
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link 
        href="/tools/resume-builder"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Back to Forge</span>
      </Link>

      <div className="space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">AI ATS Enhancer</h1>
              <p className="text-on-surface-variant font-medium">Upload your resume to fix structure and optimize content.</p>
            </div>
          </div>
        </header>

        <section className="relative">
          <label className={`bg-surface-container-lowest border-2 border-dashed ${error ? 'border-error/50' : 'border-outline-variant/30'} rounded-[3rem] p-12 md:p-20 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all cursor-pointer group relative overflow-hidden`}>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-on-surface">Forging Your Resume...</h2>
                  <p className="text-on-surface-variant">Our AI is extracting data and checking ATS compatibility.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-on-surface">Upload Existing Resume</h2>
                  <p className="text-on-surface-variant max-w-sm mx-auto">
                    Drag and drop your PDF resume here. We'll parse it and check for ATS compatibility.
                  </p>
                </div>
                <div className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                  Select PDF File
                </div>
              </>
            )}
            
            {error && (
              <p className="text-error text-sm font-bold mt-4">{error}</p>
            )}
          </label>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center mt-4">Supports PDF only • Max 5MB</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-surface-container-low p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                 <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-on-surface">Text Extraction</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Our parser extracts text from your PDF and maps it to a structured JSON schema.</p>
           </div>
           <div className="bg-surface-container-low p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-on-surface">ATS Validation</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">We identify layout issues like multi-columns or tables that confuse ATS software.</p>
           </div>
           <div className="bg-surface-container-low p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                 <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-on-surface">AI Bullet Points</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Instantly rewrite weak experience bullets into punchy, action-oriented lines.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
