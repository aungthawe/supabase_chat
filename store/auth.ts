// store/auth.ts
import { create } from "zustand";
import { Profile } from "@/types/profile";

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (u: any | null) => void;
  setProfile: (p: Profile | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (u) => set({ user: u }),
  setProfile: (p) => set({ profile: p }),
  setLoading: (v) => set({ loading: v }),
}));
