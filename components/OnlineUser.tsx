"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function OnlineUsers() {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: { presence: { key: "online-user" } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setUsers(Object.keys(state));
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user: "active" });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-3 bg-white shadow flex items-center gap-2 border-b">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="font-medium">Online Users</span>
    </div>
  );
}
