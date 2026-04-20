import React, { useState, useEffect, useRef } from "react";
import { Question } from "@/data/db";
import { Check, X, ArrowRight, Clock, Flag, Eraser, Eye, LogOut, CheckCircle2, Calculator } from "lucide-react";
import { useFarmStore } from "@/hooks/useFarmStore";

interface QuizEngineProps {
    subjectId: string;
    moduleId: number;
    questions: Question[];
    mode: "practice" | "exam";
    onComplete: () => void;
}

type QuestionStatus = "not-visited" | "unanswered" | "answered" | "marked" | "answered-marked";

export default function QuizEngine({ subjectId, moduleId, questions, mode, onComplete }: QuizEngineProps) {
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [statuses, setStatuses] = useState<QuestionStatus[]>(
        new Array(questions.length).fill("not-visited")
    );
    const [showAnswer, setShowAnswer] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    const { earnTomatoes } = useFarmStore();
    const [earnedTomatoes, setEarnedTomatoes] = useState(0);

    const [showCalc, setShowCalc] = useState(false);
    const [calcInput, setCalcInput] = useState("");

    const handleCalc = (val: string) => {
        if (val === "C") setCalcInput("");
        else if (val === "=") {
            try {
                // Safe basic evaluation
                const result = new Function('return ' + calcInput)();
                setCalcInput(String(Math.round(result * 1000) / 1000));
            } catch (e) {
                setCalcInput("Error");
            }
        } else {
            if (calcInput === "Error") setCalcInput(val);
            else setCalcInput(prev => prev + val);
        }
    };

    // Start timer when instructions are closed
    useEffect(() => {
        if (showInstructions || submitted) return;
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setTotalTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
        
        // Initial question is unanswered if it was not-visited
        setStatuses((prev) => {
            const next = [...prev];
            if (next[0] === "not-visited") {
                next[0] = "unanswered";
            }
            return next;
        });

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [showInstructions, submitted]);

    // Handle index change logic
    useEffect(() => {
        if (showInstructions) return;
        setStatuses((prev) => {
            const next = [...prev];
            if (next[currentIndex] === "not-visited") {
                next[currentIndex] = "unanswered";
            }
            return next;
        });
        setShowAnswer(false);
    }, [currentIndex, showInstructions]);

    if (questions.length === 0) {
        return <p className="text-on-surface-variant">No questions available.</p>;
    }

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
            if (ns[currentIndex] === "marked" || ns[currentIndex] === "answered-marked") {
                ns[currentIndex] = "answered-marked";
            } else {
                ns[currentIndex] = "answered";
            }
            return ns;
        });

        if (mode === "practice") {
            setShowAnswer(true);
        }
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
            if (answers[currentIndex] !== null) {
                ns[currentIndex] = "answered-marked";
            } else {
                ns[currentIndex] = "marked";
            }
            return ns;
        });
        if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const submitAll = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const score = answers.reduce<number>((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setTotalTimeSpent(elapsed);
        
        // Progress persistence disabled for simplified OS
        
        try {
            // Yield tomatoes
            let tomatoes = 0;
            if (mode === "exam") {
                tomatoes = score * 2; // Strict examination high reward
            } else {
                tomatoes = Math.ceil(score * 0.5); // Practice mode low reward
            }
            if (tomatoes > 0) {
                earnTomatoes(tomatoes);
                setEarnedTomatoes(tomatoes);
            }
        } catch(e) {
             console.error("Farm store sync error:", e);
        }

        setSubmitted(true);
    };

    const submitAndNext = () => {
        // Just move to next question if practice/exam, save implicitly
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitAll();
        }
    };

    const StatusBox = ({ status, num, text }: { status: QuestionStatus, num?: number | string, text?: string }) => {
        let style = "bg-surface-container-highest text-on-surface border border-outline-variant/30"; // not visited
        if (status === "unanswered") style = "bg-[#ff6b6b] text-white border-transparent"; // light red
        if (status === "answered") style = "bg-[#27ae60] text-white border-transparent"; // dark green
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
            <div className="w-full flex gap-4 animate-in fade-in duration-300">
                <div className="flex-1 bg-surface-container rounded-2xl p-8 border border-outline-variant/10 shadow-sm flex flex-col justify-between min-h-[60vh]">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface font-headline mb-6">Instructions</h2>
                        <p className="text-sm text-on-surface-variant font-medium mb-6">
                            The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols.
                        </p>
                        <div className="space-y-4">
                            <StatusBox status="not-visited" num={0} text="You have not visited the question." />
                            <StatusBox status="unanswered" num={0} text="You have not answered the question." />
                            <StatusBox status="answered" num={0} text="You have answered the question." />
                            <StatusBox status="marked" num={0} text="You have not answered the question, but have marked for review." />
                            <StatusBox status="answered-marked" num={0} text="You have answered the question, but marked it for review." />
                        </div>
                    </div>
                </div>
                
                <div className="w-[300px] flex flex-col gap-4">
                    <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl text-on-primary font-bold mb-4 shadow-sm">
                            S
                        </div>
                        <p className="font-bold font-headline text-on-surface text-center mb-1">Scholar Profile</p>
                        <p className="text-xs text-on-surface-variant text-center mb-6">scholar@dbe-os.com</p>
                        
                        <div className="w-full space-y-2 mt-auto">
                            <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                                <span>Subject</span>
                                <span>Questions</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-on-surface">
                                <span className="truncate pr-4">{subjectId}</span>
                                <span>{questions.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setShowInstructions(false)} className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold shadow-lg hover:bg-primary/90 transition-colors">
                        Next
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
        const mins = Math.floor(totalTimeSpent / 60);
        const secs = totalTimeSpent % 60;

        return (
            <div className="bg-surface-container rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-500 border border-outline-variant/10 max-w-lg mx-auto shadow-sm">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black font-headline text-on-surface mb-2">
                    {mode === "exam" ? "Exam Complete" : "Practice Complete"}
                </h2>
                <p className="text-on-surface-variant font-medium mb-8 flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> {mins}m {secs}s
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface-container-highest rounded-2xl p-4 border border-outline-variant/5">
                        <p className="text-3xl font-black font-headline text-on-surface">{score}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">Correct</p>
                    </div>
                    <div className="bg-surface-container-highest rounded-2xl p-4 border border-outline-variant/5">
                        <p className="text-3xl font-black font-headline text-on-surface">{questions.length - score}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">Wrong</p>
                    </div>
                    <div className="bg-surface-container-highest rounded-2xl p-4 border border-outline-variant/5">
                        <p className="text-3xl font-black font-headline text-on-surface">{percentage}%</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">Accuracy</p>
                    </div>
                    <div className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/10 col-span-3 mt-4 flex items-center justify-between shadow-inner">
                        <div className="text-left">
                           <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mb-1">Scholar Harvest</p>
                           <p className="text-sm font-bold text-on-surface">Farm update complete</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-4xl font-black font-headline text-secondary flex items-center gap-2">
                                <span>🍅</span> +{earnedTomatoes}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Performance Stats Table */}
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden mb-8 text-left">
                    <div className="grid grid-cols-2 p-4 border-b border-outline-variant/10 bg-surface-container-highest/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Metric</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Performance</span>
                    </div>
                    <div className="divide-y divide-outline-variant/5">
                        <div className="grid grid-cols-2 p-4">
                            <span className="text-sm font-medium text-on-surface-variant">Total Questions</span>
                            <span className="text-sm font-bold text-on-surface text-right">{questions.length}</span>
                        </div>
                        <div className="grid grid-cols-2 p-4">
                            <span className="text-sm font-medium text-on-surface-variant">Time Efficiency</span>
                            <span className="text-sm font-bold text-on-surface text-right">{Math.round(totalTimeSpent / questions.length)}s / q</span>
                        </div>
                        <div className="grid grid-cols-2 p-4">
                            <span className="text-sm font-medium text-on-surface-variant">Reward Tier</span>
                            <span className="text-sm font-bold text-secondary text-right">{mode === "exam" ? "Platinum (2x)" : "Practice (0.5x)"}</span>
                        </div>
                    </div>
                </div>

                <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden mb-8 border border-outline-variant/5">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-[#f39c12]" : "bg-error"}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <button
                    onClick={onComplete}
                    className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                    Return to Overview
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex-col flex gap-4 animate-in fade-in duration-300">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 bg-surface-container rounded-2xl px-5 py-4 border border-outline-variant/10 shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Subject</p>
                    <div className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-sm font-bold w-fit shadow-sm">
                        {subjectId}
                    </div>
                </div>
                <div className="col-span-4 bg-surface-container rounded-2xl px-5 py-4 border border-outline-variant/10 shadow-sm flex items-center justify-center gap-12">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-on-surface" />
                            <span className="font-black font-headline text-xl text-on-surface tracking-tight tabular-nums">{formatTime(totalTimeSpent)}</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Time Spent</span>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => setShowCalc(!showCalc)} 
                            className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center ${showCalc ? "bg-primary text-on-primary scale-110" : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"}`}
                        >
                            <Calculator className="w-5 h-5" />
                        </button>
                        {showCalc && (
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold font-headline text-on-surface text-sm">Calculator</h3>
                                    <X className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-error transition-colors" onClick={() => setShowCalc(false)} />
                                </div>
                                <input type="text" value={calcInput} readOnly className="w-full bg-surface-container-highest text-on-surface font-mono font-bold text-lg p-3 rounded-xl mb-3 text-right focus:outline-none border border-outline-variant/10 shadow-inner" />
                                <div className="grid grid-cols-4 gap-2">
                                    {["7","8","9","/","4","5","6","*","1","2","3","-","C","0","=","+"].map(btn => (
                                        <button key={btn} onClick={() => handleCalc(btn)} className={`p-2 font-bold rounded-lg active:scale-95 transition-all text-sm shadow-sm border border-outline-variant/10 flex items-center justify-center ${btn === "=" ? "bg-primary text-on-primary border-transparent" : btn === "C" ? "bg-error/10 text-error" : "bg-surface text-on-surface hover:bg-surface-container-highest"}`}>
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-4 bg-surface-container rounded-2xl px-5 py-3 border border-outline-variant/10 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg text-on-primary font-bold flex-shrink-0 shadow-sm">
                        S
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold font-headline text-on-surface text-sm truncate">Scholar Mode</p>
                        <p className="text-[10px] text-on-surface-variant truncate">scholar@dbe-os.com</p>
                    </div>
                </div>
            </div>

            {/* Main Double Column */}
            <div className="flex gap-4">
                {/* Left Panel */}
                <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col min-w-0 min-h-[60vh]">
                    <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold font-headline text-on-surface">
                            Q. no {currentIndex + 1} <span className="text-on-surface-variant ml-1 font-medium">MCQ</span>
                        </h2>
                        <span className="px-4 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold font-headline">
                            {(mode === "exam") ? "Score: Variable" : "1 Point"}
                        </span>
                    </div>
                    
                    <div className="p-8 flex-1 overflow-y-auto">
                        <div className="text-lg font-medium text-on-surface leading-loose mb-10 whitespace-pre-wrap">
                            {question.text}
                        </div>

                        <div className="space-y-4">
                            {question.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === question.correctAnswer;

                                let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all relative font-medium text-sm flex items-center gap-4 ";

                                if (showAnswer) {
                                    if (isCorrect) {
                                        btnClass += "bg-[#27ae60]/10 border-[#27ae60] text-[#27ae60]"; // dark green
                                    } else if (isSelected && !isCorrect) {
                                        btnClass += "bg-[#ff6b6b]/10 border-[#ff6b6b] text-[#ff6b6b]"; // light red
                                    } else {
                                        btnClass += "bg-surface border-outline-variant/20 text-on-surface-variant opacity-50";
                                    }
                                } else if (isSelected) {
                                    btnClass += "bg-primary/5 border-primary text-primary";
                                } else {
                                    btnClass += "bg-surface border-outline-variant/30 text-on-surface hover:border-primary/50 hover:bg-surface-container-highest";
                                }

                                return (
                                    <button key={idx} onClick={() => selectOption(idx)} className={btnClass} disabled={showAnswer}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                            isSelected || (showAnswer && isCorrect) ? "border-current" : "border-outline-variant"
                                        }`}>
                                            {(isSelected || (showAnswer && isCorrect)) && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                        </div>
                                        <span className="flex-1 text-base">{opt}</span>
                                        {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-current" />}
                                        {showAnswer && isSelected && !isCorrect && <X className="w-5 h-5 text-current" />}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {showAnswer && question.explanation && (
                            <div className="mt-8 p-6 rounded-2xl bg-surface border-2 border-primary/20 animate-in fade-in duration-300 shadow-inner">
                                <p className="text-[10px] text-primary font-black font-headline uppercase tracking-widest mb-2">Explanation</p>
                                <p className="text-sm text-on-surface font-medium leading-relaxed">{question.explanation}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-surface-container rounded-b-2xl border-t border-outline-variant/10 flex items-center gap-3">
                        <button
                            onClick={markForReview}
                            className="px-5 py-2.5 rounded-xl bg-[#9b59b6]/10 text-[#9b59b6] font-bold text-sm shadow-sm hover:bg-[#9b59b6]/20 transition-colors"
                        >
                            Mark for Review & Next
                        </button>
                        <button
                            onClick={clearResponse}
                            className="px-5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-[#27ae60] font-bold text-sm shadow-sm hover:bg-surface-container-highest transition-colors"
                        >
                            Clear Response
                        </button>
                        <button
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="px-5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-[#27ae60] font-bold text-sm shadow-sm hover:bg-surface-container-highest transition-colors"
                        >
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </button>
                        <button
                            onClick={submitAndNext}
                            className="ml-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
                        >
                            Submit & Next
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-[340px] flex flex-col gap-4">
                    {/* Legand Block */}
                    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <StatusBox status="not-visited" num={counts.notVisited} text="Not Visited" />
                            <StatusBox status="unanswered" num={counts.unanswered} text="Unanswered" />
                            <StatusBox status="answered" num={counts.answered - counts.answeredMarked} text="Answered" />
                            <StatusBox status="marked" num={counts.marked} text="Marked" />
                            <div className="col-span-2">
                                <StatusBox status="answered-marked" num={counts.answeredMarked} text="Answered & Marked for Review" />
                            </div>
                        </div>
                    </div>

                    {/* Question Palette Grid */}
                    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm flex-1 flex flex-col min-h-0">
                        <p className="font-bold font-headline text-on-surface mb-4">Question Palette</p>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar content-start">
                            <div className="grid grid-cols-5 gap-3">
                                {questions.map((_, i) => {
                                    const status = statuses[i];
                                    const isCurrent = i === currentIndex;
                                    
                                    let style = "bg-surface-container-highest text-on-surface border border-outline-variant/30";
                                    if (status === "unanswered") style = "bg-[#ff6b6b] text-white border-transparent shadow-sm"; // light red
                                    if (status === "answered") style = "bg-[#27ae60] text-white border-transparent shadow-sm"; // dark green
                                    if (status === "marked") style = "bg-[#9b59b6] text-white border-transparent shadow-sm";
                                    if (status === "answered-marked") style = "bg-[#9b59b6] text-white border-[#27ae60] border-2 shadow-sm"; // dark green border

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`relative aspect-square rounded-xl text-base font-bold flex items-center justify-center transition-all ${style} ${isCurrent ? "ring-2 ring-offset-2 ring-offset-surface ring-primary scale-[1.12]" : "hover:scale-105"}`}
                                        >
                                            {i + 1}
                                            {status === "answered-marked" && (
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#27ae60] rounded-full flex items-center justify-center text-white border border-surface">
                                                    <Check className="w-2.5 h-2.5" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Final Actions Block */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onComplete}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface border-2 border-error text-error text-sm font-bold shadow-sm hover:bg-error/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Exit Exam
                        </button>
                        <button
                            onClick={() => submitAll()}
                            className="py-3 rounded-xl bg-primary text-on-primary border border-transparent text-sm font-bold shadow-sm hover:brightness-110 active:scale-95 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
