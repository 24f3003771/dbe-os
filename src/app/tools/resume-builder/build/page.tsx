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
  const { resume, resetResume, template, setTemplate } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!resume) {
      resetResume();
    }
  }, [resume, resetResume]);

  const downloadPDF = () => {
    // 1. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // 2. Get the resume content
    const element = document.getElementById("resume-export-target");
    if (!element) {
      alert("Export engine not ready. Please try again.");
      return;
    }

    setIsExporting(true);

    // 3. Clone content into iframe
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Add necessary styles for printing
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    iframeDoc.write(`
      <html>
        <head>
          <title>${resume?.basics.name || 'Resume'}</title>
          ${styles}
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            #resume-export-target { width: 210mm !important; min-height: 297mm !important; box-shadow: none !important; }
          </style>
        </head>
        <body>
          <div id="print-content">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => {
                window.parent.postMessage('print-done', '*');
              };
              // Fallback for browsers that don't support onafterprint properly
              setTimeout(() => {
                window.parent.postMessage('print-done', '*');
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();

    // 4. Cleanup
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'print-done') {
        setIsExporting(false);
        document.body.removeChild(iframe);
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Hidden Export Target (Strict A4) */}
      <div className="fixed top-0 left-0 w-1 h-1 overflow-hidden pointer-events-none z-[-100] opacity-0">
        <div id="resume-export-target" className="w-[210mm] min-h-[297mm] bg-white">
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
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Resume Builder</h1>
              <p className="text-on-surface-variant font-medium">Create a high-impact, ATS-friendly resume tailored to your target job.</p>
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

         {/* Preview Section */}
         <div className="lg:col-span-6 space-y-6 lg:h-[calc(100vh-250px)] lg:overflow-y-auto custom-scrollbar p-1">
            <div className="lg:sticky lg:top-0 space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Live Preview (A4)</h3>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Auto-Sync</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-surface-container rounded-lg p-1 border border-outline-variant/10">
                    <button onClick={() => setTemplate("template1")} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${template === 'template1' ? 'bg-white shadow text-indigo-600' : 'text-on-surface-variant hover:text-on-surface'}`}>Standard</button>
                    <button onClick={() => setTemplate("template2")} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${template === 'template2' ? 'bg-white shadow text-indigo-600' : 'text-on-surface-variant hover:text-on-surface'}`}>Modern</button>
                    <button onClick={() => setTemplate("template3")} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${template === 'template3' ? 'bg-white shadow text-indigo-600' : 'text-on-surface-variant hover:text-on-surface'}`}>Executive</button>
                  </div>
               </div>
               
               <div className="flex justify-center bg-surface-container rounded-[2.5rem] p-4 md:p-8 border border-outline-variant/10 shadow-inner overflow-hidden">
                  <div className="origin-top scale-[0.35] sm:scale-[0.4] xl:scale-[0.5] 2xl:scale-[0.55] transform-gpu shadow-2xl">
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

