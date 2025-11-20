import MessageItem from "./MessageItem";
import { Message } from "@/types/message";

export default function ChatBox({
  messages,
  currentUsername,
}: {
  messages: Message[];
  currentUsername: string;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isMe = msg.username === currentUsername;

        return (
          <div key={msg.id} className="flex flex-col">
            <span
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow
                ${
                  isMe
                    ? "self-end bg-blue-600 text-white rounded-br-none"
                    : "self-start bg-white text-gray-800 border rounded-bl-none"
                }`}
            >
              {msg.content}
            </span>
            <span className="text-xs text-gray-400 mt-1">{msg.username}</span>
          </div>
        );
      })}
    </div>
  );
}
