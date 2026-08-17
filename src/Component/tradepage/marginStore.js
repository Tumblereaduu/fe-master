// store/useMarginStore.js
import { create } from "zustand";

export const useMarginStore = create((set) => ({
  freeMargin: 0,
  setFreeMargin: (value) => set({ freeMargin: value }),
}));
