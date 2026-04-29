"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  RefreshCcw,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  FileText
} from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import { toCanvas } from "html-to-image";

// Data from IIMB BBA DBE Programme Manual
const TERMS_DATA = [
  {
    id: 1,
    title: "Term 1",
    totalCredits: 13.5,
    subjects: [
      { name: "Marketing Fundamentals", credits: 3 },
      { name: "Creativity Mindset for innovation and Imagination", credits: 1.5 },
      { name: "Exploration into Entrepreneurship", credits: 1.5 },
      { name: "Financial Statements and Business Performance", credits: 3 },
      { name: "Foundations of Business Communication I", credits: 1.5 },
      { name: "Business Statistics for Entrepreneurs I", credits: 1.5 },
      { name: "Evolution of Business and Market", credits: 1.5 },
    ]
  },
  {
    id: 2,
    title: "Term 2",
    totalCredits: 15,
    subjects: [
      { name: "Persuasive Communication", credits: 1.5 },
      { name: "Principles of Micro-Economics", credits: 1.5 },
      { name: "Management Accounting", credits: 1.5 },
      { name: "Foundation of Business Communication II", credits: 1.5 },
      { name: "Website Development", credits: 3 },
      { name: "Indian Knowledge System", credits: 3 },
      { name: "Business Statistics for Entrepreneurs II", credits: 1.5 },
      { name: "Venturing on a budget: Rs.250 Venture", credits: 1.5 },
    ]
  },
  {
    id: 3,
    title: "Term 3",
    totalCredits: 16.5,
    subjects: [
      { name: "Design your Thinking", credits: 1.5 },
      { name: "Understanding Indian Culture: Theatre", credits: 3 },
      { name: "Spreadsheets for Business Decisions", credits: 1.5 },
      { name: "Social Media for Marketing", credits: 3 },
      { name: "Entrepreneurial Mindset and Methods", credits: 3 },
      { name: "Exploring Sustainability in the Indian Context", credits: 3 },
      { name: "Business Statistics for Entrepreneurs III", credits: 1.5 },
    ]
  },
  {
    id: 4,
    title: "Term 4",
    totalCredits: 16.5,
    subjects: [
      { name: "Advanced Statistics for Business", credits: 1.5 },
      { name: "Digital Marketing Strategy", credits: 3 },
      { name: "People, Work, and Organizations", credits: 3 },
      { name: "Operations Management", credits: 1.5 },
      { name: "Strategic Management", credits: 3 },
      { name: "Entrepreneurial Methods Hypothesis Testing", credits: 1.5 },
      { name: "Sustainability Measurements for SMEs", credits: 1.5 },
      { name: "Exploring Society & Structure", credits: 1.5 },
    ]
  },
  {
    id: 5,
    title: "Term 5",
    totalCredits: 15,
    subjects: [
      { name: "Digital Design Tools and Documentation", credits: 3 },
      { name: "Generating Entrepreneurial Resources", credits: 3 },
      { name: "Principles of Macroeconomics", credits: 1.5 },
      { name: "New Age Business Models", credits: 3 },
      { name: "Behaviourial Economics", credits: 1.5 },
      { name: "New Product Development", credits: 3 },
    ]
  },
  {
    id: 6,
    title: "Term 6",
    totalCredits: 15,
    subjects: [
      { name: "Supply Chain Management (SCM)", credits: 3 },
      { name: "Growth Hacking", credits: 1.5 },
      { name: "Product Management", credits: 3 },
      { name: "Inclusive Business Models", credits: 3 },
      { name: "Business Research Methods", credits: 1.5 },
      { name: "Project / Do your Venture-1", credits: 3 },
    ]
  },
  {
    id: 7,
    title: "Term 7",
    totalCredits: 15,
    subjects: [
      { name: "Organizational Development", credits: 3 },
      { name: "Sales and Distribution Management (DTC)", credits: 1.5 },
      { name: "Do your Venture-2", credits: 3 },
      { name: "Nature of Languages", credits: 1.5 },
      { name: "Critical Thinking", credits: 1.5 },
      { name: "Big Data Analytics", credits: 3 },
      { name: "Family Business", credits: 1.5 },
    ]
  },
  {
    id: 8,
    title: "Term 8",
    totalCredits: 15,
    subjects: [
      { name: "Customer Relationship Management", credits: 3 },
      { name: "Digital Design Tool 2", credits: 3 },
      { name: "Corporate Finance", credits: 3 },
      { name: "New Age Business Models", credits: 3 },
      { name: "UI/UX Design", credits: 3 },
    ]
  },
  {
    id: 9,
    title: "Term 9",
    totalCredits: 15,
    subjects: [
      { name: "Commercial Environment of Business", credits: 3 },
      { name: "Ethics", credits: 3 },
      { name: "Managing Digital Assets", credits: 1.5 },
      { name: "Exponential Technologies", credits: 1.5 },
      { name: "Mobile Application Development", credits: 1.5 },
      { name: "Project (Mentored)", credits: 4.5 },
    ]
  }
];

const getLetterGrade = (score: number) => {
  if (score >= 90) return { grade: "O", color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 80) return { grade: "A", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 70) return { grade: "B", color: "text-indigo-600", bg: "bg-indigo-50" };
  if (score >= 60) return { grade: "C", color: "text-amber-600", bg: "bg-amber-50" };
  if (score >= 50) return { grade: "D", color: "text-orange-600", bg: "bg-orange-50" };
  if (score >= 40) return { grade: "E", color: "text-stone-600", bg: "bg-stone-50" };
  return { grade: "F", color: "text-red-600", bg: "bg-red-50" };
};

export default function CGPACalculator() {
  const [selectedTerm, setSelectedTerm] = useState(1);
  const [grades, setGrades] = useState<Record<number, Record<string, number>>>({});
  const [activeTab, setActiveTab] = useState<"input" | "summary">("input");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dbe_os_cgpa_data");
    if (saved) {
      try {
        setGrades(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved grades", e);
      }
    }
  }, []);

  const handleMarkChange = (termId: number, subjectName: string, mark: string) => {
    const val = parseFloat(mark);
    if (isNaN(val) && mark !== "") return;

    setGrades(prev => ({
      ...prev,
      [termId]: {
        ...(prev[termId] || {}),
        [subjectName]: isNaN(val) ? 0 : Math.min(100, Math.max(0, val))
      }
    }));
  };

  const saveGrades = () => {
    localStorage.setItem("dbe_os_cgpa_data", JSON.stringify(grades));
    alert("Progress saved to local storage!");
  };

  const calculateTermWAM = (termId: number) => {
    const term = TERMS_DATA.find(t => t.id === termId);
    if (!term) return 0;

    let totalWeightedMarks = 0;
    let totalCredits = 0;

    term.subjects.forEach(sub => {
      const mark = grades[termId]?.[sub.name] || 0;
      totalWeightedMarks += mark * sub.credits;
      totalCredits += sub.credits;
    });

    return totalCredits > 0 ? totalWeightedMarks / totalCredits : 0;
  };

  const calculateOverallWAM = () => {
    let totalWeightedMarks = 0;
    let totalCredits = 0;

    TERMS_DATA.forEach(term => {
      term.subjects.forEach(sub => {
        if (grades[term.id]?.[sub.name]) {
          const mark = grades[term.id][sub.name];
          totalWeightedMarks += mark * sub.credits;
          totalCredits += sub.credits;
        }
      });
    });

    return totalCredits > 0 ? totalWeightedMarks / totalCredits : 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setGrades(data);
        localStorage.setItem("dbe_os_cgpa_data", JSON.stringify(data));
      } catch (err) {
        alert("Invalid file format. Please upload a JSON file exported from this tool.");
      }
    };
    reader.readAsText(file);
  };

  const downloadGrades = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grades));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dbe_os_grades.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const calculateArrears = (year: number) => {
    let totalArrearsCredits = 0;
    const startTerm = (year - 1) * 3 + 1;
    const endTerm = year * 3;

    for (let t = startTerm; t <= endTerm; t++) {
      const term = TERMS_DATA.find(item => item.id === t);
      term?.subjects.forEach(sub => {
        const mark = grades[t]?.[sub.name];
        if (mark !== undefined && mark < 40) {
          totalArrearsCredits += sub.credits;
        }
      });
    }
    return totalArrearsCredits;
  };

  const y1Arrears = calculateArrears(1);
  const y2Arrears = calculateArrears(2);
  const y3Arrears = calculateArrears(3);

  const currentTermWAM = calculateTermWAM(selectedTerm);
  const overallWAM = calculateOverallWAM();
  const overallGrade = getLetterGrade(overallWAM);
  const cgpa10 = overallWAM / 10;

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const element = reportRef.current;
      
      // Use toCanvas from html-to-image for better reliability
      const canvas = await toCanvas(element, {
        backgroundColor: "#FFFCF8",
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DBE_Academic_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Visual PDF generation failed. This can happen on some mobile browsers. Try taking a screenshot or use a desktop browser for the best experience.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Arrears Warning */}
      {(y1Arrears > 6 || y2Arrears > 6) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border-2 border-red-200 p-6 rounded-[2rem] flex items-start gap-4"
        >
          <div className="p-3 bg-red-100 rounded-2xl text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-red-600 uppercase tracking-tight">Academic Arrears Alert</h3>
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              You have <strong>{y1Arrears > 6 ? y1Arrears : y2Arrears} credits</strong> of arrears in Year {y1Arrears > 6 ? '1' : '2'}.
              According to the IIMB BBA DBE manual (Section 2.1), learners with more than 6.0 credits of standing arrears
              at the end of an academic year are mandated to take a term break.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-colors border border-outline-variant/10">
            <ChevronLeft className="w-6 h-6 text-on-surface" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-600">IIMB BBA DBE Utility</span>
            </div>
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">CGPA Calculator</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FileText className="w-4 h-4" /> {isExporting ? 'Generating...' : 'Visual PDF'}
          </button>
          <button
            onClick={saveGrades}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-100 hover:scale-105 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" /> Save Progress
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-12 p-4 md:p-8 rounded-[3rem] bg-[#FFFCF8]">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Overall CGPA */}
          <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">Overall CGPA (10-Point)</p>
              <div className="flex items-end gap-3">
                <h2 className="text-6xl font-black text-on-surface leading-none">{cgpa10.toFixed(2)}</h2>
                <span className="text-sm font-bold text-on-surface-variant mb-2">/ 10.0</span>
              </div>
              <p className="mt-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Weighted Average: {overallWAM.toFixed(2)}%</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full relative z-10">
              <TrendingUp className="w-3 h-3" /> Based on entered marks
            </div>
            <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-amber-500/10 rotate-12" />
          </div>

          {/* Card 2: Letter Grade */}
          <div className={`bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative transition-colors`}>
            <div className="relative z-10">
              <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">Letter Grade</p>
              <div className="flex items-end gap-4">
                <h2 className={`text-6xl font-black ${overallGrade.color} leading-none`}>{overallGrade.grade}</h2>
                <p className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wide">
                  {overallWAM >= 90 ? "Outstanding" :
                    overallWAM >= 80 ? "Excellent" :
                      overallWAM >= 70 ? "Good" :
                        overallWAM >= 60 ? "Satisfactory" :
                          overallWAM >= 40 ? "Pass" : "Arrears"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-on-surface-variant relative z-10">
              <Info className="w-3 h-3" /> As per absolute grading
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${overallGrade.bg} rounded-full blur-2xl opacity-50`} />
          </div>

          {/* Card 3: Credits Tracked */}
          <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Credits Tracked</p>
              <div className="flex items-end gap-2">
                <h2 className="text-6xl font-black text-white leading-none">
                  {TERMS_DATA.reduce((acc, term) => {
                    term.subjects.forEach(sub => {
                      if (grades[term.id]?.[sub.name]) acc += sub.credits;
                    });
                    return acc;
                  }, 0)}
                </h2>
                <span className="text-sm font-bold text-stone-400 mb-2">/ 135.0</span>
              </div>
            </div>
            <div className="mt-6 w-full bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-1000"
                style={{
                  width: `${(TERMS_DATA.reduce((acc, term) => {
                    term.subjects.forEach(sub => {
                      if (grades[term.id]?.[sub.name]) acc += sub.credits;
                    });
                    return acc;
                  }, 0) / 135) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/10">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'input' ? 'text-amber-600 bg-amber-50/30 border-b-4 border-amber-600' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
          >
            Mark Entry
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'summary' ? 'text-amber-600 bg-amber-50/30 border-b-4 border-amber-600' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
          >
            Term Summary
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "input" ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Term Selector */}
                <div className="flex flex-wrap gap-2">
                  {TERMS_DATA.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => setSelectedTerm(term.id)}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedTerm === term.id ? 'bg-on-surface text-surface shadow-lg scale-105' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                      Term {term.id}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                    <div className="col-span-8">Course Name</div>
                    <div className="col-span-1 text-center">Credits</div>
                    <div className="col-span-3 text-right">Marks (0-100)</div>
                  </div>

                  <div className="space-y-3">
                    {TERMS_DATA.find(t => t.id === selectedTerm)?.subjects.map((sub) => (
                      <div key={sub.name} className="grid grid-cols-12 gap-4 items-center bg-surface-container-low/50 border border-outline-variant/10 p-4 rounded-2xl group hover:border-amber-500/20 hover:bg-surface-container-low transition-all">
                        <div className="col-span-8">
                          <p className="text-sm font-bold text-on-surface group-hover:text-amber-600 transition-colors uppercase tracking-tight">{sub.name}</p>
                        </div>
                        <div className="col-span-1 text-center">
                          <span className="text-xs font-bold text-on-surface-variant">{sub.credits.toFixed(1)}</span>
                        </div>
                        <div className="col-span-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${getLetterGrade(grades[selectedTerm]?.[sub.name] || 0).bg} ${getLetterGrade(grades[selectedTerm]?.[sub.name] || 0).color}`}>
                              {getLetterGrade(grades[selectedTerm]?.[sub.name] || 0).grade}
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={grades[selectedTerm]?.[sub.name] === undefined ? "" : grades[selectedTerm]?.[sub.name]}
                              onChange={(e) => handleMarkChange(selectedTerm, sub.name, e.target.value)}
                              className="w-20 bg-surface-container text-right p-3 rounded-xl font-black text-sm outline-none border border-outline-variant/10 focus:border-amber-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Term {selectedTerm} Result</p>
                      <h3 className="text-2xl font-black text-on-surface">{currentTermWAM.toFixed(2)} <span className="text-xs font-bold text-on-surface-variant">WAM</span></h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newGrades = { ...grades };
                        delete newGrades[selectedTerm];
                        setGrades(newGrades);
                      }}
                      className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      title="Clear Term Data"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                    {selectedTerm < 9 && (
                      <button
                        onClick={() => setSelectedTerm(prev => prev + 1)}
                        className="px-8 py-4 bg-on-surface text-surface rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                      >
                        Next Term
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TERMS_DATA.map((term) => {
                    const wam = calculateTermWAM(term.id);
                    const hasData = grades[term.id] && Object.keys(grades[term.id]).length > 0;
                    const grade = getLetterGrade(wam);

                    return (
                      <div
                        key={term.id}
                        className={`p-6 rounded-[2rem] border transition-all ${hasData ? 'bg-surface-container-low border-outline-variant/20' : 'bg-surface-container-lowest border-outline-variant/10 opacity-60'}`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl font-black text-on-surface">{term.title}</h4>
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{term.totalCredits} Credits</p>
                          </div>
                          {hasData && (
                            <div className={`w-10 h-10 ${grade.bg} rounded-xl flex items-center justify-center font-black ${grade.color}`}>
                              {grade.grade}
                            </div>
                          )}
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Performance</p>
                            <p className="text-3xl font-black text-on-surface">
                              {hasData ? wam.toFixed(1) : "---"}
                            </p>
                          </div>
                          <button
                             onClick={() => {
                               setSelectedTerm(term.id);
                               setActiveTab("input");
                             }}
                             className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-on-surface hover:text-surface rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                           >
                             Edit <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 bg-amber-600 text-white rounded-[2rem] p-8 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight">Academic Milestone</h3>
                      <p className="text-amber-100 font-medium">
                        {overallWAM >= 40 ? "You are on track to complete the BBA DBE program with honors." : "Complete more terms to see your overall academic standing."}
                      </p>
                    </div>
                      <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
                        <div className="text-center pr-6 border-r border-white/20">
                           <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">CGPA (10.0)</p>
                           <p className="text-3xl font-black">{cgpa10.toFixed(2)}</p>
                        </div>
                        <div className="text-center pr-6 border-r border-white/20">
                           <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Final WAM</p>
                           <p className="text-3xl font-black">{overallWAM.toFixed(2)}</p>
                        </div>
                        <div className="pl-2 text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Grade</p>
                           <p className="text-3xl font-black">{overallGrade.grade}</p>
                        </div>
                      </div>
                  </div>
                  <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-on-surface-variant/60 text-xs font-medium leading-relaxed">
        <div className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <Info className="w-4 h-4" />
          </div>
          <p>
            This tool uses <strong>Absolute Grading</strong> as per IIMB BBA DBE standards.
            A course is passed only if the learner scores ≥ 40% in CLA AND ≥ 40% in Final Exam.
            This calculator assumes you meet both criteria for the marks entered.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <Award className="w-4 h-4" />
          </div>
          <p>
            Weighted Average Marks (WAM) = Σ(Marks × Credits) / Σ(Credits).
            Term transcripts issued by the institute reflect this weighted average.
            Rounding follows standard IIMB academic practices.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
