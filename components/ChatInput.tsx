"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { sendDM } from "@/lib/dm";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { activeDM, currentUser } = useChatStore();

  async function send() {
    if (!text.trim()) return;
    await sendDM(activeDM.id, currentUser.id, text);
    setText("");
  }

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        className="flex-1 border rounded p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={send}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
