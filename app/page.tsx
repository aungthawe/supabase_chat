"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

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
