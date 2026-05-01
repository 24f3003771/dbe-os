import { create } from 'zustand';
import { getFarmState, recordTomatoEvent, spendTomatoesAction } from '@/actions/farm';
import type { TomatoEventPayload } from '@/actions/farm';
import { getRank } from '@/constants/tomato';

export interface PointState {
  isInitialized: boolean;
  totalTomatoesEarned: number;
  tomatoesBalance: number;
  position: number;
  rank: string;
  leaderboardRank: number;
  medianTomatoes: number;
  communityTotal: number;
  streak: number;
  // Actions
  fetchFarmData: () => Promise<void>;
  earnTomatoes: (payload: TomatoEventPayload) => void;
  spendTomatoes: (amount: number) => Promise<boolean>;
}

export const useFarmStore = create<PointState>()((set, get) => ({
  isInitialized: false,
  totalTomatoesEarned: 0,
  tomatoesBalance: 0,
  position: 0,
  rank: "Tomato Seedling",
  leaderboardRank: 0,
  medianTomatoes: 0,
  communityTotal: 0,
  streak: 0,
  fetchFarmData: async () => {
    try {
      const data = await getFarmState();
      set({
        isInitialized: true,
        totalTomatoesEarned: data.totalTomatoesEarned,
        tomatoesBalance: data.tomatoesBalance,
        position: data.position,
        rank: data.rank,
        leaderboardRank: data.leaderboardRank,
        medianTomatoes: data.medianTomatoes,
        communityTotal: data.communityTotal,
        streak: data.streak,
      });
    } catch (e) {
      console.error("Failed to fetch farm state", e);
    }
  },

  earnTomatoes: (payload) => {
    const { totalTomatoesEarned, tomatoesBalance } = get();
    const amount = payload.tomatoes;

    // Optimistic update — instantly reflects in UI
    const newTotal = totalTomatoesEarned + amount;
    set({
      totalTomatoesEarned: newTotal,
      tomatoesBalance: tomatoesBalance + amount,
      rank: getRank(newTotal),
    });

    // Background sync — logs event + updates DB
    recordTomatoEvent(payload).catch(console.error);
  },

  spendTomatoes: async (amount) => {
    const { tomatoesBalance } = get();
    if (tomatoesBalance >= amount) {
      // Optimistic
      set({ tomatoesBalance: tomatoesBalance - amount });

      const success = await spendTomatoesAction(amount);
      if (!success) {
        // Revert on server failure
        set({ tomatoesBalance: tomatoesBalance });
        return false;
      }
      return true;
    }
    return false;
  },
}));
