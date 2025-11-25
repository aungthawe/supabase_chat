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
    <div className="p-4 -t s">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-2 rounded-xl bg-purple-100 outline outline-purple-200 focus:outline-purple-300 focus:outline-2"
          placeholder={activeDM ? "Type a message..." : "Select a conversation"}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={!activeDM}
        />
        <button
          onClick={send}
          className="text-white cursor-pointer"
          disabled={!activeDM}
        >
          <img
            src={"/send.png"}
            alt="paper-plane"
            className="w-9 h-9 rounded bg-center"
          />
        </button>
      </div>
    </div>
  );
}
