import { create } from "zustand";
import { getOrCreateDM } from "@/lib/dm";
import { supabase } from "@lib/supabaseClient";

export const useChatStore = create((set, get) => ({
  currentUser: null,

  onlineUsers: [],
  messages: [],
  dmMessages: [],

  selectedUser: null,
  activeDM: null,

  setCurrentUser: (u) => set({ currentUser: u }),

  setOnlineUsers: (list) => set({ onlineUsers: list }),

  selectUserForDM: async (user) => {
    const me = get().currentUser;
    if (!me) return;

    const room = await getOrCreateDM(me.id, user.id);

    set({ selectedUser: user, activeDM: room });

    get().subscribeDM(room.id);
    get().loadDMMessages(room.id);
  },

  loadDMMessages: async (dm_id) => {
    const { data } = await supabase
      .from("dm_messages")
      .select("*")
      .eq("dm_id", dm_id)
      .order("created_at");

    set({ dmMessages: data || [] });
  },

  subscribeDM: (dm_id) => {
    supabase
      .channel(`dm:${dm_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `dm_id=eq.${dm_id}`,
        },
        (payload) => {
          set({
            dmMessages: [...get().dmMessages, payload.new],
          });
        }
      )
      .subscribe();
  },
}));
