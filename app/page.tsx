// app/page.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/useStore";
import { getProfile } from "@/lib/auth";
import ChatUI from "@/components/ChatUi";

export default function Home() {
  const { setUser, setProfile, loading, setLoading } = useAuthStore();
  const { currentUser, setCurrentUser } = useUserStore();

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
      //console.log("profile of useauthstore:" + profile);
    }

    init();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return <ChatUI />;
}
