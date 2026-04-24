async function seedMatchForge(prisma) {
    const users = [
        { 
            name: "Aarav Sharma", 
            email: "aarav@example.com", 
            age: "18-22",
            status: "STUDENT",
            goal: "LEARNING", 
            skills: [{name: "Python", level: 4}, {name: "PyTorch", level: 3}], 
            style: "ASYNC", 
            hours: 15,
            horizon: "MEDIUM_TERM"
        },
        { 
            name: "Ishani Kapoor", 
            email: "ishani@example.com", 
            age: "23-28",
            status: "PROFESSIONAL",
            goal: "COFOUNDER", 
            skills: [{name: "UI/UX", level: 5}, {name: "Figma", level: 5}], 
            style: "SYNC", 
            hours: 25,
            horizon: "LONG_TERM"
        },
        { 
            name: "Vikram Malhotra", 
            email: "vikram@example.com", 
            age: "23-28",
            status: "FOUNDER",
            goal: "TEAM", 
            skills: [{name: "Solidity", level: 4}, {name: "React", level: 3}], 
            style: "SYNC", 
            hours: 40,
            horizon: "LONG_TERM"
        },
        { 
            name: "Ananya Iyer", 
            email: "ananya@example.com", 
            age: "18-22",
            status: "STUDENT",
            goal: "ACCOUNTABILITY", 
            skills: [{name: "Marketing", level: 3}], 
            style: "ASYNC", 
            hours: 10,
            horizon: "SHORT_TERM"
        }
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                name: u.name,
                totalTomatoesEarned: Math.floor(Math.random() * 500),
                tomatoesBalance: Math.floor(Math.random() * 100),
                streak: Math.floor(Math.random() * 10),
            }
        });

        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                bio: `Passionately working in the tech space as a ${u.status.toLowerCase()}.`,
                ageRange: u.age,
                currentStatus: u.status,
                goal: u.goal,
                timeHorizon: u.horizon,
                commitmentLevel: "SERIOUS",
                workStyle: u.style,
                riskAppetite: "MEDIUM",
                hoursPerWeek: u.hours,
                completenessScore: 85,
                skills: {
                    create: u.skills.map(s => ({ skillName: s.name, level: s.level, isPrimary: true }))
                },
                introvertExtrovert: Math.floor(Math.random() * 10) + 1,
                plannerExecutor: Math.floor(Math.random() * 10) + 1,
                leaderSupporter: Math.floor(Math.random() * 10) + 1,
                lastActive: new Date()
            }
        });
    }

}

module.exports = { seedMatchForge };
