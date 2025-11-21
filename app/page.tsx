"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const router = useRouter();

  const { user, init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log(data);

      if (data.user) {
        toast.success("Welcome to chat!");
        router.push("/chat");
      } else {
        router.push("/login");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="text-center text-blue-500 font-xl py-6">Loading...</div>
  );
}
