"use client";

import { supabase } from "@/lib/supabaseClient";
import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";
import OnlineUsers from "@/components/OnlineUser";
import { useChatStore } from "@/store/chatStore";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { messages, addMessage } = useChatStore();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const load = async () => {
      // 1️⃣ Get current user
      const { data: userData } = await supabase.auth.getUser();
      setCurrentUsername(userData.user?.email ?? null);

      // 2️⃣ Load initial messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .order("id");

      messagesData?.forEach(addMessage);

      // 3️⃣ Setup realtime channel
      channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => addMessage(payload.new)
        )
        .subscribe(); // ✔ Not awaited — cleanup remains sync
    };

    load();

    // Cleanup MUST be synchronous
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [addMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <OnlineUsers />
      {/* Only render ChatBox when we know the username */}
      {currentUsername && (
        <ChatBox messages={messages} currentUsername={currentUsername} />
      )}
      <ChatInput />
    </div>
  );
}
