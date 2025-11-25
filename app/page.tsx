// app/page.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/useStore";
import { getProfile } from "@/lib/auth";
import ChatUI from "@/components/ChatUi";
import { startPresence } from "@/lib/presence";

export default function Home() {
  const { setUser, setProfile, loading, setLoading } = useAuthStore();

  const { setCurrentUser } = useUserStore();
  const currentUser = useUserStore((s) => s.currentUser);
  useEffect(() => {
    if (currentUser?.id) startPresence(currentUser.id);
  }, [currentUser?.id]);

  
  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }
      console.log("session user ;" + session.user);
      const user = session.user;

      setUser(user);
      const profile = await getProfile(user.id);

      if (!profile) {
        window.location.href = "/onboarding";
        return;
      }

      setCurrentUser(profile);
      setProfile(profile);
      setLoading(false);

      // console.log("user of useauthstore:"+user)
      console.log("current user from root  useUserstore:" + currentUser?.id);
    }

    init();
  }, []);

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
