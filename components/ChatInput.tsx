// /components/ChatInput.tsx
"use client";
import React, { useState } from "react";
import { useUserStore } from "@/store/useStore";
import { sendDMMessage } from "@/lib/dm";
import { toast } from "sonner";

export default function ChatInput() {
  const activeDM = useUserStore((s) => s.activeDM);
  const currentUser = useUserStore((s) => s.currentUser);
  const [text, setText] = useState("");

  async function send() {
    if (!activeDM || !currentUser) return;
    if (!text.trim()) return;
    console.log(
      "sendDMmessage from send method....." + activeDM.id,
      currentUser.id + text
    );
    try {
      await sendDMMessage(activeDM.id, currentUser.id, text.trim());
      setText("");
    } catch (err) {
      console.error(err);
      toast.error("Send Failed, ");
    }
  }

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder={activeDM ? "Type a message..." : "Select a conversation"}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={!activeDM}
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-lg bg-purple-800 text-white"
          disabled={!activeDM}
        >
          Send
        </button>
      </div>
    </div>
  );
}
