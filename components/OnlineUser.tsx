"use client";

import { useChatStore } from "@/store/chatStore";
import type { Profile } from "@/types/profile";

export default function OnlineUsers({
  currentUser,
  onlineUsers,
}: {
  currentUser: Profile | null;
  onlineUsers: Profile[];
}) {
  const { selectUserForDM } = useChatStore();

  return (
    <div className=" rounded-lg p-4 bg-white h-full">
      <h2 className="font-semibold mb-3 text-lg">Online Users</h2>

      {onlineUsers.length === 0 && (
        <p className="text-sm text-gray-500">No users online</p>
      )}

      <div className="space-y-2">
        {onlineUsers.map((user) => {
          if (!currentUser) return null;
          if (user.id === currentUser.id) return null; // hide current user

          return (
            <button
              key={user.id}
              onClick={() => selectUserForDM(user.id, currentUser.id)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-200 transition"
            >
              {/* Avatar */}
              <img
                src={user.avatar_url ?? "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover border"
                alt={user.username ?? "avatar"}
              />

              {/* Username + Email */}
              <div className="text-left">
                <p className="font-medium">{user.username ?? "Unknown User"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
