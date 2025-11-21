"use client";

import { useChatStore } from "@/store/chatStore";
import MessageItem from "./MessageItem";

export default function ChatBox() {
  const { dmMessages, currentUser } = useChatStore();

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {dmMessages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isMe={msg.sender === currentUser?.id}
        />
      ))}
    </div>
  );
}
