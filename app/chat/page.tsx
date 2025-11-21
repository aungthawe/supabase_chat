"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useChatStore } from "@/store/chatStore";

import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";
import OnlineUsers from "@/components/OnlineUser";
import { DMMessage } from "@/types/dm";
import { Message } from "@/types/message";

export default function ChatPage() {
  const {
    setCurrentUser,
    setOnlineUsers,
    messages,
    addMessage,
    activeDM,
    dmMessages,
  } = useChatStore();

  // Load User + Online Users + Messages
  useEffect(() => {
    console.log("Zustand State:", useChatStore.getState());
    console.log("activeDM:", activeDM);

    let presenceChannel: ReturnType<typeof supabase.channel>;
    let messageChannel: ReturnType<typeof supabase.channel>;

    const load = async () => {
      // 1️⃣ Fetch current user
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setCurrentUser({
          id: userData.user.id,
          username: userData.user.email!,
          avatar_url: "",
          updated_at: "",
        });
      }

      // 2️⃣ Presence (Online users)
      presenceChannel = supabase.channel("online-users", {
        config: {
          presence: {
            key: userData.user?.id ?? "unknown",
          },
        },
      });

      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();

          const users = Object.keys(state).map((id) => ({
            id,
            username: state[id][0].username,
            avatar_url: "",
            updated_at: "",
          }));

          setOnlineUsers(users);
        })
        .subscribe();

      // Announce our presence
      presenceChannel.track({
        username: userData.user?.email,
        user_id: userData.user?.id,
      });

      // 3️⃣ Load group chat messages
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at");

      data?.forEach((msg) => addMessage(msg));

      // 4️⃣ Realtime group messages
      messageChannel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            console.log("Realtime Event:", payload);
            addMessage(payload.new as Message);
          }
        )
        .subscribe();
    };

    load();

    return () => {
      if (presenceChannel) supabase.removeChannel(presenceChannel);
      if (messageChannel) supabase.removeChannel(messageChannel);
    };
  }, []);

  return (
    <div className="h-screen grid grid-cols-[250px_1fr] bg-gray-100">
      <div className="border-r bg-white">
        <OnlineUsers />
      </div>

      <div className="flex flex-col">
        <ChatBox />

        <ChatInput />
      </div>
    </div>
  );
}
