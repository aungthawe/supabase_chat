import { DMMessage } from "@/types/dm";

export default function MessageItem({ message, isMe }:{message:DMMessage,isMe:boolean}) {
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-xl max-w-xs ${
          isMe ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
