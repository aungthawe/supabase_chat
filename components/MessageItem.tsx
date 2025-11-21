import { DMMessage } from "@/types/dm";

export default function MessageItem({
  message,
  isMe,
}: {
  message: DMMessage;
  isMe: boolean;
}) {
  return (
    <div
      className={`max-w-[70%] p-2 rounded-xl text-sm ${
        isMe
          ? "bg-blue-500 text-white ml-auto"
          : "bg-white border text-gray-800"
      }`}
    >
      {message.content}
    </div>
  );
}
