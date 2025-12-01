"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/useStore";
import { createOrGetDM } from "@/lib/dm";
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@/types/db";
import { timeAgo } from "@/lib/user";
import { toast } from "sonner";
import GroupList from "./GroupList";
import CreateGroupDialog from "./CreateGroupDialog";

export default function OnlineUsers() {
  const currentUser = useUserStore((s) => s.currentUser);
  const profiles = useUserStore((s) => s.profiles);
  const setProfiles = useUserStore((s) => s.setProfiles);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const setActiveDM = useUserStore((s) => s.setActiveDM);
  const activeDM = useUserStore((s) => s.activeDM);

  useEffect(() => {
    const fetchInitialProfiles = async () => {
      const { data } = await supabase.from("profiles").select("*");
      if (data) setProfiles(data as Profile[]);
    };

    fetchInitialProfiles();
  }, [setProfiles]);

  useEffect(() => {
    const channel = supabase
      .channel("profiles-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          const updatedProfile = payload.new as Profile;
          updateProfile(updatedProfile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateProfile]);

  async function openDM(other: Profile) {
    if (!currentUser) return toast.error("Sign in first!");

    const dm = await createOrGetDM(currentUser.id, other.id);
    setActiveDM(dm);
  }

  return (
    <div className="relative p-4 w-64 bg-pink-100 min-h-225">
      <GroupList />
      <h3 className="font-bold mb-3 text-purple-900">Friends List</h3>
      <div>
        <ul>
          {profiles
            .filter((p) => p.id !== currentUser?.id)
            .map((p) => (
              <li key={p.id} className="mb-2">
                <button
                  onClick={() => openDM(p)}
                  className={`w-full text-left rounded-2xl p-2 ${
                    activeDM &&
                    (p.id === activeDM.user_a || p.id === activeDM.user_b)
                      ? "bg-purple-400 "
                      : "bg-purple-200 hover:bg-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.avatar_url || "/user.png"}
                      alt=""
                      className="w-8 h-8 rounded-full bg-center"
                    />
                    <div>
                      <div className="text-sm">
                        {p.username || p.id.slice(0, 8)}
                      </div>

                      <div className={`text-xs text-gray-500`}>
                        {p.last_active && (
                          <span>{timeAgo(p.last_active)} </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
        </ul>
        <div className="absolute bottom-5 right-5 ">
          <CreateGroupDialog />
        </div>
      </div>
    </div>
  );
}
