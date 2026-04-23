"use server";


const auth = async () => ({ userId: "temp-user-id" });
const currentUser = async () => ({ id: "temp-user-id" });

const prisma: any = {};

async function getAuthUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userRecord = await currentUser();
    const email = userRecord?.emailAddresses[0]?.emailAddress || "pending@iimb.ac.in";
    const name = userRecord?.firstName || "Scholar";

    // In Next.js App Router, using include: { profile: true } inside findUnique is fine
    const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: email,
            name: name,
        },
        include: { profile: true }
    });
    return user;
}

export async function saveOnboardingData(data: any) {
    const user = await getAuthUser();
    if (!user) return null;

    const { skills, ...profileData } = data;

    const sanitizedData = {
        ...profileData,
        industryInterest: profileData.industryInterest ? JSON.stringify(profileData.industryInterest) : null,
        preferredTimeSlots: profileData.preferredTimeSlots ? JSON.stringify(profileData.preferredTimeSlots) : null,
        commTools: profileData.commTools ? JSON.stringify(profileData.commTools) : null,
        domainExpertise: profileData.domainExpertise ? JSON.stringify(profileData.domainExpertise) : null,
    };

    const profile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
            ...sanitizedData,
            skills: {
                deleteMany: {},
                create: skills.map((s: any) => ({
                    skillName: s.name,
                    level: s.level,
                    isPrimary: s.isPrimary || false
                }))
            },
            lastActive: new Date()
        },
        create: {
            userId: user.id,
            ...sanitizedData,
            skills: {
                create: skills.map((s: any) => ({
                    skillName: s.name,
                    level: s.level,
                    isPrimary: s.isPrimary || false
                }))
            }
        }
    });

    return profile;
}

export async function getMatches() {
    const user = await getAuthUser();
    if (!user || !user.profile) return [];

    const allProfiles = await prisma.profile.findMany({
        where: { userId: { not: user.id } },
        include: { user: true, skills: true }
    });

    const myProfile = user.profile;
    const mySkills = await prisma.profileSkill.findMany({ where: { profileId: myProfile.id } });

    const scoredMatches = allProfiles.map(target => {
        let score = 0;
        let reasons: string[] = [];

        if (target.goal === myProfile.goal) {
            score += 30;
            reasons.push("Aligned on goal: " + target.goal.toLowerCase());
        }

        const mySkillNames = mySkills.map(s => s.skillName.toLowerCase());
        const targetSkillNames = target.skills.map(s => s.skillName.toLowerCase());
        const complementary = targetSkillNames.filter(s => !mySkillNames.includes(s));
        
        if (complementary.length > 0) {
            score += Math.min(20, complementary.length * 7);
            reasons.push("Complementary skills: " + complementary.slice(0, 2).join(", "));
        }

        const myAvgLevel = mySkills.length > 0 ? mySkills.reduce((acc, s) => acc + s.level, 0) / mySkills.length : 1;
        const targetAvgLevel = target.skills.length > 0 ? target.skills.reduce((acc, s) => acc + s.level, 0) / target.skills.length : 1;
        
        if (Math.abs(myAvgLevel - targetAvgLevel) <= 1) {
            score += 15;
            reasons.push("Matching expertise level");
        } else if (targetAvgLevel > myAvgLevel) {
            score += 10;
        }

        if (target.workStyle === myProfile.workStyle) {
            score += 7.5;
        }
        if (target.workingHours === myProfile.workingHours) {
            score += 7.5;
        }
        if (target.workStyle === myProfile.workStyle && target.workingHours === myProfile.workingHours) {
            reasons.push("Perfect work style match (" + target.workStyle + ")");
        }

        const hourDiff = Math.abs(target.hoursPerWeek - myProfile.hoursPerWeek);
        if (hourDiff <= 5) {
            score += 10;
            reasons.push("Sync overlap (~" + target.hoursPerWeek + "h/week)");
        } else if (hourDiff <= 15) {
            score += 5;
        }

        const personalityDiff = 
            Math.abs(target.introvertExtrovert - myProfile.introvertExtrovert) +
            Math.abs(target.plannerExecutor - myProfile.plannerExecutor) +
            Math.abs(target.leaderSupporter - myProfile.leaderSupporter);
        
        if (personalityDiff <= 4) {
            score += 5;
            reasons.push("High personality compatibility");
        }

        if (target.linkedinUrl) score += 2.5;
        if (target.completenessScore > 80) score += 2.5;

        let matchType = "LEARNING_PARTNER";
        if (target.goal === "COFOUNDER" && myProfile.goal === "COFOUNDER") matchType = "COFOUNDER_POTENTIAL";
        else if (complementary.length >= 2) matchType = "SKILL_COMPLEMENT";
        else if (target.goal === "ACCOUNTABILITY") matchType = "EXECUTION_PARTNER";

        return {
            id: target.id,
            name: target.user.name,
            photoUrl: target.photoUrl,
            bio: target.bio,
            goal: target.goal,
            skills: target.skills.slice(0, 3).map(s => s.skillName),
            score: Math.min(100, Math.round(score)),
            matchType,
            explanation: reasons.slice(0, 2).join(" • ")
        };
    });

    return scoredMatches.sort((a, b) => b.score - a.score).slice(0, 10);
}

export async function connectWithUser(targetProfileId: string) {
    const user = await getAuthUser();
    if (!user || !user.profile) return null;

    const connection = await prisma.connection.upsert({
        where: {
            profileId_targetProfileId: {
                profileId: user.profile.id,
                targetProfileId
            }
        },
        update: { status: "INTERESTED" },
        create: {
            profileId: user.profile.id,
            targetProfileId,
            status: "INTERESTED"
        }
    });

    return connection;
}
