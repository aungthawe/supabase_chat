"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatBox from "@/components/ChatBox";
import OnlineUsers from "@/components/OnlineUser";
import { Profile } from "@/types/profile";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<Profile>();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // 1. Load authenticated user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setCurrentUser(data.user);
    };

    loadUser();
  }, []);

  // 2. Presence tracking (online users)
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase.channel("online-users", {
      config: { presence: { key: currentUser.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online: true });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser]);

  if (!currentUser)
    return <div className="p-6 text-center">Loading user...</div>;

  return (
    <div className="grid grid-cols-4 h-screen gap-4 p-4 bg-gray-100">
      {/* LEFT — Online Users */}
      <div className="col-span-1">
        <OnlineUsers currentUser={currentUser} onlineUsers={onlineUsers} />
      </div>

      {/* RIGHT — ChatBox */}
      <div className="col-span-3">
        <ChatBox currentUser={currentUser} />
      </div>
    </div>
  );
}
