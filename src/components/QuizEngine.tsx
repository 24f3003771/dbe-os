import React, { useState, useEffect, useRef, useCallback } from "react";
import { Question } from "@/data/db";
import { Check, X, ArrowRight, Clock, Flag, Eraser, Eye, LogOut, CheckCircle2, Calculator, Save, RotateCcw, Target, Play } from "lucide-react";
import { useFarmStore } from "@/hooks/useFarmStore";
import { useUser } from "@clerk/nextjs";
import { saveExamResult } from "@/actions/quiz";

interface QuizEngineProps {
    subjectId: string;
    moduleId: number;
    questions: Question[];
    mode: "practice" | "exam";
    timerPerQuestion?: number; // 60, 90, 180 or undefined
    onComplete: () => void;
}

type QuestionStatus = "not-visited" | "unanswered" | "answered" | "marked" | "answered-marked";

export default function QuizEngine({ subjectId, moduleId, questions, mode, timerPerQuestion, onComplete }: QuizEngineProps) {
    const { user } = useUser();
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [statuses, setStatuses] = useState<QuestionStatus[]>(
        new Array(questions.length).fill("not-visited")
    );
    const [showAnswer, setShowAnswer] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [questionTimer, setQuestionTimer] = useState(timerPerQuestion || 0);
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    const { earnTomatoes } = useFarmStore();
    const [earnedTomatoes, setEarnedTomatoes] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const [showCalc, setShowCalc] = useState(false);
    const [calcInput, setCalcInput] = useState("");
    const [scientificMode, setScientificMode] = useState(true);

    const handleCalc = (val: string) => {
        if (val === "C") setCalcInput("");
        else if (val === "del") setCalcInput(prev => prev.slice(0, -1));
        else if (val === "=") {
            try {
                // Extended evaluation
                let expression = calcInput
                    .replace(/sin\(/g, "Math.sin(")
                    .replace(/cos\(/g, "Math.cos(")
                    .replace(/tan\(/g, "Math.tan(")
                    .replace(/log\(/g, "Math.log10(")
                    .replace(/ln\(/g, "Math.log(")
                    .replace(/sqrt\(/g, "Math.sqrt(")
                    .replace(/pi/g, "Math.PI")
                    .replace(/e/g, "Math.E")
                    .replace(/\^/g, "**");
                
                const result = new Function('return ' + expression)();
                setCalcInput(String(Math.round(result * 1000000) / 1000000));
            } catch (e) {
                setCalcInput("Error");
            }
        } else {
            if (calcInput === "Error") setCalcInput(val === "(" || val === "sin(" ? val : val);
            else setCalcInput(prev => prev + val);
        }
    };

    const submitAll = useCallback(async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        
        const score = answers.reduce<number>((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setTotalTimeSpent(elapsed);
        
        if (mode === "exam") {
            setIsSaving(true);
            try {
                const mistakes = questions.map((q, i) => ({
                    questionId: i,
                    questionText: q.text,
                    selectedAnswer: answers[i] !== null ? q.options[answers[i]!] : "Unanswered",
                    correctAnswer: q.options[q.correctAnswer],
                    isCorrect: answers[i] === q.correctAnswer,
                    explanation: q.explanation
                })).filter(m => !m.isCorrect);

                await saveExamResult({
                    subject: subjectId,
                    score,
                    totalQuestions: questions.length,
                    timerPerQuestion: timerPerQuestion || 0,
                    mistakes: JSON.stringify(mistakes)
                });
            } catch (error) {
                console.error("Failed to save exam result:", error);
            } finally {
                setIsSaving(false);
            }
        }
        
        try {
            let tomatoes = mode === "exam" ? score * 5 : Math.ceil(score * 1);
            if (tomatoes > 0) {
                earnTomatoes(tomatoes);
                setEarnedTomatoes(tomatoes);
            }
        } catch(e) {
             console.error("Farm store sync error:", e);
        }

        setSubmitted(true);
        setShowCalc(false);
    }, [answers, questions, mode, subjectId, timerPerQuestion, earnTomatoes]);

    const submitAndNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            if (timerPerQuestion) setQuestionTimer(timerPerQuestion);
        } else {
            submitAll();
        }
    }, [currentIndex, questions.length, timerPerQuestion, submitAll]);

    // Question Timer Effect
    useEffect(() => {
        if (showInstructions || submitted || !timerPerQuestion) return;

        if (questionTimer === 0) {
            submitAndNext();
            return;
        }

        questionTimerRef.current = setInterval(() => {
            setQuestionTimer(prev => prev - 1);
        }, 1000);

        return () => {
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        };
    }, [questionTimer, showInstructions, submitted, timerPerQuestion, submitAndNext]);

    // Total Duration Timer
    useEffect(() => {
        if (showInstructions || submitted) return;
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setTotalTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
        
        setStatuses((prev) => {
            const next = [...prev];
            if (next[0] === "not-visited") next[0] = "unanswered";
            return next;
        });

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [showInstructions, submitted]);

    useEffect(() => {
        if (showInstructions) return;
        setStatuses((prev) => {
            const next = [...prev];
            if (next[currentIndex] === "not-visited") next[currentIndex] = "unanswered";
            return next;
        });
        setShowAnswer(false);
    }, [currentIndex, showInstructions]);

    if (questions.length === 0) return <p className="text-on-surface-variant p-8">No questions available.</p>;

    const question = questions[currentIndex];
    const selectedOption = answers[currentIndex];
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const selectOption = (idx: number) => {
        if (submitted) return;
        const next = [...answers];
        next[currentIndex] = idx;
        setAnswers(next);

        setStatuses((prev) => {
            const ns = [...prev];
            ns[currentIndex] = (ns[currentIndex] === "marked" || ns[currentIndex] === "answered-marked") ? "answered-marked" : "answered";
            return ns;
        });

        if (mode === "practice") setShowAnswer(true);
    };

    const clearResponse = () => {
        if (submitted) return;
        const next = [...answers];
        next[currentIndex] = null;
        setAnswers(next);
        setStatuses((prev) => {
            const ns = [...prev];
            ns[currentIndex] = "unanswered";
            return ns;
        });
    };

    const markForReview = () => {
        if (submitted) return;
        setStatuses((prev) => {
            const ns = [...prev];
            ns[currentIndex] = (answers[currentIndex] !== null) ? "answered-marked" : "marked";
            return ns;
        });
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            if (timerPerQuestion) setQuestionTimer(timerPerQuestion);
        }
    };

    const StatusBox = ({ status, num, text }: { status: QuestionStatus, num?: number | string, text?: string }) => {
        let style = "bg-surface-container-highest text-on-surface border border-outline-variant/30";
        if (status === "unanswered") style = "bg-[#ff6b6b] text-white border-transparent";
        if (status === "answered") style = "bg-[#27ae60] text-white border-transparent";
        if (status === "marked") style = "bg-[#9b59b6] text-white border-transparent";
        if (status === "answered-marked") style = "bg-[#9b59b6] text-white border-[#27ae60] border-2 relative";

        return (
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold leading-none shadow-sm ${style}`}>
                    {num || 0}
                    {status === "answered-marked" && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#2ecc71] rounded-full flex items-center justify-center text-white border-[1px] border-surface">
                            <Check className="w-2.5 h-2.5" />
                        </div>
                    )}
                </div>
                {text && <span className="text-sm font-medium text-on-surface">{text}</span>}
            </div>
        );
    };

    if (showInstructions) {
        return (
            <div className="w-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
                <div className="flex-1 bg-surface-container rounded-3xl p-10 border border-outline-variant/10 shadow-sm flex flex-col justify-between min-h-[65vh]">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <Target className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-on-surface font-headline tracking-tight">Instructions</h2>
                                <p className="text-sm text-on-surface-variant font-medium">Please read all instructions carefully before starting.</p>
                            </div>
                        </div>
                        <p className="text-sm text-on-surface-variant font-medium mb-8 leading-relaxed">
                            The Question Palette displayed on the right side of screen will show the status of each question using the following indicators.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatusBox status="not-visited" num={0} text="Not visited yet." />
                            <StatusBox status="unanswered" num={0} text="Visited but not answered." />
                            <StatusBox status="answered" num={0} text="Successfully answered." />
                            <StatusBox status="marked" num={0} text="Marked for review (No ans)." />
                            <div className="md:col-span-2">
                                <StatusBox status="answered-marked" num={0} text="Answered but marked for later review." />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full md:w-[340px] flex flex-col gap-6">
                    <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm flex flex-col items-center">
                        <div className="relative mb-6">
                           <img 
                            src={user?.imageUrl} 
                            className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-xl" 
                            alt={user?.fullName || "Scholar"}
                           />
                           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-surface shadow-sm" />
                        </div>
                        <p className="font-black font-headline text-on-surface text-xl text-center mb-1 leading-none">{user?.fullName || "Scholar"}</p>
                        <p className="text-xs text-on-surface-variant text-center mb-8 font-bold opacity-60">{user?.primaryEmailAddress?.emailAddress}</p>
                        
                        <div className="w-full space-y-4 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                            <div className="flex justify-between items-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 pb-2">
                                <span>Subject</span>
                                <span>Questions</span>
                            </div>
                            <div className="flex justify-between text-sm font-black text-on-surface">
                                <span className="truncate pr-4 uppercase tracking-tight">{subjectId}</span>
                                <span className="tabular-nums">{questions.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setShowInstructions(false)} className="w-full py-5 rounded-2xl bg-primary text-on-primary font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95">
                        Start Simulator
                    </button>
                </div>
            </div>
        );
    }

    const counts = {
        notVisited: statuses.filter((s) => s === "not-visited").length,
        unanswered: statuses.filter((s) => s === "unanswered").length,
        answered: statuses.filter((s) => s === "answered" || s === "answered-marked").length,
        marked: statuses.filter((s) => s === "marked").length,
        answeredMarked: statuses.filter((s) => s === "answered-marked").length,
    };

    if (submitted) {
        const score = answers.reduce<number>((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
        const percentage = Math.round((score / questions.length) * 100);
        const mistakes = questions.map((q, i) => ({
            id: i + 1,
            text: q.text,
            your: answers[i] !== null ? q.options[answers[i]!] : "No Answer",
            yourIdx: answers[i],
            correct: q.options[q.correctAnswer],
            correctIdx: q.correctAnswer,
            explanation: q.explanation,
            isCorrect: answers[i] === q.correctAnswer
        }));

        return (
            <div className="w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700">
                {/* Left Side: Summary Report */}
                <div className="w-full lg:w-[450px] flex flex-col gap-6 h-full overflow-hidden">
                    <div className="bg-surface-container rounded-[2.5rem] p-8 text-center border-4 border-primary/5 shadow-xl relative overflow-hidden group flex flex-col justify-center flex-1">
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-primary text-on-primary text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">Simulator V2.0</span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                             <Target className="w-64 h-64 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                                <Check className="w-10 h-10 text-white" strokeWidth={4} />
                            </div>
                            <h2 className="text-4xl font-black font-headline text-on-surface mb-2 tracking-tighter italic">
                                Exam Concluded.
                            </h2>
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10 text-xs font-black">
                                    <Clock className="w-4 h-4 text-primary" /> {formatTime(totalTimeSpent)}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 rounded-full border border-amber-500/10 text-xs font-black">
                                    <Target className="w-4 h-4 text-amber-500" /> {questions.length} Q
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <div className="bg-surface rounded-2xl p-4 border border-outline-variant/10 shadow-inner">
                                    <p className="text-2xl font-black text-green-500 leading-none">{score}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest mt-1">Correct</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-4 border border-outline-variant/10 shadow-inner">
                                    <p className="text-2xl font-black text-error leading-none">{questions.length - score}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest mt-1">Mistakes</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-4 border border-outline-variant/10 shadow-inner">
                                    <p className="text-2xl font-black text-primary leading-none">{percentage}%</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest mt-1">Accuracy</p>
                                </div>
                            </div>

                            <div className="bg-surface-container-highest/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 border-2 border-outline-variant/10 shadow-inner mb-6">
                                <p className="text-[10px] text-secondary font-black uppercase tracking-[0.4em] leading-none">Scholar Harvest</p>
                                <div className="text-5xl font-black font-headline text-secondary tracking-tighter flex items-center gap-2">
                                     <span className="text-3xl opacity-50">+</span>{earnedTomatoes} 🍅
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 py-4 bg-surface border-2 border-outline-variant/20 text-on-surface font-black rounded-2xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3 uppercase tracking-tighter text-sm shadow-md"
                        >
                            <RotateCcw className="w-5 h-5 text-primary" /> Retake
                        </button>
                        <button
                            onClick={onComplete}
                            className="flex-[2] py-4 bg-primary text-on-primary font-black text-lg rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-center uppercase tracking-tighter"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Right Side: Detailed Analysis (Scrollable) */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-container rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
                    <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low shrink-0">
                         <div className="flex items-center gap-3">
                             <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                             <h3 className="text-xl font-black font-headline text-on-surface tracking-tighter italic">Detailed Analysis</h3>
                        </div>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-4 py-1.5 rounded-full">
                            Mistake Review
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                        {mistakes.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
                                <p className="text-xl font-black uppercase tracking-widest">Perfect Score achieved.</p>
                            </div>
                        ) : (
                            mistakes.map((m) => (
                                <div key={m.id} className={`p-8 rounded-[2rem] border-2 relative overflow-hidden group/mistake ${m.isCorrect ? "bg-green-50/5 border-green-500/10" : "bg-error/5 border-error/10"}`}>
                                    <div className="flex items-start justify-between gap-6 mb-6">
                                        <div className="flex gap-4">
                                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md ${m.isCorrect ? "bg-green-500 text-white" : "bg-error text-white"}`}>
                                                {m.id}
                                            </span>
                                            <p className="text-lg font-bold text-on-surface leading-tight tracking-tight">{m.text}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.isCorrect ? "bg-green-100 text-green-600" : "bg-error/10 text-error"}`}>
                                            {m.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className={`p-5 rounded-2xl border ${m.isCorrect ? "bg-green-500/5 border-green-500/10 text-green-700" : "bg-error/5 border-error/10 text-error"}`}>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Your Selection</p>
                                            <p className="text-sm font-bold italic">{m.your}</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-surface border-2 border-green-500/20">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-green-600 mb-1">Correct Solution</p>
                                            <p className="text-sm font-black text-on-surface">{m.correct}</p>
                                        </div>
                                    </div>

                                    {m.explanation && (
                                        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 shadow-inner">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="w-4 h-4 text-primary" />
                                                <p className="text-[8px] font-black uppercase tracking-widest text-primary">Explanation</p>
                                            </div>
                                            <p className="text-sm font-medium text-on-surface-variant leading-relaxed italic">{m.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300 h-[calc(100vh-140px)] overflow-hidden">
            {/* Control Bar - More Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0">
                <div className="lg:col-span-3 bg-surface-container rounded-2xl px-5 py-3 border border-outline-variant/10 shadow-sm flex flex-col justify-center">
                    <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1 leading-none">COURSE MODULE</p>
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-black w-fit uppercase tracking-tighter border border-primary/20">
                        {subjectId} UNIT 0{moduleId}
                    </div>
                </div>
                
                <div className="lg:col-span-6 bg-surface-container rounded-2xl px-6 py-2 border border-outline-variant/10 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                         <p className="text-[8px] text-on-surface-variant font-black uppercase tracking-widest mb-0.5 leading-none">Elapsed</p>
                         <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-black font-headline text-xl text-on-surface tabular-nums leading-none">{formatTime(totalTimeSpent)}</span>
                         </div>
                    </div>

                    {timerPerQuestion && (
                        <div className="flex flex-col items-center">
                            <p className="text-[8px] text-error font-black uppercase tracking-widest mb-0.5 leading-none">Time Remaining</p>
                            <div className={`flex items-center gap-1.5 ${questionTimer <= 10 ? "animate-pulse text-error" : "text-on-surface"}`}>
                                <span className="font-black font-headline text-2xl tabular-nums leading-none">{questionTimer}s</span>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <button 
                            onClick={() => setShowCalc(!showCalc)} 
                            className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center ${showCalc ? "bg-primary text-on-primary scale-105" : "bg-surface-container-highest text-on-surface hover:bg-surface-container-lowest"}`}
                        >
                            <Calculator className="w-5 h-5" />
                        </button>
                        {showCalc && (
                            <div className="absolute top-12 right-0 z-[110] w-72 bg-surface rounded-[2rem] shadow-2xl border-4 border-outline-variant/10 p-5 animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black font-headline text-on-surface text-xs uppercase tracking-widest">Scientific</h3>
                                        <button 
                                            onClick={() => setScientificMode(!scientificMode)}
                                            className="text-[8px] font-black text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase"
                                        >
                                            {scientificMode ? "Basic" : "Adv"}
                                        </button>
                                    </div>
                                    <X className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-error transition-colors" onClick={() => setShowCalc(false)} />
                                </div>
                                <div className="w-full bg-surface-container-highest text-on-surface font-mono font-bold text-lg p-3 rounded-xl mb-3 text-right shadow-inner border border-outline-variant/10 min-h-[48px] flex items-center justify-end break-all">
                                    {calcInput || "0"}
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {scientificMode && (
                                        <>
                                            {["sin(","cos(","tan(","log(","ln(","sqrt(","pi","^"].map(btn => (
                                                <CalcButton key={btn} val={btn} onClick={handleCalc} scientific />
                                            ))}
                                        </>
                                    )}
                                    {["("," )","del","C"].map(btn => (
                                        <CalcButton key={btn} val={btn} onClick={handleCalc} specialty />
                                    ))}
                                    {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map(btn => (
                                        <CalcButton key={btn} val={btn} onClick={handleCalc} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3 bg-surface-container rounded-2xl px-5 py-2 border border-outline-variant/10 shadow-sm flex items-center gap-3">
                    <img 
                        src={user?.imageUrl} 
                        className="w-10 h-10 rounded-full border border-primary/10" 
                        alt="Profile"
                    />
                    <div className="min-w-0">
                        <p className="font-black font-headline text-on-surface text-xs truncate leading-none mb-0.5">{user?.firstName || "Scholar"}</p>
                        <p className="text-[7px] font-black text-on-surface-variant truncate uppercase tracking-widest bg-primary/5 px-1 rounded italic">Active</p>
                    </div>
                </div>
            </div>

            {/* Main Double Column - Viewport height restricted */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Question Panel */}
                <div className="flex-1 bg-surface-container rounded-[2rem] border border-outline-variant/10 shadow-sm flex flex-col min-w-0 overflow-hidden">
                    <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-0.5 leading-none">Question Palette</span>
                            <h2 className="text-xl font-black font-headline text-on-surface tracking-tighter leading-none">
                                Problem 0{currentIndex + 1}
                            </h2>
                        </div>
                        <span className="px-4 py-1 rounded-xl bg-surface border border-outline-variant/20 text-on-surface-variant text-[8px] font-black uppercase tracking-widest shadow-sm">
                            Single Correct
                        </span>
                    </div>
                    
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="text-xl font-bold text-on-surface leading-snug mb-8 whitespace-pre-wrap font-body max-w-4xl tracking-tight">
                            {question.text}
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 max-w-3xl">
                            {question.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === question.correctAnswer;

                                let btnClass = "w-full p-4 rounded-2xl border-2 text-left transition-all relative font-bold group flex items-start gap-3.5 ";

                                if (showAnswer) {
                                    if (isCorrect) {
                                        btnClass += "bg-green-500/10 border-green-500 text-green-700 shadow-lg shadow-green-500/5";
                                    } else if (isSelected && !isCorrect) {
                                        btnClass += "bg-error/10 border-error text-error shadow-lg shadow-error/5";
                                    } else {
                                        btnClass += "bg-surface border-outline-variant/10 text-on-surface-variant opacity-40";
                                    }
                                } else if (isSelected) {
                                    btnClass += "bg-primary/5 border-primary text-primary shadow-xl shadow-primary/5";
                                } else {
                                    btnClass += "bg-surface border-outline-variant/20 text-on-surface hover:border-primary/50 hover:bg-surface-container-highest active:scale-[0.99]";
                                }

                                return (
                                    <button key={idx} onClick={() => selectOption(idx)} className={btnClass} disabled={showAnswer}>
                                        <div className={`mt-0.5 w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                            isSelected || (showAnswer && isCorrect) ? "bg-current border-transparent" : "border-outline-variant group-hover:border-primary"
                                        }`}>
                                            {(isSelected || (showAnswer && isCorrect)) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                        </div>
                                        <span className="flex-1 text-base leading-snug tracking-tight">{opt}</span>
                                        {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-current mt-0.5" />}
                                        {showAnswer && isSelected && !isCorrect && <X className="w-5 h-5 text-current mt-0.5" />}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {showAnswer && question.explanation && (
                            <div className="mt-8 p-6 rounded-2xl bg-indigo-50/20 border border-indigo-100 italic text-sm font-medium text-on-surface-variant/80">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-indigo-400" />
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Scholar's Lens</p>
                                </div>
                                {question.explanation}
                            </div>
                        )}
                    </div>

                    <div className="p-5 bg-surface-container-low rounded-b-2xl border-t border-outline-variant/10 flex flex-wrap items-center gap-3 shrink-0">
                        <button
                            onClick={markForReview}
                            className="px-4 py-2.5 rounded-xl bg-[#9b59b6]/10 text-[#9b59b6] font-black text-[10px] uppercase tracking-widest hover:bg-[#9b59b6]/20 transition-all border border-[#9b59b6]/20"
                        >
                            Review
                        </button>
                        <button
                            onClick={clearResponse}
                            className="px-4 py-2.5 rounded-xl bg-surface border-2 border-outline-variant/20 text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                        >
                            Reset
                        </button>
                        {mode === "practice" && (
                            <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="px-4 py-2.5 rounded-xl bg-surface border-2 border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all"
                            >
                                {showAnswer ? "Hide Ans" : "Peek Ans"}
                            </button>
                        )}
                        <button
                            onClick={submitAndNext}
                            className="ml-auto px-8 py-3 rounded-xl bg-primary text-on-primary font-black text-sm uppercase tracking-tighter shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {currentIndex === questions.length - 1 ? "Submit" : "Next Problem"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Sidebar Navigation - Viewport height restricted */}
                <div className="w-full lg:w-[320px] flex flex-col gap-4 overflow-hidden shrink-0">
                    {/* Progress Info */}
                    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm shrink-0">
                        <div className="grid grid-cols-2 gap-4">
                            <MiniStat label="Done" val={counts.answered} color="bg-green-500" />
                            <MiniStat label="Left" val={counts.unanswered} color="bg-error" />
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h4 className="font-black text-on-surface text-[10px] uppercase tracking-widest opacity-60">Status Grid</h4>
                            <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-md">{currentIndex + 1}/{questions.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
                            <div className="grid grid-cols-4 gap-2 pb-2">
                                {questions.map((_, i) => {
                                    const status = statuses[i];
                                    const isCurrent = i === currentIndex;
                                    
                                    let style = "bg-surface-container-highest text-on-surface border border-outline-variant/30";
                                    if (status === "unanswered") style = "bg-[#ff6b6b] text-white border-transparent";
                                    if (status === "answered") style = "bg-[#27ae60] text-white border-transparent";
                                    if (status === "marked") style = "bg-[#9b59b6] text-white border-transparent";
                                    if (status === "answered-marked") style = "bg-[#9b59b6] text-white border-[#27ae60] border-2 shadow-md";

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentIndex(i);
                                                if (timerPerQuestion) setQuestionTimer(timerPerQuestion);
                                            }}
                                            className={`relative aspect-square rounded-xl text-xs font-black flex items-center justify-center transition-all ${style} ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-105 z-10" : "hover:scale-105 active:scale-95"}`}
                                        >
                                            {i + 1}
                                            {status === "answered-marked" && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-surface">
                                                    <Check className="w-2 h-2 text-white" strokeWidth={6} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onComplete}
                            className="flex-1 py-3.5 rounded-xl bg-surface border-2 border-error/40 text-error font-black text-[10px] uppercase tracking-tighter hover:bg-error/5 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            onClick={() => submitAll()}
                            disabled={isSaving}
                            className="flex-[2] py-3.5 rounded-xl bg-primary text-on-primary font-black text-xs uppercase tracking-tighter shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isSaving ? "Saving..." : "Submit All"}
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CalcButton({ val, onClick, scientific = false, specialty = false }: { val: string, onClick: (v: string) => void, scientific?: boolean, specialty?: boolean }) {
    let style = "p-3 font-black rounded-xl active:scale-90 transition-all text-sm shadow-sm border border-outline-variant/10 flex items-center justify-center ";
    
    if (val === "=") style += "bg-primary text-on-primary border-transparent col-span-1";
    else if (val === "C") style += "bg-error text-white border-transparent";
    else if (val === "del") style += "bg-error/10 text-error";
    else if (specialty) style += "bg-surface-container-highest text-on-surface-variant";
    else if (scientific) style += "bg-primary/5 text-primary text-[10px] lowercase tracking-tighter";
    else style += "bg-surface text-on-surface hover:bg-surface-container-highest";

    return (
        <button onClick={() => onClick(val)} className={style}>
            {val}
        </button>
    );
}

function ScoreCard({ val, label, color }: { val: string | number, label: string, color: string }) {
    return (
        <div className="bg-surface rounded-3xl p-6 border-2 border-outline-variant/10 shadow-inner">
            <p className={`text-4xl font-black font-headline ${color}`}>{val}</p>
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
}

function MiniStat({ label, val, color }: { label: string, val: number, color: string }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-2xl font-black font-headline text-on-surface tabular-nums">{val}</p>
        </div>
    );
}
