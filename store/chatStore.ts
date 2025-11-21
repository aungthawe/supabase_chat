import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

type DMRoom = {
  id: number;
  user_a: string;
  user_b: string;
};

type DMMessage = {
  id: number;
  dm_id: number;
  sender: string;
  content: string;
  created_at: string;
};

type ChatStore = {
  activeDM: DMRoom | null;
  dmMessages: DMMessage[];

  selectUserForDM: (targetId: string, currentUserId: string) => Promise<void>;
  sendDM: (content: string, senderId: string) => Promise<void>;
  addDMMessage: (msg: DMMessage) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  activeDM: null,
  dmMessages: [],

  // SELECT OR CREATE DM ROOM
  selectUserForDM: async (targetId, currentUserId) => {
    if (!currentUserId) return;

    // 1. check existing
    const { data: existing } = await supabase
      .from("dms")
      .select("*")
      .or(
        `and(user_a.eq.${currentUserId},user_b.eq.${targetId}),and(user_a.eq.${targetId},user_b.eq.${currentUserId})`
      )
      .maybeSingle();

    let dm = existing;

    // 2. create if not found
    if (!dm) {
      const { data: created } = await supabase
        .from("dms")
        .insert({
          user_a: currentUserId,
          user_b: targetId,
        })
        .select("*")
        .single();

      dm = created;
    }

    set({ activeDM: dm, dmMessages: [] });

    // 3. load messages
    const { data: msgs } = await supabase
      .from("dm_messages")
      .select("*")
      .eq("dm_id", dm.id)
      .order("created_at");

    set({ dmMessages: msgs || [] });

    // 4. realtime subscribe
    supabase
      .channel(`dm_${dm.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `dm_id=eq.${dm.id}`,
        },
        (payload) => {
          get().addDMMessage(payload.new as DMMessage);
        }
      )
      .subscribe();
  },

  // SEND MESSAGE
  sendDM: async (content: string, senderId: string) => {
    const dm = get().activeDM;
    if (!dm) return; // prevent crash

    await supabase.from("dm_messages").insert({
      dm_id: dm.id,
      sender: senderId,
      content,
    });
  },

  addDMMessage: (msg) =>
    set((state) => ({
      dmMessages: [...state.dmMessages, msg],
    })),
}));
