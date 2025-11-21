import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/profile";

interface ProfileState {
  profile: Profile | null;
  loadProfile: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,

  loadProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) set({ profile: data });
  },
}));
