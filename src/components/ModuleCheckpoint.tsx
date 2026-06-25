"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Award } from "lucide-react";
import { recordTomatoEvent } from "@/actions/farm";
import { markModuleComplete } from "@/actions/progress";

export default function ModuleCheckpoint({ 
    message, 
    subjectId,
    moduleId,
    isAlreadyCompleted,
    onComplete
}: { 
    message: string;
    subjectId: string;
    moduleId: string | number;
    isAlreadyCompleted?: boolean;
    onComplete?: () => void;
}) {
    const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted || false);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (isAlreadyCompleted) {
            setIsCompleted(true);
        }
    }, [isAlreadyCompleted]);

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            // Check if moduleId is a number, if so mark it complete in DB
            if (typeof moduleId === 'number') {
                await markModuleComplete(subjectId, moduleId);
            } else if (moduleId === 'formula-sheet') {
                await markModuleComplete(subjectId, 98);
            } else if (moduleId === 'mind-maps') {
                await markModuleComplete(subjectId, 99);
            }

            // Reward 20 tomatoes
            await recordTomatoEvent({
                actionType: "module_complete",
                description: `Completed ${moduleId === 98 ? 'Formula Sheet' : moduleId === 99 ? 'Mind Maps' : `Module ${moduleId}`} for ${subjectId}`,
                tomatoes: 20,
            });
            setIsCompleted(true);
            if (onComplete) onComplete();
        } catch (err) {
            console.error(err);
            alert("Failed to save progress.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="text-center mt-[50px] pt-[30px] border-t-2 border-dashed border-[#eef2f5] font-sans">
            <h3 className="text-[#2c3e50] text-3xl font-bold mb-6">{message}</h3>
            
            {isCompleted ? (
                <div className="inline-flex flex-col items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                        <CheckCircle2 className="w-8 h-8" /> Module Completed!
                    </div>
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-full font-bold">
                        <Award className="w-5 h-5" /> +20 Tomatoes Earned
                    </div>
                </div>
            ) : (
                <button 
                    onClick={handleComplete}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white px-10 py-5 text-xl font-bold border-none rounded-full cursor-pointer shadow-[0_6px_12px_rgba(46,204,113,0.3)] transition-transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
                >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "✅ Mark Module as Complete"}
                </button>
            )}
        </div>
    );
}
