"use client";

import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle, Download, Sparkles, Loader2, Save } from "lucide-react";
import Link from "next/link";
import ResumeEditor from "@/components/tools/resume-builder/Editor/ResumeEditor";
import ResumePreview from "@/components/tools/resume-builder/Preview/ResumePreview";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BuildPage() {
  const { resume, resetResume } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!resume) {
      resetResume();
    }
  }, [resume, resetResume]);

  const downloadPDF = async () => {
    const element = document.getElementById("resume-export-target");
    if (!element) {
      alert("Export engine not ready. Please try again in a moment.");
      return;
    }
    
    setIsExporting(true);

    try {
      // 1. Ensure all fonts are ready
      await document.fonts.ready;
      
      // 2. Small delay to ensure hidden element is fully painted
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Capture with stable settings
      const canvas = await html2canvas(element, {
        scale: 1.5, // Balanced for quality and stability
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794, // 210mm at 96 DPI
        height: 1123, // 297mm at 96 DPI
        windowWidth: 794,
        windowHeight: 1123,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("resume-export-target");
          if (el) {
            el.style.opacity = "1";
            el.style.visibility = "visible";
          }
        }
      });
      
      // 4. Prepare PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.95); // Use JPEG for better compression/stability
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      pdf.save(`${resume?.basics.name || 'resume'}_dbeos.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. If on mobile, please try using a desktop browser or Chrome for the best results.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Hidden Export Target (Strict A4) */}
      <div className="fixed top-0 left-0 w-1 h-1 overflow-hidden pointer-events-none z-[-100] opacity-0.01">
        <div id="resume-export-target" className="w-[794px] min-h-[1123px] bg-white">
          <ResumePreview />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="space-y-4">
          <Link 
            href="/tools/resume-builder"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Back to Forge</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <PlusCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Modern Builder</h1>
              <p className="text-on-surface-variant font-medium">Create a high-impact, ATS-friendly resume from scratch.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={downloadPDF}
             disabled={isExporting}
             className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
           >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Exporting..." : "Download PDF"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Editor Section */}
         <div className="lg:col-span-6 space-y-8 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
            <ResumeEditor />
         </div>

         {/* Preview Sidebar */}
         <div className="lg:col-span-6 hidden lg:block h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar p-1">
            <div className="sticky top-0 space-y-6">
               <div className="flex items-center justify-between px-4 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Live Preview (A4)</h3>
                  <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Auto-Sync</span>
                  </div>
               </div>
               
               <div className="flex justify-center bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-inner overflow-hidden">
                  <div className="origin-top scale-[0.4] xl:scale-[0.5] 2xl:scale-[0.55] transform-gpu shadow-2xl">
                     <ResumePreview />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

