import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import OnlineUser from "./OnlineUser";

export default function ChatUI() {
  return (
    <div className="flex max-h-screen">
      <div className="w-64">
        <OnlineUser />
      </div>
      <div className="flex-1 flex flex-col max-h-screen">
        <div className="flex-1 flex justify-center overflow-auto ">
          <ChatBox />
        </div>
        <div className="p-2">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
