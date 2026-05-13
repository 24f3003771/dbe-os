import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    try {
        await prisma.$executeRawUnsafe('ALTER TABLE app_settings ADD COLUMN tools_enabled BOOLEAN DEFAULT true;');
        console.log('Done adding tools_enabled!');
    } catch (err: any) {
        if (err.message.includes('already exists')) {
            console.log('Column already exists!');
        } else {
            console.error(err);
        }
    }
}
run();
