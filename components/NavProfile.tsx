"use client";

import Image from "next/image";
import { useUserStore } from "@/store/useStore";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NavProfile() {
  const { currentUser, setCurrentUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.push("/login");
  };

  if (!currentUser) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-white/40 backdrop-blur-md flex justify-between items-center p-2 shadow-sm">
      <div className="flex gap-2 items-center ml-3">
        <div className="w-10 h-10 overflow-hidden">
          <Image
            src={currentUser.avatar_url || "/chat.png"}
            alt="profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>{" "}
        <h1 className="font-bold text-xl text-purple-800">ChatApp</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full  overflow-hidden">
          <Image
            src={currentUser.avatar_url || "/user.png"}
            alt="profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm">
            {currentUser.username || "Anonymous"}
          </span>
          <span className="text-xs text-green-400">Online</span>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="ml-2 px-2 py-1 text-md font-semibold rounded-lg bg-purple-500 text-white hover:bg-purple-700 cursor-pointer transition-color duration-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
