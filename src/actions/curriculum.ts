"use server";

import fs from "fs/promises";
import path from "path";

export async function getCurriculum() {
    try {
        const filePath = path.join(process.cwd(), "src/data/curriculum.json");
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading curriculum:", error);
        return [];
    }
}

export async function getOfficialSchedules() {
    try {
        const filePath = path.join(process.cwd(), "src/data/officialChecklist.json");
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading official schedules:", error);
        return {};
    }
}

export async function updateSubjectSchedule(subjectId: string, scheduleItems: any[]) {
    try {
        const filePath = path.join(process.cwd(), "src/data/officialChecklist.json");
        const data = await fs.readFile(filePath, "utf-8");
        const schedules = JSON.parse(data);
        
        schedules[subjectId] = scheduleItems;
        
        await fs.writeFile(filePath, JSON.stringify(schedules, null, 2), "utf-8");
        return { success: true };
    } catch (error: any) {
        console.error("Error writing official schedule:", error);
        return { success: false, error: error.message };
    }
}

export async function getNoteContent(subjectId: string) {
    try {
        const filePath = path.join(process.cwd(), "public", "term2_data", "notes", `${subjectId}.md`);
        const content = await fs.readFile(filePath, "utf-8");
        return content;
    } catch (error) {
        return ""; // Return empty string if note doesn't exist
    }
}

export async function updateNoteContent(subjectId: string, content: string) {
    try {
        const dirPath = path.join(process.cwd(), "public", "term2_data", "notes");
        await fs.mkdir(dirPath, { recursive: true });
        
        const filePath = path.join(dirPath, `${subjectId}.md`);
        await fs.writeFile(filePath, content, "utf-8");
        return { success: true };
    } catch (error: any) {
        console.error("Error writing note content:", error);
        return { success: false, error: error.message };
    }
}
