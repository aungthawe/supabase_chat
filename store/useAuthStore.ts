import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useProfileStore } from "./useProfileStore";

interface AuthState {
  user: User | null;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  init: async () => {
    const profileStore = useProfileStore.getState();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    set({ user });

    if (user) {
      profileStore.loadProfile(user.id);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      set({ user });

      if (user) {
        profileStore.loadProfile(user.id);
      }
    });
  },
}));
