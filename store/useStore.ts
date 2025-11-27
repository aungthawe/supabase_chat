"use client";

import { create } from "zustand";
import { DM, Profile, Room } from "../types/db";

interface State {
  currentUser?: Profile | null;
  setCurrentUser: (p: Profile | null) => void;

  activeDM?: DM | null;
  setActiveDM: (d: DM | null) => void;

  profiles: Profile[];
  setProfiles: (p: Profile[]) => void;

  updateProfile: (updated: Profile) => void; // realtime support

  typingUsers: string[];
  addTypingUsers: (id: string) => void;
  removeTypingUsers: (id: string) => void;

  groupChats: Room[];
  setGroupChats: (r: Room[]) => void;

  activeGroup: Room | null;
  setActiveGroup: (r: Room) => void;
}

export const useUserStore = create<State>((set) => ({
  currentUser: null,
  setCurrentUser: (p) => set({ currentUser: p }),

  activeDM: null,
  setActiveDM: (d) => set({ activeDM: d }),

  profiles: [],
  setProfiles: (p) => set({ profiles: p }),

  updateProfile: (updated) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === updated.id ? { ...p, ...updated } : p
      ),
    })),

  typingUsers: [],
  addTypingUsers: (id) =>
    set((state) => ({
      typingUsers: state.typingUsers.includes(id)
        ? state.typingUsers
        : [...state.typingUsers, id],
    })),
  removeTypingUsers: (id) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((x) => x !== id),
    })),
  removeAllTypingUsers: () => set({ typingUsers: [] }),

  groupChats: [],
  setGroupChats: (g) => set({ groupChats: g }),

  activeGroup: null,
  setActiveGroup: (g) => set({ activeGroup: g }),
}));
