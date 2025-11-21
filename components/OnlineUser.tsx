"use client";

import { useChatStore } from "@/store/chatStore";

export default function OnlineUsers() {
  const { onlineUsers, selectUserForDM, currentUser } = useChatStore();
  console.log("Online users :" + onlineUsers.length);
  return (
    <div className="p-4 border-r w-64">
      <h2 className="font-bold mb-2">Online Users</h2>

      {onlineUsers
        .filter((u) => u.id !== currentUser?.id)
        .map((user) => (
          <button
            key={user.id}
            className="w-full p-2 text-left hover:bg-gray-100 rounded"
            onClick={() => selectUserForDM(user)}
          >
            {user.username}
          </button>
        ))}
    </div>
  );
}
