import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import OnlineUser from "./OnlineUser";

export default function ChatUI() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r">
        <OnlineUser />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatBox />
        <ChatInput />
      </div>
    </div>
  );
}
