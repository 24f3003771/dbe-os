const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const todos = await prisma.todo.findMany({ take: 1 });
    console.log("Todos table exists:", todos);
  } catch (e) {
    console.error("Todos table error:", e.message);
  }
  try {
    const deadlines = await prisma.deadline.findMany({ take: 1 });
    console.log("Deadlines table exists:", deadlines);
  } catch (e) {
    console.error("Deadlines table error:", e.message);
  }
}
check();
