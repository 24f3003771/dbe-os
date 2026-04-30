"use server";

import { getLeaderboard } from "./farm";

export async function getLeaderboardData() {
    const data = await getLeaderboard();
    return data;
}
