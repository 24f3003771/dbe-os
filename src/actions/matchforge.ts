"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_USER_EMAIL = "scholar@dbe-os.com";

async function getDefaultUser() {
    const user = await prisma.user.findUnique({ 
        where: { email: DEFAULT_USER_EMAIL },
        include: { profile: true }
    });
    return user;
}

export async function saveOnboardingData(data: any) {
    const user = await getDefaultUser();
    if (!user) return null;

    const { skills, ...profileData } = data;

    // Convert arrays to JSON strings if necessary for fields not handled by relations
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
    const user = await getDefaultUser();
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

        // 1. Goal Alignment (30%)
        if (target.goal === myProfile.goal) {
            score += 30;
            reasons.push("Aligned on goal: " + target.goal.toLowerCase());
        }

        // 2. Skill Complementarity (20%)
        const mySkillNames = mySkills.map(s => s.skillName.toLowerCase());
        const targetSkillNames = target.skills.map(s => s.skillName.toLowerCase());
        const complementary = targetSkillNames.filter(s => !mySkillNames.includes(s));
        
        if (complementary.length > 0) {
            score += Math.min(20, complementary.length * 7);
            reasons.push("Complementary skills: " + complementary.slice(0, 2).join(", "));
        }

        // 3. Skill Level Compatibility (15%)
        // Matches prefer similar level or higher as per PRD
        const myAvgLevel = mySkills.length > 0 ? mySkills.reduce((acc, s) => acc + s.level, 0) / mySkills.length : 1;
        const targetAvgLevel = target.skills.length > 0 ? target.skills.reduce((acc, s) => acc + s.level, 0) / target.skills.length : 1;
        
        if (Math.abs(myAvgLevel - targetAvgLevel) <= 1) {
            score += 15;
            reasons.push("Matching expertise level");
        } else if (targetAvgLevel > myAvgLevel) {
            score += 10;
        }

        // 4. Work Style Match (15%)
        if (target.workStyle === myProfile.workStyle) {
            score += 7.5;
        }
        if (target.workingHours === myProfile.workingHours) {
            score += 7.5;
        }
        if (target.workStyle === myProfile.workStyle && target.workingHours === myProfile.workingHours) {
            reasons.push("Perfect work style match (" + target.workStyle + ")");
        }

        // 5. Availability Overlap (10%)
        const hourDiff = Math.abs(target.hoursPerWeek - myProfile.hoursPerWeek);
        if (hourDiff <= 5) {
            score += 10;
            reasons.push("Sync overlap (~" + target.hoursPerWeek + "h/week)");
        } else if (hourDiff <= 15) {
            score += 5;
        }

        // 6. Personality Compatibility (5%)
        const personalityDiff = 
            Math.abs(target.introvertExtrovert - myProfile.introvertExtrovert) +
            Math.abs(target.plannerExecutor - myProfile.plannerExecutor) +
            Math.abs(target.leaderSupporter - myProfile.leaderSupporter);
        
        if (personalityDiff <= 4) {
            score += 5;
            reasons.push("High personality compatibility");
        }

        // 7. Credibility Score (5%)
        if (target.linkedinUrl) score += 2.5;
        if (target.completenessScore > 80) score += 2.5;

        // Determine Match Type
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
    const user = await getDefaultUser();
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
