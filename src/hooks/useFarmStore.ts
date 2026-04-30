import { create } from 'zustand';
import { getFarmState, updateTomatoes, spendTomatoesAction } from '@/actions/farm';

export interface PointState {
  isInitialized: boolean;
  totalTomatoesEarned: number;
  tomatoesBalance: number;
  streak: number;
  rank: string;
  
  // Actions
  fetchFarmData: () => Promise<void>;
  earnTomatoes: (amount: number) => void;
  spendTomatoes: (amount: number) => Promise<boolean>;
}

export const useFarmStore = create<PointState>()((set, get) => ({
  isInitialized: false,
  totalTomatoesEarned: 0,
  tomatoesBalance: 0,
  streak: 0,
  rank: "Tomato Seedling",
  
  fetchFarmData: async () => {
    try {
      const data = await getFarmState();
      set({
        isInitialized: true,
        totalTomatoesEarned: data.totalTomatoesEarned,
        tomatoesBalance: data.tomatoesBalance,
        streak: data.streak,
        rank: data.rank,
      });
    } catch (e) {
      console.error("Failed to fetch farm state", e);
    }
  },

  earnTomatoes: (amount) => {
    // Optimistic Update
    set((state) => ({
      totalTomatoesEarned: state.totalTomatoesEarned + amount,
      tomatoesBalance: state.tomatoesBalance + amount,
    }));

    // Background Sync
    updateTomatoes(amount).catch(console.error);
  },
  
  spendTomatoes: async (amount) => {
    const { tomatoesBalance } = get();
    if (tomatoesBalance >= amount) {
      // Optimistic
      set({ tomatoesBalance: tomatoesBalance - amount });
      
      const success = await spendTomatoesAction(amount);
      if (!success) { // Revert if server fails
        set({ tomatoesBalance: tomatoesBalance });
        return false;
      }
      return true;
    }
    return false;
  }
}));

