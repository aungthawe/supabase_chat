// /components/ChatBox.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";

import { useUserStore } from "@/store/useStore";
import { fetchDMMessages, subscribeToDM } from "@/lib/dm";
import { DMMessage } from "@/types/db";

export default function ChatBox() {
  const activeDM = useUserStore((s) => s.activeDM);
  const currentUser = useUserStore((s) => s.currentUser);
  const [messages, setMessages] = useState<DMMessage[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let unsub: () => void;
    if (!activeDM) {
      setMessages([]);
      return;
    }

    (async () => {
      const msgs = await fetchDMMessages(activeDM.id, 200);
      setMessages(msgs || []);
      unsub = subscribeToDM(activeDM.id, (m) => {
        setMessages((prev) => [...prev, m]);
      });
    })();

    return () => {
      if (unsub) unsub();
    };
  }, [activeDM?.id]);

  useEffect(() => {
    // scroll to bottom when messages change
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [messages.length]);

  if (!activeDM) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Pick a user to start DM
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-2 border-b">
        <strong>DM #{activeDM.id}</strong>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-auto p-4">
        {messages.map((m) => {
          const mine = currentUser && m.sender === currentUser.id;
          return (
            <div
              key={m.id}
              className={`mb-3 max-w-xs ${mine ? "ml-auto text-right" : ""}`}
            >
              <div
                className={`inline-block p-2 rounded ${
                  mine ? "bg-purple-500 text-white" : "bg-gray-200"
                }`}
              >
                {m.content}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(m.created_at || "").toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
