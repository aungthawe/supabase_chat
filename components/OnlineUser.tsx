// /components/OnlineUser.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchProfiles, subscribeProfiles } from "@/lib/user";
import { createOrGetDM } from "@/lib/dm";
import { useUserStore } from "@/store/useStore";
import { Profile } from "@/types/db";

export default function OnlineUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const setActiveDM = useUserStore((s) => s.setActiveDM);
  const currentUser = useUserStore((s) => s.currentUser);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const p = await fetchProfiles();
      setProfiles(p || []);
      unsub = subscribeProfiles((row) => {
        setProfiles((prev) => {
          const i = prev.findIndex((x) => x.id === row.id);
          if (i === -1) return [row, ...prev];
          const copy = [...prev];
          copy[i] = row;
          return copy;
        });
      });
    })();
    return () => {
      if (unsub) unsub();
    };
  }, []);

  async function openDM(other: Profile) {
    console.log("current use from online user list when click:"+currentUser?.id)
    if (!currentUser) return alert("Sign in first");
    const dm = await createOrGetDM(currentUser.id, other.id);
    setActiveDM(dm);
  }

  return (
    <div className="p-4 w-64 border-r">
      <h3 className="font-bold mb-3">Users</h3>
      <ul>
        {profiles.filter((p) => p.id != currentUser?.id).map((p) => (
          <li key={p.id} className="mb-2">
            <button
              onClick={() => openDM(p)}
              className="w-full text-left rounded p-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.avatar_url || "/user.png"}
                  alt=""
                  className="w-10 h-10 rounded-full bg-center"
                />
                <div>
                  <div className="text-sm">
                    {p.username || p.id.slice(0, 8)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.last_active
                      ? `active ${new Date(p.last_active).toLocaleTimeString()}`
                      : "offline"}
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
