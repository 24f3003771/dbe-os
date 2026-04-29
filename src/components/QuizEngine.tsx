import React, { useState, useEffect, useRef, useCallback } from "react";
import { Question } from "@/data/db";
import { Check, X, ArrowRight, Clock, Flag, Eraser, Eye, LogOut, CheckCircle2, Calculator, Save, RotateCcw, Target, Play, User } from "lucide-react";
import { useFarmStore } from "@/hooks/useFarmStore";
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
    // TODO: Fetch user session from Supabase
    const user = null as any;
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [textAnswers, setTextAnswers] = useState<string[]>(new Array(questions.length).fill(""));
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
        if (question.input_type === "text") {
            const nextText = [...textAnswers];
            nextText[currentIndex] = "";
            setTextAnswers(nextText);
        }
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
                           <div className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-xl bg-surface-container-highest flex items-center justify-center">
                               <User className="w-10 h-10 text-on-surface-variant" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-surface shadow-sm" />
                        </div>
                        <p className="font-black font-headline text-on-surface text-xl text-center mb-1 leading-none">Scholar</p>
                        <p className="text-xs text-on-surface-variant text-center mb-8 font-bold opacity-60">student@iimb.ac.in</p>
                        
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
            <div className="fixed inset-0 z-[70] bg-surface flex flex-col animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-surface-container rounded-[2.5rem] p-8 text-center border-4 border-primary/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-primary text-on-primary text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">Simulator V2.0</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                                <Check className="w-8 h-8 text-white" strokeWidth={4} />
                            </div>
                            <h2 className="text-3xl font-black font-headline text-on-surface mb-2 tracking-tighter italic">Exam Concluded.</h2>
                            
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-[10px] font-black">
                                    <Clock className="w-3.5 h-3.5 text-primary" /> {formatTime(totalTimeSpent)}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10 text-[10px] font-black">
                                    <Target className="w-3.5 h-3.5 text-amber-500" /> {questions.length} Q
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                    <p className="text-xl font-black text-green-500 leading-none">{score}</p>
                                    <p className="text-[7px] font-black uppercase tracking-widest mt-1">Correct</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                    <p className="text-xl font-black text-error leading-none">{questions.length - score}</p>
                                    <p className="text-[7px] font-black uppercase tracking-widest mt-1">Mistakes</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-3 border border-outline-variant/10">
                                    <p className="text-xl font-black text-primary leading-none">{percentage}%</p>
                                    <p className="text-[7px] font-black uppercase tracking-widest mt-1">Accuracy</p>
                                </div>
                            </div>

                            <div className="bg-surface-container-highest/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border-2 border-outline-variant/10 mb-4">
                                <p className="text-[8px] text-secondary font-black uppercase tracking-[0.3em] leading-none">Scholar Harvest</p>
                                <div className="text-3xl font-black font-headline text-secondary tracking-tighter flex items-center gap-2">
                                     <span className="text-xl opacity-50">+</span>{earnedTomatoes} 🍅
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-surface border-2 border-outline-variant/20 font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-primary" /> Retake
                                </button>
                                <button onClick={onComplete} className="flex-[2] py-3 bg-primary text-on-primary font-black text-sm rounded-xl shadow-lg shadow-primary/10 uppercase tracking-widest">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Solutions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black font-headline text-on-surface tracking-tighter italic">Mistake Review</h3>
                            <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-3 py-1 rounded-full">
                                {questions.length - score} items
                            </span>
                        </div>
                        
                        <div className="space-y-4 pb-12">
                            {mistakes.length === 0 ? (
                                <div className="pt-10 flex flex-col items-center justify-center text-center opacity-40">
                                    <CheckCircle2 className="w-12 h-12 mb-3 text-green-500" />
                                    <p className="text-lg font-black uppercase tracking-widest">Perfect Score!</p>
                                </div>
                            ) : (
                                mistakes.map((m) => (
                                    <div key={m.id} className={`p-6 rounded-[2rem] border-2 relative overflow-hidden bg-surface-container shadow-sm ${m.isCorrect ? "border-green-500/10" : "border-error/10"}`}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${m.isCorrect ? "bg-green-500 text-white" : "bg-error text-white"}`}>
                                                {m.id}
                                            </span>
                                            <p className="text-base font-bold text-on-surface leading-snug tracking-tight pt-1">{m.text}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mb-4">
                                            {!m.isCorrect && (
                                                <div className="p-4 rounded-xl bg-error/5 border border-error/10 text-error">
                                                    <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Your Incorrect Response</p>
                                                    <p className="text-xs font-bold italic">{m.your}</p>
                                                </div>
                                            )}
                                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-700">
                                                <p className="text-[7px] font-black uppercase tracking-widest text-green-600/60 mb-1">Correct Solution</p>
                                                <p className="text-xs font-black">{m.correct}</p>
                                            </div>
                                        </div>

                                        {m.explanation && (
                                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary">Scholar's Explanation</p>
                                                </div>
                                                <p className="text-[12px] font-medium text-on-surface-variant leading-relaxed italic">{m.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col md:static md:h-[calc(100vh-140px)] md:inset-auto md:z-auto animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <div className="bg-surface-container border-b border-outline-variant/10 px-4 py-2.5 flex items-center justify-between shrink-0">
                {/* Left: Q counter */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest">Q</span>
                    <span className="font-black text-on-surface text-xs tabular-nums">{currentIndex + 1}</span>
                    <span className="text-[9px] text-on-surface-variant/40 font-bold">/</span>
                    <span className="text-[9px] text-on-surface-variant/60 font-bold tabular-nums">{questions.length}</span>
                </div>

                {/* Right: timers + calculator */}
                <div className="flex items-center gap-3">
                    {/* Total elapsed */}
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary/60" />
                        <span className="font-black text-[11px] text-on-surface tabular-nums">{formatTime(totalTimeSpent)}</span>
                    </div>

                    {timerPerQuestion && (
                        <div className={`flex items-center gap-1 border-l border-outline-variant/20 pl-3 ${questionTimer <= 10 ? "animate-pulse text-error" : "text-on-surface-variant"}`}>
                            <span className="text-[9px] font-black uppercase tracking-wider">Left</span>
                            <span className="font-black text-[11px] tabular-nums">{questionTimer}s</span>
                        </div>
                    )}

                    {/* Calculator */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCalc(!showCalc)}
                            className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${showCalc ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"}`}
                        >
                            <Calculator className="w-3.5 h-3.5" />
                        </button>
                        {showCalc && (
                            <div className="absolute top-10 right-0 z-[110] w-64 bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 p-4 animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-black text-on-surface text-[10px] uppercase tracking-widest">Calc</h3>
                                        <button
                                            onClick={() => setScientificMode(!scientificMode)}
                                            className="text-[8px] font-black text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase"
                                        >
                                            {scientificMode ? "Basic" : "Adv"}
                                        </button>
                                    </div>
                                    <X className="w-3.5 h-3.5 text-on-surface-variant cursor-pointer hover:text-error transition-colors" onClick={() => setShowCalc(false)} />
                                </div>
                                <div className="w-full bg-surface-container-highest text-on-surface font-mono font-bold text-base p-2.5 rounded-xl mb-2 text-right shadow-inner border border-outline-variant/10 min-h-[40px] flex items-center justify-end break-all">
                                    {calcInput || "0"}
                                </div>
                                <div className="grid grid-cols-4 gap-1">
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
            </div>

            {/* Main scrollable area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
                    {/* Question Card */}
                    <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 shadow-sm">
                        {/* Tags row */}
                        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                            {question.type && (
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                    question.type === "cla" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                    question.type === "midterm" ? "bg-purple-50 text-purple-600 border-purple-200" :
                                    question.type === "pyq" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                    "bg-emerald-50 text-emerald-600 border-emerald-200"
                                }`}>
                                    {question.type === "cla" ? "CLA" : question.type === "midterm" ? "Midterm" : question.type === "pyq" ? "PYQ" : "Practice"}
                                </span>
                            )}
                            {question.input_type && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-stone-50 text-stone-500 border-stone-200">
                                    {question.input_type === "mcq" ? "MCQ" : "Subjective"}
                                </span>
                            )}
                            {question.module_from && (
                                <span className="text-[9px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                                    Mod {question.module_from === question.module_to ? question.module_from : `${question.module_from}–${question.module_to}`}
                                </span>
                            )}
                            {question.type === "pyq" && question.pyq_year && (
                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                    {question.pyq_year}{question.pyq_month ? ` · ${question.pyq_month}` : ""}
                                </span>
                            )}
                            {question.input_type === "text" && question.word_limit && (
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                    {question.word_limit} words
                                </span>
                            )}
                        </div>
                        {/* Question text */}
                        <p className="text-sm font-semibold text-on-surface leading-relaxed mb-4 tracking-tight">
                            {question.text}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                            {question.input_type === "text" ? (
                                (() => {
                                    const currentText = textAnswers[currentIndex] || "";
                                    const wordCount = currentText.trim() === "" ? 0 : currentText.trim().split(/\s+/).length;
                                    const limit = question.word_limit || null;
                                    const isOver = limit !== null && wordCount > limit;

                                    const handleTextChange = (val: string) => {
                                        const next = [...textAnswers];
                                        next[currentIndex] = val;
                                        setTextAnswers(next);
                                        // Mark as answered if user has typed something
                                        setStatuses((prev) => {
                                            const ns = [...prev];
                                            ns[currentIndex] = val.trim().length > 0 ? "answered" : "unanswered";
                                            return ns;
                                        });
                                    };

                                    return (
                                        <div className="space-y-2">
                                            <textarea
                                                value={currentText}
                                                onChange={(e) => handleTextChange(e.target.value)}
                                                disabled={submitted}
                                                rows={8}
                                                placeholder="Write your answer here..."
                                                className="w-full p-4 rounded-xl border-2 border-outline-variant/20 bg-surface text-on-surface font-medium text-sm leading-relaxed resize-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/40 disabled:opacity-60"
                                            />
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                                    Word Count
                                                </span>
                                                <span className={`text-xs font-black tabular-nums ${
                                                    isOver ? "text-error" : limit && wordCount >= limit * 0.9 ? "text-amber-500" : "text-on-surface-variant"
                                                }`}>
                                                    {wordCount}{limit ? ` / ${limit}` : ""}
                                                    {isOver && <span className="ml-1 text-[9px]">⚠ Over limit</span>}
                                                </span>
                                            </div>
                                            {showAnswer && question.explanation && (
                                                <div className="mt-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1.5">Model Answer / Explanation</p>
                                                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed italic">{question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()
                            ) : question.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === question.correctAnswer;

                                let btnClass = "w-full p-3 rounded-xl border-2 text-left transition-all relative font-bold group flex items-start gap-3 ";

                                if (showAnswer) {
                                    if (isCorrect) {
                                        btnClass += "bg-green-500/10 border-green-500 text-green-700";
                                    } else if (isSelected && !isCorrect) {
                                        btnClass += "bg-error/10 border-error text-error";
                                    } else {
                                        btnClass += "bg-surface border-outline-variant/10 text-on-surface-variant opacity-40";
                                    }
                                } else if (isSelected) {
                                    btnClass += "bg-primary/5 border-primary text-primary shadow-md shadow-primary/5";
                                } else {
                                    btnClass += "bg-surface border-outline-variant/20 text-on-surface active:scale-[0.99]";
                                }

                                return (
                                    <button key={idx} onClick={() => selectOption(idx)} className={btnClass} disabled={showAnswer}>
                                        <div className={`mt-0.5 w-3.5 h-3.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                            isSelected || (showAnswer && isCorrect) ? "bg-current border-transparent" : "border-outline-variant"
                                        }`}>
                                            {(isSelected || (showAnswer && isCorrect)) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                                        </div>
                                        <span className="flex-1 text-sm leading-tight tracking-tight">{opt}</span>
                                        {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-current mt-0.5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button onClick={markForReview} className="flex-1 py-2 rounded-xl bg-[#9b59b6]/10 text-[#9b59b6] font-black text-[9px] uppercase tracking-widest border border-[#9b59b6]/20 hover:bg-[#9b59b6]/20 transition-all">Review</button>
                        <button onClick={clearResponse} className="flex-1 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface-variant font-black text-[9px] uppercase tracking-widest hover:bg-surface-container transition-all">Reset</button>
                        {mode === "practice" && (
                            <button onClick={() => setShowAnswer(!showAnswer)} className={`flex-1 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${
                                showAnswer ? "bg-primary text-on-primary border-transparent" : "bg-surface border-primary/20 text-primary hover:bg-primary/5"
                            }`}>
                                {showAnswer ? "Hide" : "Answer"}
                            </button>
                        )}
                        <button onClick={submitAndNext} className="flex-[2] py-2.5 rounded-xl bg-primary text-on-primary font-black text-[10px] uppercase tracking-wide shadow-sm shadow-primary/20 flex items-center justify-center gap-1.5 hover:opacity-90 transition-all">
                            {currentIndex === questions.length - 1 ? "Submit" : "Next"} <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Question Palette */}
                    <div className="pt-4 border-t border-outline-variant/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{subjectId} · Module {moduleId}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-[#27ae60]" />
                                    <span className="text-[9px] font-black text-on-surface-variant">{counts.answered}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-[#ff6b6b]" />
                                    <span className="text-[9px] font-black text-on-surface-variant">{counts.unanswered}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-surface-container-highest border border-outline-variant/40" />
                                    <span className="text-[9px] font-black text-on-surface-variant">{counts.notVisited}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-8 sm:grid-cols-12 gap-1">
                            {questions.map((_, i) => {
                                const status = statuses[i];
                                const isCurrent = i === currentIndex;
                                let style = "bg-surface-container-highest text-on-surface-variant border border-outline-variant/30";
                                if (status === "unanswered") style = "bg-[#ff6b6b] text-white border-transparent";
                                if (status === "answered") style = "bg-[#27ae60] text-white border-transparent";
                                if (status === "marked") style = "bg-[#9b59b6] text-white border-transparent";
                                if (status === "answered-marked") style = "bg-[#9b59b6] text-white border-[#27ae60] border-2";
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentIndex(i); if (timerPerQuestion) setQuestionTimer(timerPerQuestion); }}
                                        className={`aspect-square rounded-md text-[9px] font-black flex items-center justify-center transition-all ${style} ${isCurrent ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110 z-10" : "hover:opacity-90"}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button onClick={onComplete} className="flex-1 py-2 rounded-xl bg-error/10 text-error font-black text-[9px] uppercase tracking-wide hover:bg-error/20 transition-all">Abort</button>
                            <button onClick={() => submitAll()} disabled={isSaving} className="flex-[2] py-2 rounded-xl bg-green-600 text-white font-black text-[9px] uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-green-700 transition-all">
                                {isSaving ? "Saving..." : "Submit All"} <Save className="w-3 h-3" />
                            </button>
                        </div>
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
