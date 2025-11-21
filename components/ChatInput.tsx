"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Profile } from "@/types/profile";

export default function ChatInput({ currentUser }: { currentUser: Profile }) {
  const [text, setText] = useState("");
  const { sendDM, activeDM } = useChatStore();

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!activeDM) return; // prevent error

    await sendDM(text, currentUser.id);
    setText("");
  };

  return (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 border rounded p-2"
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
