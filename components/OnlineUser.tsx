"use client";

import { useChatStore } from "@/store/chatStore";
import { Profile } from "@/types/profile";

export default function OnlineUsers({
  currentUser,
  onlineUsers,
}: {
  currentUser: Profile;
  onlineUsers: string[];
}) {
  const { selectUserForDM } = useChatStore();

  return (
    <div className="border rounded p-4 bg-white h-full">
      <h2 className="font-semibold mb-2">Online Users</h2>

      {onlineUsers.length === 0 && (
        <p className="text-sm text-gray-500">No users online</p>
      )}

      {onlineUsers.map((id) => {
        if (id === currentUser?.id) return null; // Don't show self

        return (
          <button
            key={id}
            onClick={() => selectUserForDM(id, currentUser.id)}
            className="block w-full text-left py-2 px-2 hover:bg-gray-100 rounded"
          >
            User: {id}
          </button>
        );
      })}
    </div>
  );
}
