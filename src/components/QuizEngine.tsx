import React, { useState, useEffect, useRef, useCallback } from "react";
import { Question } from "@/data/db";
import { Check, X, ArrowRight, Clock, Flag, Eraser, Eye, LogOut, CheckCircle2, Calculator, Save, RotateCcw, Target, Play, User } from "lucide-react";
import { useFarmStore } from "@/hooks/useFarmStore";
import { saveExamResult, QuestionResponse } from "@/actions/quiz";
import { evaluateTextAnswer } from "@/actions/ai-evaluate";
import { createClient } from "@/utils/supabase/client";

interface QuizEngineProps {
    subjectId: string;        // subject code e.g. "ES21X"
    subjectTitle?: string;    // e.g. "Entrepreneurship"
    moduleId: number;
    moduleTitle?: string;     // e.g. "MOC1 – Financing Basics"
    quizSetId?: string;       // for linking exam results to a specific set
    questions: Question[];
    mode: "practice" | "exam";
    quizSubMode?: "practice" | "ai" | "exam-set"; // for detailed event logging
    examDurationSeconds?: number;
    showCalculator?: boolean;
    negativeMarking?: boolean;
    negMarkingValue?: string;
    onComplete: () => void;
}

type QuestionStatus = "not-visited" | "unanswered" | "answered" | "marked" | "answered-marked";

export default function QuizEngine({ subjectId, subjectTitle, moduleId, moduleTitle, quizSetId, quizSubMode, questions, mode, examDurationSeconds, showCalculator = false, negativeMarking = false, negMarkingValue = "1/3", onComplete }: QuizEngineProps) {
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
    const [examTimer, setExamTimer] = useState(examDurationSeconds || 0);
    const [currentQuestionTimer, setCurrentQuestionTimer] = useState(0);

    // Per-question time tracking
    const [questionTimes, setQuestionTimes] = useState<number[]>(new Array(questions.length).fill(0));
    const questionStartTimeRef = useRef<number>(Date.now());
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const examTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    const { earnTomatoes } = useFarmStore();
    const [earnedTomatoes, setEarnedTomatoes] = useState(0);
    // Persists the final computed score (AI-graded text + MCQ) for the results screen
    const [finalDisplayScore, setFinalDisplayScore] = useState<{ raw: number; percentage: number } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false); // AI grading text answers

    const [finalTiming, setFinalTiming] = useState<number[] | null>(null);

    const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData({
                    name: user.user_metadata?.full_name || user.user_metadata?.name || "Scholar",
                    email: user.email || "student@iimb.ac.in"
                });
            }
        };
        fetchUser();
    }, []);

    const [showCalc, setShowCalc] = useState(false);
    const [calcInput, setCalcInput] = useState("");
    const [scientificMode, setScientificMode] = useState(true);
    const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

    const handleCalc = (val: string) => {
        if (val === "C") setCalcInput("");
        else if (val === "del") setCalcInput(prev => prev.slice(0, -1));
        else if (val === "=") {
            try {
                // Extended evaluation
                const expression = calcInput
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

    // Per-question AI evaluation cache (fires in background on Next)
    // Key = question index, Value = Promise resolving to AiEvalResult
    const aiEvalPromisesRef = useRef<Map<number, Promise<{ percentage: number; feedback: string }>>>(new Map());
    const aiEvalResultsRef  = useRef<Map<number, { percentage: number; feedback: string }>>(new Map());
    const [aiEvaluatingSet, setAiEvaluatingSet] = useState<Set<number>>(new Set());

    // Record time spent on the current question before navigating away
    const recordQuestionTime = useCallback((index: number) => {
        const now = Date.now();
        const spent = Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000));
        setQuestionTimes(prev => {
            const next = [...prev];
            next[index] = (next[index] || 0) + spent;
            return next;
        });
        questionStartTimeRef.current = now;
        setCurrentQuestionTimer(0);
    }, []);

    // Trigger AI evaluation in the background when user leaves a text question.
    // Fires once per question (guarded by aiEvalPromisesRef).
    const triggerAiEvalIfNeeded = useCallback((index: number) => {
        const q = questions[index];
        if (q?.input_type !== "text") return;           // MCQ — skip
        if (!textAnswers[index]?.trim()) return;        // blank answer — skip
        if (!q.explanation) return;                     // no model answer — skip
        if (aiEvalPromisesRef.current.has(index)) return; // already triggered

        // Mark as evaluating in UI
        setAiEvaluatingSet(prev => new Set([...prev, index]));

        const promise = evaluateTextAnswer({
            question: q.text,
            userAnswer: textAnswers[index],
            modelAnswer: q.explanation,
        }).then(result => {
            aiEvalResultsRef.current.set(index, result);
            setAiEvaluatingSet(prev => { const s = new Set(prev); s.delete(index); return s; });
            return result;
        }).catch(err => {
            console.error(`[AI Eval] Q${index + 1} failed:`, err);
            const fallback = { percentage: 0, feedback: "AI evaluation failed." };
            aiEvalResultsRef.current.set(index, fallback);
            setAiEvaluatingSet(prev => { const s = new Set(prev); s.delete(index); return s; });
            return fallback;
        });

        aiEvalPromisesRef.current.set(index, promise);
    }, [mode, questions, textAnswers]);

    const submitAll = useCallback(async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (examTimerRef.current) clearInterval(examTimerRef.current);

        // Record time for the last viewed question before submitting
        const now = Date.now();
        const finalTimes = [...questionTimes];
        const lastSpent = Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000));
        finalTimes[currentIndex] = (finalTimes[currentIndex] || 0) + lastSpent;
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setTotalTimeSpent(elapsed);

        // ── Step 1: Build initial response objects ─────────────────────────────
        let responses: QuestionResponse[] = questions.map((q, i) => {
            const timeTaken = finalTimes[i] || 0;
            if (q.input_type === "text") {
                return {
                    inputType: "text" as const,
                    questionId: q.id ?? String(i),
                    questionText: q.text,
                    writtenAnswer: textAnswers[i]?.trim() || null,
                    wordLimit: q.word_limit ?? null,
                    explanation: q.explanation ?? null,
                    timeTaken,
                    isCorrect: null as null,
                    ai_grade: null as number | null,
                    ai_feedback: null as string | null,
                };
            } else {
                const selectedIdx = answers[i];
                return {
                    inputType: "mcq" as const,
                    questionId: q.id ?? String(i),
                    questionText: q.text,
                    options: q.options,
                    selectedIndex: selectedIdx,
                    selectedAnswer: selectedIdx !== null ? q.options[selectedIdx] : null,
                    correctIndex: q.correctAnswer,
                    correctAnswer: q.options[q.correctAnswer],
                    isCorrect: selectedIdx === q.correctAnswer,
                    timeTaken,
                    explanation: q.explanation ?? null,
                };
            }
        });

        // ── Step 2: Wait for any still-pending AI evaluations ──────────────
        const pendingIndices = [...aiEvalPromisesRef.current.entries()]
            .filter(([idx]) => !aiEvalResultsRef.current.has(idx))
            .map(([, promise]) => promise);

        if (pendingIndices.length > 0) {
            setIsEvaluating(true);
            try {
                await Promise.all(pendingIndices);
            } catch (e) {
                console.error("[AI Eval] Some evaluations failed on submit:", e);
            } finally {
                setIsEvaluating(false);
            }
        }

        // Attach cached AI grades to text responses
        responses = responses.map((r, i) => {
            if (r.inputType !== "text") return r;
            const cached = aiEvalResultsRef.current.get(i);
            return { ...r, ai_grade: cached?.percentage ?? null, ai_feedback: cached?.feedback ?? null };
        });

        // ── Step 3: Compute final mixed score ──────────────────────────
        let negPenalty = 0;
        if (negativeMarking) {
            if (negMarkingValue === "1/2") negPenalty = 1/2;
            else if (negMarkingValue === "1/4") negPenalty = 1/4;
            else negPenalty = 1/3;
        }

        const finalScore = responses.reduce((acc, r) => {
            if (r.inputType === "mcq") {
                if (r.isCorrect) return acc + 1;
                if (r.isCorrect === false && negativeMarking && r.selectedAnswer !== null) return acc - negPenalty;
                return acc;
            }
            if (r.inputType === "text") return acc + Math.max(0, (r.ai_grade ?? 0) / 100);
            return acc;
        }, 0);

        const totalTimeFromQuestions = finalTimes.reduce((a, b) => a + b, 0);
        const avgTimePerQ = questions.length > 0 ? Math.round(totalTimeFromQuestions / questions.length) : 0;

        if (mode === "exam") {
            const tomatoes = Math.round(2 * questions.length + finalScore * 5);
            
            // ── Step 5: Save to DB ────────────────────────────────────
            setIsSaving(true);
            try {
                await saveExamResult({
                    subject: subjectId,
                    score: Math.round(finalScore * 100) / 100,
                    totalQuestions: questions.length,
                    timerPerQuestion: avgTimePerQ,
                    totalTimeTaken: totalTimeFromQuestions,
                    responses,
                    tomatoesEarned: tomatoes,
                    quizSetId: quizSetId,
                });
            } catch (error) {
                console.error("Failed to save exam result:", error);
            } finally {
                setIsSaving(false);
            }

            // ── Step 6: Award Tomatoes ────────────────────────────────
            try {
                if (tomatoes > 0) {
                    earnTomatoes({
                        actionType: "exam",
                        description: `Attempted ${subjectId} Exam Mode`,
                        tomatoes,
                        metadata: { score: finalScore, totalQuestions: questions.length },
                    });
                    setEarnedTomatoes(tomatoes);
                }
            } catch (e) {
                console.error("Tomato award error:", e);
            }
        } else {
            // Practice/AI mode — (1 * questions.length) + (finalScore * 2)
            const practiceTomatoes = Math.round(questions.length + (finalScore * 2));
            try {
                if (practiceTomatoes > 0) {
                    const isAi = quizSubMode === "ai";
                    earnTomatoes({
                        actionType: isAi ? "ai_builder" : "practice",
                        description: `Attempted ${isAi ? "AI Concept Builder" : "Practice Mode"} · ${subjectId}`,
                        tomatoes: practiceTomatoes,
                        metadata: { score: finalScore, totalQuestions: questions.length },
                    });
                    setEarnedTomatoes(practiceTomatoes);
                }
            } catch (e) {
                console.error("Tomato award error:", e);
            }
        }

        setFinalTiming(finalTimes);
        setFinalDisplayScore({
            raw: finalScore,
            percentage: Math.round((finalScore / questions.length) * 100),
        });
        setSubmitted(true);
        setShowCalc(false);
    }, [
        currentIndex, questionTimes, questions, answers, textAnswers, 
        mode, quizSubMode, subjectId, subjectTitle, moduleTitle, 
        negativeMarking, negMarkingValue, quizSetId, examDurationSeconds,
        earnTomatoes, setSubmitted, setTotalTimeSpent, setEarnedTomatoes, setFinalTiming, setShowCalc
    ]);

    const submitAndNext = useCallback(() => {
        triggerAiEvalIfNeeded(currentIndex);   // fire AI eval in background if text Q
        if (currentIndex < questions.length - 1) {
            recordQuestionTime(currentIndex);  // ONLY save if moving to next Q
            setCurrentIndex(prev => prev + 1);
        } else {
            submitAll(); // submitAll handles the time recording for the final question
        }
    }, [currentIndex, questions.length, recordQuestionTime, triggerAiEvalIfNeeded, submitAll]);

    // Use a ref for submitAndNext to avoid dependency loops in the timer effect
    const submitAndNextRef = useRef(submitAndNext);
    useEffect(() => {
        submitAndNextRef.current = submitAndNext;
    }, [submitAndNext]);

    // Total Exam Countdown Timer Effect
    useEffect(() => {
        if (showInstructions || submitted || mode !== "exam" || !examDurationSeconds) return;

        examTimerRef.current = setInterval(() => {
            setExamTimer(prev => {
                if (prev <= 1) {
                    // Time's up for the whole exam!
                    setTimeout(() => submitAll(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (examTimerRef.current) clearInterval(examTimerRef.current);
        };
    }, [showInstructions, submitted, mode, examDurationSeconds, submitAll]);

    // Total Duration Timer
    useEffect(() => {
        if (showInstructions || submitted) return;
        startTimeRef.current = Date.now();
        questionStartTimeRef.current = Date.now(); // start per-question timer for Q1
        timerRef.current = setInterval(() => {
            const now = Date.now();
            setTotalTimeSpent(Math.floor((now - startTimeRef.current) / 1000));
            setCurrentQuestionTimer(Math.floor((now - questionStartTimeRef.current) / 1000));
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
            <div className="w-full h-full flex flex-col-reverse md:flex-row gap-6 animate-in fade-in duration-300 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
                <div className="flex-1 bg-surface-container rounded-3xl p-6 md:p-10 border border-outline-variant/10 shadow-sm flex flex-col justify-between min-h-[65vh] shrink-0">
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
                
                <div className="w-full md:w-[340px] flex flex-col gap-6 shrink-0">
                    <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm flex flex-col items-center">
                        <div className="relative mb-6">
                           <div className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-xl bg-surface-container-highest flex items-center justify-center">
                               <User className="w-10 h-10 text-on-surface-variant" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-surface shadow-sm" />
                        </div>
                        <p className="font-black font-headline text-on-surface text-xl text-center mb-1 leading-none">{userData?.name || "Scholar"}</p>
                        <p className="text-xs text-on-surface-variant text-center mb-8 font-bold opacity-60">{userData?.email || "student@iimb.ac.in"}</p>
                        
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
        // Use AI-graded finalScore for exam mode; fall back to MCQ-only count for practice
        const score = finalDisplayScore?.raw ?? answers.reduce<number>((acc, ans, i) => acc + (ans === questions[i]?.correctAnswer ? 1 : 0), 0);
        const percentage = finalDisplayScore?.percentage ?? Math.round((score / questions.length) * 100);
        const mistakes = questions.map((q, i) => ({
            id: i + 1,
            text: q.text,
            isText: q.input_type === "text",
            your: q.input_type === "text"
                ? (textAnswers[i]?.trim() || "No Answer")
                : (answers[i] !== null ? q.options[answers[i]!] : "No Answer"),
            yourIdx: answers[i],
            correct: q.input_type === "text" ? (q.explanation ?? "See model answer") : q.options[q.correctAnswer],
            correctIdx: q.correctAnswer,
            explanation: q.input_type === "text" ? null : q.explanation,
            isCorrect: q.input_type === "text" ? null : answers[i] === q.correctAnswer,
            timeTaken: finalTiming ? finalTiming[i] : (questionTimes[i] || 0),
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
                            <div className="mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{subjectTitle || subjectId}</span>
                                <h2 className="text-3xl font-black font-headline text-on-surface tracking-tighter italic leading-none mt-1">
                                    {quizSubMode === "exam-set" ? "Exam Mode" : quizSubMode === "ai" ? "AI Concept Builder" : "Practice Mode"}
                                </h2>
                                {moduleTitle && <p className="text-[10px] font-bold text-on-surface-variant mt-1 uppercase tracking-tight">{moduleTitle}</p>}
                            </div>
                            
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
                                {mode !== "exam" && (
                                    <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-surface border-2 border-outline-variant/20 font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                        <RotateCcw className="w-4 h-4 text-primary" /> Retake
                                    </button>
                                )}
                                <button onClick={onComplete} className={`${mode === "exam" ? "w-full" : "flex-[2]"} py-3 bg-primary text-on-primary font-black text-sm rounded-xl shadow-lg shadow-primary/10 uppercase tracking-widest`}>
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
                                    <div key={m.id} className={`p-6 rounded-[2rem] border-2 relative overflow-hidden bg-surface-container shadow-sm ${m.isCorrect === true ? "border-green-500/10" : m.isCorrect === false ? "border-error/10" : "border-primary/10"}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${m.isCorrect === true ? "bg-green-500 text-white" : m.isCorrect === false ? "bg-error text-white" : "bg-primary/20 text-primary"}`}>
                                                        {m.id}
                                                    </span>
                                                    <p className="text-base font-bold text-on-surface leading-snug tracking-tight pt-1">{m.text}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-outline-variant/10 shadow-sm flex-shrink-0">
                                                    <Clock className="w-3 h-3 text-on-surface-variant/50" />
                                                    <span className="text-[10px] font-black tabular-nums">{m.timeTaken}s</span>
                                                </div>
                                            </div>

                                        <div className="grid grid-cols-1 gap-3 mb-4">
                                            {/* MCQ: show selected wrong answer */}
                                            {m.isCorrect === false && (
                                                <div className="p-4 rounded-xl bg-error/5 border border-error/10 text-error">
                                                    <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Your Incorrect Response</p>
                                                    <p className="text-xs font-bold italic">{m.your}</p>
                                                </div>
                                            )}
                                            {/* Text: show written answer */}
                                            {m.isText && (
                                                <div className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/20">
                                                    <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Your Written Answer</p>
                                                    <p className="text-xs font-medium italic text-on-surface-variant">{m.your}</p>
                                                </div>
                                            )}
                                            {/* MCQ: show correct option | Text: show model answer */}
                                            <div className={`p-4 rounded-xl ${m.isText ? "bg-primary/5 border border-primary/10 text-primary" : "bg-green-500/5 border border-green-500/20 text-green-700"}`}>
                                                <p className={`text-[7px] font-black uppercase tracking-widest mb-1 ${m.isText ? "text-primary/60" : "text-green-600/60"}`}>{m.isText ? "Model Answer" : "Correct Solution"}</p>
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

    const StatusPill = ({ count, label, colorClass, hasTick = false }: { count: number, label: string, colorClass: string, hasTick?: boolean }) => (
        <div className="flex items-center gap-3">
            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${colorClass}`}>
                {count}
                {hasTick && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-[1.5px] border-surface flex items-center justify-center">
                        <Check className="w-2 h-2 text-surface" strokeWidth={4} />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant leading-tight flex-1">{label}</span>
        </div>
    );

    return (
        <div className="w-full flex-1 min-h-0 flex flex-col bg-surface relative z-10 overflow-hidden animate-in fade-in duration-300">
            {/* Top Header - Exam Style */}
            <div className="bg-surface-container border-b border-outline-variant/20 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm relative z-20">
                {/* Left: Subject / Module */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-sm font-black font-headline text-on-surface tracking-widest">{subjectTitle || subjectId}</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{moduleTitle || (quizSubMode === 'exam-set' ? "Full Exam" : "Practice")}</span>
                </div>

                {/* Center: Timer & Calc */}
                <div className="hidden md:flex items-center gap-6 bg-surface-container-highest/30 px-6 py-2 rounded-2xl border border-outline-variant/10 shadow-inner">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-black text-sm text-on-surface tabular-nums">{formatTime(currentQuestionTimer + (questionTimes[currentIndex] || 0))}</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/70 mt-0.5">Time Spent</span>
                    </div>

                    {mode === "exam" && examDurationSeconds && (
                        <div className={`flex flex-col items-center border-l border-outline-variant/20 pl-6 ${examTimer <= 60 ? "text-error animate-pulse" : "text-amber-600"}`}>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-black text-sm tabular-nums">{formatTime(examTimer)}</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-80 mt-0.5">Time Left</span>
                        </div>
                    )}

                    {/* Calculator Toggle */}
                    {showCalculator && (
                        <div className="relative border-l border-outline-variant/20 pl-6">
                            <button
                                onClick={() => setShowCalc(!showCalc)}
                                className={`p-2 rounded-xl transition-all flex items-center justify-center ${showCalc ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-surface text-on-surface hover:bg-surface-container-highest shadow-sm border border-outline-variant/10"}`}
                            >
                                <Calculator className="w-4 h-4" />
                            </button>
                            {showCalc && (
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[110] w-64 bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 p-4 animate-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-black text-on-surface text-[10px] uppercase tracking-widest">Calc</h3>
                                            <button onClick={() => setScientificMode(!scientificMode)} className="text-[8px] font-black text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase">
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
                    )}
                </div>

                {/* Right: User */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-xs font-black text-on-surface uppercase tracking-tight">{userData?.name || "Scholar"}</span>
                        <span className="text-[9px] font-bold text-on-surface-variant">{userData?.email}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg border-2 border-primary/20 shadow-sm shrink-0">
                        {(userData?.name || "S").charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Split Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-surface-container-lowest relative z-10">
                {/* Left Panel (Question Area) */}
                <div className="flex-1 flex flex-col overflow-hidden border-r border-outline-variant/10">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                        <div className="max-w-4xl mx-auto w-full">
                            {/* Question Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-outline-variant/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Question {currentIndex + 1}</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border border-outline-variant/10">
                                        Of {questions.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {question.type && (
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                            question.type === "cla" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                            question.type === "midterm" ? "bg-purple-50 text-purple-600 border-purple-200" :
                                            question.type === "exam" ? "bg-rose-50 text-rose-600 border-rose-200" :
                                            "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        }`}>
                                            {question.type === "cla" ? "CLA" : question.type === "midterm" ? "Midterm" : question.type === "exam" ? "Exam Set" : "Practice"}
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
                                    {(question.type === "cla" || question.type === "midterm") && question.batch && (
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-amber-50 text-amber-600 border-amber-200">
                                            {question.batch}
                                        </span>
                                    )}
                                    {question.input_type === "text" && question.word_limit && (
                                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                            {question.word_limit} words
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="text-lg md:text-xl font-medium text-on-surface leading-relaxed tracking-tight mb-8">
                                    {question.text}
                                </p>

                                <div className="grid grid-cols-1 gap-3">
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
                                                setStatuses((prev) => {
                                                    const ns = [...prev];
                                                    // Preserve marked state if it exists
                                                    const isMarked = ns[currentIndex] === "marked" || ns[currentIndex] === "answered-marked";
                                                    if (val.trim().length > 0) {
                                                        ns[currentIndex] = isMarked ? "answered-marked" : "answered";
                                                    } else {
                                                        ns[currentIndex] = isMarked ? "marked" : "unanswered";
                                                    }
                                                    return ns;
                                                });
                                            };

                                            return (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={currentText}
                                                        onChange={(e) => handleTextChange(e.target.value)}
                                                        disabled={submitted}
                                                        rows={12}
                                                        placeholder="Type your comprehensive answer here..."
                                                        className="w-full p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface text-on-surface font-medium text-base leading-relaxed resize-none outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/40 disabled:opacity-60 shadow-inner"
                                                    />
                                                    <div className="flex items-center justify-between px-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                                            Word Count
                                                        </span>
                                                        <span className={`text-sm font-black tabular-nums ${
                                                            isOver ? "text-error" : limit && wordCount >= limit * 0.9 ? "text-amber-500" : "text-on-surface-variant"
                                                        }`}>
                                                            {wordCount}{limit ? ` / ${limit}` : ""}
                                                            {isOver && <span className="ml-2 text-[10px]">⚠ Exceeded limit</span>}
                                                        </span>
                                                    </div>
                                                    {showAnswer && question.explanation && (
                                                        <div className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 animate-in fade-in">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Eye className="w-4 h-4 text-primary" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Model Answer / Explanation</p>
                                                            </div>
                                                            <p className="text-sm font-medium text-on-surface-variant leading-relaxed italic">{question.explanation}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()
                                    ) : question.options.map((opt, idx) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrect = idx === question.correctAnswer;

                                        let btnClass = "w-full p-4 rounded-2xl border-2 text-left transition-all relative font-bold group flex items-start gap-4 ";

                                        if (showAnswer) {
                                            if (isCorrect) {
                                                btnClass += "bg-green-500/10 border-green-500 text-green-700 shadow-md shadow-green-500/10";
                                            } else if (isSelected && !isCorrect) {
                                                btnClass += "bg-error/10 border-error text-error";
                                            } else {
                                                btnClass += "bg-surface border-outline-variant/10 text-on-surface-variant opacity-50";
                                            }
                                        } else if (isSelected) {
                                            btnClass += "bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10 scale-[1.01]";
                                        } else {
                                            btnClass += "bg-surface border-outline-variant/20 text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest active:scale-[0.99]";
                                        }

                                        return (
                                            <button key={idx} onClick={() => selectOption(idx)} className={btnClass} disabled={showAnswer}>
                                                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                                    isSelected || (showAnswer && isCorrect) ? "bg-current border-transparent" : "border-outline-variant"
                                                }`}>
                                                    {(isSelected || (showAnswer && isCorrect)) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                                </div>
                                                <span className="flex-1 text-base leading-snug tracking-tight">{opt}</span>
                                                {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-current mt-0.5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Only: Horizontal Question Lane */}
                    <div className="lg:hidden p-3 border-t border-outline-variant/10 bg-surface-container-lowest flex items-center gap-2 overflow-x-auto custom-scrollbar snap-x snap-mandatory shadow-inner">
                        <button onClick={() => setMobilePaletteOpen(true)} className="sticky left-0 shrink-0 h-10 px-4 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-[5px_0_10px_-5px_rgba(0,0,0,0.1)] z-10">
                            <Target className="w-3.5 h-3.5" /> All
                        </button>
                        {questions.map((_, i) => {
                            const status = statuses[i];
                            const isCurrent = i === currentIndex;
                            let style = "bg-surface border-outline-variant/30 text-on-surface-variant";
                            if (status === "unanswered") style = "bg-error text-white border-transparent";
                            if (status === "answered") style = "bg-[#27ae60] text-white border-transparent";
                            if (status === "marked") style = "bg-purple-500 text-white border-transparent";
                            if (status === "answered-marked") style = "bg-purple-500 text-white border-[1.5px] border-[#27ae60]";
                            
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        recordQuestionTime(currentIndex);
                                        triggerAiEvalIfNeeded(currentIndex);
                                        setCurrentIndex(i);
                                    }}
                                    className={`shrink-0 w-10 h-10 snap-center rounded-xl text-sm font-black flex items-center justify-center transition-all border ${style} ${isCurrent ? "ring-2 ring-primary scale-110 shadow-md border-primary font-black" : "opacity-80"}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Left Panel Bottom Action Bar */}
                    <div className="px-4 pt-4 pb-8 md:px-8 md:py-5 bg-surface border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-20 shrink-0">
                        <div className="flex flex-1 sm:flex-none flex-wrap gap-2 sm:gap-3">
                            <button onClick={markForReview} className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-purple-500/10 text-purple-600 font-black text-[10px] sm:text-[11px] uppercase tracking-widest border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95">
                                <Flag className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mark for Review & Next</span><span className="sm:hidden">Mark</span>
                            </button>
                            <button onClick={clearResponse} className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:text-on-surface hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 active:scale-95">
                                <Eraser className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Clear Response</span><span className="sm:hidden">Clear</span>
                            </button>
                            {mode === "practice" && (
                                <button onClick={() => setShowAnswer(!showAnswer)} className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                                    showAnswer ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                                }`}>
                                    <Eye className="w-3.5 h-3.5" /> {showAnswer ? "Hide" : "Answer"}
                                </button>
                            )}
                        </div>
                        <button onClick={submitAndNext} className="w-full sm:w-auto sm:ml-auto px-8 py-3.5 sm:py-3 rounded-xl bg-primary text-on-primary font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all active:scale-95">
                            {currentIndex === questions.length - 1 ? "Submit" : "Save & Next"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Panel (Status & Palette) - Desktop Sidebar / Mobile Drawer */}
                <div className={`${mobilePaletteOpen ? 'fixed inset-0 z-[300] flex flex-col justify-end bg-black/50 backdrop-blur-sm' : 'hidden'} lg:static lg:flex lg:w-[360px] flex-col bg-transparent lg:bg-surface overflow-hidden shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-20`} onClick={() => setMobilePaletteOpen(false)}>
                    <div className="w-full max-h-[85vh] lg:h-full bg-surface rounded-t-3xl lg:rounded-none flex flex-col overflow-hidden animate-in slide-in-from-bottom-full lg:animate-none" onClick={e => e.stopPropagation()}>
                        
                        {/* Mobile Drawer Handle & Title */}
                        <div className="lg:hidden flex flex-col items-center pt-3 pb-2 border-b border-outline-variant/10 bg-surface shrink-0 cursor-pointer" onClick={() => setMobilePaletteOpen(false)}>
                            <div className="w-12 h-1.5 rounded-full bg-outline-variant/30 mb-3" />
                            <h3 className="font-black font-headline text-on-surface uppercase tracking-widest text-xs">Question Palette</h3>
                        </div>

                        {/* Status Legend Box */}
                        <div className="p-4 lg:p-5 border-b border-outline-variant/10 bg-surface shrink-0">
                            <h4 className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Question Status</h4>
                            <div className="grid grid-cols-2 gap-y-3 lg:gap-y-5 gap-x-3">
                                <StatusPill count={counts.notVisited} label="Not Visited" colorClass="bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant" />
                                <StatusPill count={counts.unanswered} label="Not Answered" colorClass="bg-error text-white shadow-sm shadow-error/20" />
                                <StatusPill count={counts.answered} label="Answered" colorClass="bg-[#27ae60] text-white shadow-sm shadow-green-500/20" />
                                <StatusPill count={counts.marked} label="Marked for Review" colorClass="bg-purple-500 text-white shadow-sm shadow-purple-500/20" />
                                <div className="col-span-2">
                                    <StatusPill count={counts.answeredMarked} label="Answered & Marked (Evaluation Ready)" colorClass="bg-purple-500 text-white shadow-sm shadow-purple-500/20" hasTick={true} />
                                </div>
                            </div>
                        </div>

                        {/* Palette Box */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-5 bg-surface-container-lowest custom-scrollbar">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Question Palette</h4>
                                {aiEvaluatingSet.size > 0 && (
                                    <span className="text-[9px] font-black text-amber-600 animate-pulse bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        🤖 Evaluating...
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-6 lg:grid-cols-5 gap-2 lg:gap-3">
                                {questions.map((_, i) => {
                                    const status = statuses[i];
                                    const isCurrent = i === currentIndex;
                                    let style = "bg-surface-container-highest text-on-surface-variant border border-outline-variant/30";
                                    if (status === "unanswered") style = "bg-error text-white border-transparent shadow-sm shadow-error/20";
                                    if (status === "answered") style = "bg-[#27ae60] text-white border-transparent shadow-sm shadow-green-500/20";
                                    if (status === "marked") style = "bg-purple-500 text-white border-transparent shadow-sm shadow-purple-500/20";
                                    if (status === "answered-marked") style = "bg-purple-500 text-white";
                                    
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                recordQuestionTime(currentIndex);
                                                triggerAiEvalIfNeeded(currentIndex);
                                                setCurrentIndex(i);
                                                setMobilePaletteOpen(false); // Close on select in mobile
                                            }}
                                            className={`relative aspect-square rounded-xl text-sm font-black flex items-center justify-center transition-all ${style} ${isCurrent ? "ring-4 ring-primary/30 scale-110 z-10 shadow-lg border-2 border-primary" : "hover:scale-105 hover:shadow-md"}`}
                                        >
                                            {i + 1}
                                            {status === "answered-marked" && (
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#27ae60] rounded-full border-2 border-surface flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Global Actions */}
                        <div className="p-4 pb-8 lg:p-4 bg-surface border-t border-outline-variant/10 shrink-0 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                            <button onClick={onComplete} className="flex-1 py-4 rounded-xl bg-error/10 text-error font-black text-[11px] lg:text-xs uppercase tracking-widest hover:bg-error/20 hover:-translate-y-0.5 transition-all active:scale-95">
                                Abort
                            </button>
                            <button onClick={() => submitAll()} disabled={isSaving || isEvaluating} className="flex-[2] py-4 rounded-xl bg-[#27ae60] text-white font-black text-[11px] lg:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#219653] hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none active:scale-95">
                                {isEvaluating ? "Evaluating..." : isSaving ? "Saving..." : "Submit Test"} <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />
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
