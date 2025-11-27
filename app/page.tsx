"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { useUserStore } from "@/store/useStore";
import { getProfile } from "@/lib/auth";
import ChatUI from "@/components/ChatUi";
import { startPresence } from "@/lib/presence";
import { fetchUserGroups } from "@/lib/group";

export default function Home() {
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);
  const currentUser = useUserStore((s) => s.currentUser);
  const setGroupChats = useUserStore((s) => s.setGroupChats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchGroups = async () => {
      try {
        const groups = await fetchUserGroups(currentUser.id);
        setGroupChats(groups);

        // Log group details conditionally
        if (groups.length) {
          console.log(
            `Fetched ${groups.length} groups for user: ${currentUser.id}`
          );
        } else {
          console.log(`No groups found for user: ${currentUser.id}`);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();

    if (currentUser.id) startPresence(currentUser.id);
  }, [currentUser, setGroupChats]);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "/login";
          return;
        }

        console.log("Session user:", session.user);
        const user = session.user;

        const profile = await getProfile(user.id);
        if (!profile) {
          window.location.href = "/onboarding";
          return;
        }

        setCurrentUser(profile);
        setLoading(false);
        console.log("Current user set:", profile.id);
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    init();
  }, [setCurrentUser]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin border-4 border-t-4 border-purple-600 border-gray-300 rounded-full w-16 h-16 mb-2"></div>
        <p className="text-center text-purple-600 text-lg font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );

  return <ChatUI />;
}
