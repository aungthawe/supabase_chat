import { Message } from "@/types/message";

export default function MessageItem({ message }: { message: Message }) {
  return (
    <div className="p-2 border-b">
      <p>{message.content}</p>
      <small className="text-gray-500">{message.created_at}</small>
    </div>
  );
}
