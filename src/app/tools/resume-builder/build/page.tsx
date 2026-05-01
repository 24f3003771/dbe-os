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
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!resume) {
      resetResume();
    }
  }, [resume, resetResume]);

  const downloadPDF = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      // 1. Prepare element for high-quality capture
      const element = exportRef.current;
      element.style.display = "block";
      element.style.visibility = "visible";
      
      // 2. Capture with high scale to avoid blurriness
      const canvas = await html2canvas(element, {
        scale: 3, // High DPI capture
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 15000,
        width: 793.7, // Precise A4 width in px at 96 DPI
        height: 1122.5, // Precise A4 height in px at 96 DPI
      });
      
      element.style.display = "none";
      
      // 3. Generate PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG at max quality
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${resume?.basics.name || 'resume'}_dbeos.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please ensure all data is valid and try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Hidden Export Container - Force absolute dimensions and no transforms */}
      <div 
        ref={exportRef} 
        style={{ 
          position: 'fixed', 
          left: '-5000px', 
          top: '0px', 
          width: '210mm',
          height: '297mm',
          display: 'none',
          padding: 0,
          margin: 0,
          zIndex: -1
        }}
      >
        <ResumePreview />
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
                  <div className="origin-top scale-[0.4] xl:scale-[0.5] 2xl:scale-[0.55] transform-gpu transition-transform">
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
