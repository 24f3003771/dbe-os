const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    // 1. Competitions
    const competitions = [
        {
            name: "Tata Imagination Challenge 2024",
            organizer: "Tata Group",
            type: "COMPETITION",
            domain: "General Management",
            eligibility: "All undergraduate and postgraduate students",
            deadline: new Date("2024-09-15"),
            description: "A flagship competition where you can pitch your most innovative ideas to the Tata leadership.",
            tags: JSON.stringify(["Case Study", "Innovation", "Flagship"]),
            stages: [
                { stepNumber: 1, title: "Brand Quiz", description: "Online MCQ round on Tata Group history and business." },
                { stepNumber: 2, title: "Idea Pitch", description: "3-minute video pitch of your revolutionary idea." },
                { stepNumber: 3, title: "Grand Finale", description: "In-person presentation to the CEO Council." }
            ],
            guide: "### How to Win\n1. Stick to the Tata values of Integrity and Trust.\n2. Ensure your idea is scalable and socially impactful.\n3. Focus heavily on the presentation deck aesthetics."
        },
        {
            name: "HUL L.I.M.E. 16",
            organizer: "Hindustan Unilever",
            type: "COMPETITION",
            domain: "Marketing",
            eligibility: "MBA Year 1 & 2",
            deadline: new Date("2024-08-20"),
            description: "India's premier marketing case study competition.",
            tags: JSON.stringify(["Marketing", "Case Study", "Elite"]),
            stages: [
                { stepNumber: 1, title: "Campus Round", description: "Solve the localized marketing challenge." },
                { stepNumber: 2, title: "Semi-Finals", description: "Refine solution with feedback from HUL leaders." },
                { stepNumber: 3, title: "National Finals", description: "Telecast on CNBC/ET Now." }
            ],
            guide: "### Key Frameworks\n- Use 4Ps and STP analysis.\n- Focus on the 'Bottom of the Pyramid' consumers.\n- Real-world distribution feasibility is crucial."
        }
    ];

    // 2. Internships
    const internships = [
        {
            name: "Summer Internship Program 2025",
            organizer: "Boston Consulting Group (BCG)",
            type: "INTERNSHIP",
            domain: "Consulting",
            role: "Summer Associate",
            eligibility: "MBA/Final Year Students",
            deadline: new Date("2024-11-01"),
            description: "Work on high-impact projects alongside world-class consultants.",
            stipend: "Competitive",
            tags: JSON.stringify(["Consulting", "High Impact", "PPO Potential"]),
            stages: [
                { stepNumber: 1, title: "Resume Shortlisting", description: "Focus on spikes and impact-driven bullet points." },
                { stepNumber: 2, title: "Case Interviews", description: "Solve 2-3 profitability and market entry cases." },
                { stepNumber: 3, title: "Partner Round", description: "Behavioral interview and high-level case logic." }
            ]
        },
        {
            name: "Google STEP Internship",
            organizer: "Google",
            type: "INTERNSHIP",
            domain: "Tech",
            role: "Software Engineering Intern",
            eligibility: "1st/2nd Year Undergraduate",
            deadline: new Date("2024-01-15"),
            description: "Student Training in Engineering Program for early-career developers.",
            tags: JSON.stringify(["Diversity", "Software Engineering", "Global"]),
            stages: [
                { stepNumber: 1, title: "Application", description: "Submit transcript and resume." },
                { stepNumber: 2, title: "Coding Interview", description: "Basic DS & Algo questions in Python/Java/JS." },
                { stepNumber: 3, title: "Selection", description: "Final host matching round." }
            ]
        }
    ];

    const all = [...competitions, ...internships];

    for (const opp of all) {
        const { stages, guide, ...mainData } = opp;
        const createdOpp = await prisma.opportunity.create({
            data: {
                ...mainData,
                stages: {
                    create: stages
                }
            }
        });

        if (guide) {
            await prisma.preparationGuide.create({
                data: {
                    opportunityId: createdOpp.id,
                    content: guide
                }
            });
        }
        
        // Add sample winners
        if (opp.type === "COMPETITION") {
            await prisma.winnerSubmission.create({
                data: {
                    opportunityId: createdOpp.id,
                    title: "Winning Deck - Team Titans",
                    description: "Full case solution for the rural distribution challenge.",
                    strategy: "Used a hybrid D2C model coupled with local Kirana network leverage.",
                }
            });
        }
    }

    console.log("Opportunity Hub Seeded successfully!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
