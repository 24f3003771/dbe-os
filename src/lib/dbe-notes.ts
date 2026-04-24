import { promises as fs } from 'fs';
import path from 'path';

export async function getDbeNoteContent(id: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'dbe_notes', `${id}.md`);
        const content = await fs.readFile(filePath, 'utf8');
        return content;
    } catch (e) {
        console.error(`Error reading note ${id}:`, e);
        return "";
    }
}
