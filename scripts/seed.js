const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { seedMatchForge } = require('./seed_matchforge');
const { seedOpportunities } = require('./seed_opportunities');

async function main() {
  console.log('Starting seed process...');
  
  try {
    await seedMatchForge(prisma);
    await seedOpportunities(prisma);
    console.log('Seed process completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
