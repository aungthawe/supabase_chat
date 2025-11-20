"use client";

import { supabase } from "@/lib/supabaseClient";
import React from "react";

export default function ChatInput() {
  const [content, setContent] = React.useState("");

  const sendMessage = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !content) return;

    await supabase.from("messages").insert({
      user_id: user.id,
      content,
    });

    setContent("");
  };

  return (
    <div className="border-t bg-white p-3">
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
