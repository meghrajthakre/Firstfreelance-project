import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCoinStore = create(
  persist(
    (set) => ({
      coins: 0,
      setCoins: (amount) => set({ coins: amount }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      minusCoins: (amount) => set((state) => ({ coins: state.coins - amount })),
    }),
    { name: "coin-store" } // key saved in localStorage
  )
);