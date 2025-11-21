import { create } from "zustand";
import { ChatStore } from "@/types/chatstore";
import { getOrCreateDM } from "@/lib/dm";
import { supabase } from "@/lib/supabaseClient";
import { Message } from "@/types/message";

export const useChatStore = create<ChatStore>((set, get) => ({
  // ===== STATE =====
  currentUser: null,

  onlineUsers: [],
  messages: [],
  dmMessages: [],

  selectedUser: null,
  activeDM: null,

  // ===== ACTIONS =====
  setCurrentUser: (user) => set({ currentUser: user }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  selectUserForDM: async (user) => {
    const me = get().currentUser;
    if (!me) return;

    const room = await getOrCreateDM(me.id, user.id);

    set({
      selectedUser: user,
      activeDM: room,
    });

    await get().loadDMMessages(room.id);
    get().subscribeDM(room.id);
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
          set((state) => ({
            dmMessages: [...state.dmMessages, payload.new as any],
          }));
        }
      )
      .subscribe();
  },
}));
