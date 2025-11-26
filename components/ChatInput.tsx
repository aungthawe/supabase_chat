"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useStore";
import { sendDMMessage } from "@/lib/dm";
import { toast } from "sonner";
import { subscribeTyping, sendTyping } from "@/lib/typing";

export default function ChatInput() {
  const activeDM = useUserStore((s) => s.activeDM);
  const currentUser = useUserStore((s) => s.currentUser);
  const typingUsers = useUserStore((s) => s.typingUsers);

  const [text, setText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!activeDM) return;
    const ch = subscribeTyping(activeDM.id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChannel(ch);

    // return () => ch.unsubscribe();
    return () => {
      ch.unsubscribe();
    };
  }, [activeDM, activeDM?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let typingTimeout: any = null;
    setText(e.target.value);
    if (channel && currentUser) {
      sendTyping(channel, currentUser.id, true);

      // clear previous timeout
      if (typingTimeout) clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        sendTyping(channel, currentUser.id, false);
      }, 2000);
    }
  };

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
    <div className="p-4 -t s relative">
      {/* typing indicator */}
      {typingUsers.length > 0 && (
        <div className="absolute p-2 -top-6 left-2 text-xs text-gray-700 animate-pulse rounded-xl bg-blue-200 ">
          {/* {typingUsers.filter((id) => id !== currentUser?.id).join(", ")} is */}
          typing...
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={handleChange}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
