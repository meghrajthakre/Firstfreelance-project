import { create } from "zustand";

export const useCoinStore = create((set) => ({

  coins: 1000,

  addCoins: (amount) =>
    set((state) => ({
      coins: state.coins + amount,
    })),

  minusCoins: (amount) =>
    set((state) => ({
      coins: state.coins - amount,
    })),

}));