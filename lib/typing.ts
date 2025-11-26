import { supabase } from "./supabaseClient";
import { useUserStore } from "@/store/useStore";
export function subscribeTyping(dmId: number) {
  const channel = supabase.channel(`dm-${dmId}-typing`);

  channel.on("broadcast", { event: "typing" }, (payload) => {
    console.log("received typing payload:", payload);

    const typingStore = useUserStore.getState();
    const { userId, isTyping } = payload.payload;
    if (isTyping) typingStore.addTypingUsers(userId);
    else typingStore.removeTypingUsers(userId);

    //typingStore.removeAllTypingUsers();

    console.log("AFTER:", typingStore.typingUsers);
  });

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      console.log(`Subscribed to typing channel for DM ${dmId}`);
    }
  });

  return channel;
}

export function sendTyping(channel: any, userId: string, isTyping: boolean) {
  if (!channel) return;
  console.log("sending typing:", { userId, isTyping });
  channel.send({
    type: "broadcast",
    event: "typing",
    payload: { userId, isTyping },
  });
}
