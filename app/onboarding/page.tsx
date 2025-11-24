"use client";

import { useState } from "react";
import { createProfile } from "@/lib/auth";
//import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  //const { user } = useAuthStore();
  // Initialize the router
  const router = useRouter();
  async function handleSave() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("log from handlesave" + session?.user);
    if (!session?.user || !name) {
      console.log("THere is no user");
      return;
    }
    try {
      if (session?.user != null) await createProfile(session?.user?.id, name);
      toast.success("Profile created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create profile.");
      console.error(error);
    }
  }

  return (
    <div className="p-4 gap-4 flex flex-col max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Set up your profile</h2>
      <input
        className=" p-2 rounded"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white p-2 rounded cursor-pointer hover:bg-purple-900"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
