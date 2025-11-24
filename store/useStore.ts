// /store/useStore.ts
"use client";

import { create } from "zustand";
import { DM } from "../types/db";
import { Profile } from "../types/db";

interface State {
  currentUser?: Profile | null;
  setCurrentUser: (p: Profile | null) => void;
  activeDM?: DM | null;
  setActiveDM: (d: DM | null) => void;
}

export const useUserStore = create<State>((set) => ({
  currentUser: null,
  setCurrentUser: (p) => set({ currentUser: p }),
  activeDM: null,
  setActiveDM: (d) => set({ activeDM: d }),
}));
