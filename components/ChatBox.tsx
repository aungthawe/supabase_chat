"use client";

import { useChatStore } from "@/store/chatStore";
import ChatInput from "./ChatInput";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";
import { Profile } from "@/types/profile";

export default function ChatBox({ currentUser }: { currentUser: Profile }) {
  const { dmMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dmMessages]);

  if (!currentUser) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="flex flex-col h-full border rounded p-4 bg-gray-50">
      {/* Messages section */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {dmMessages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isMe={msg.sender === currentUser.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input section */}
      <ChatInput currentUser={currentUser} />
    </div>
  );
}
