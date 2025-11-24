"use client";

import { useState } from "react";
import { signInWithEmailOtp } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleLogin() {
    await signInWithEmailOtp(email);
    toast.success("Magic link sent!");
  }

  return (
    <div className="p-4 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-xl font-bold">Login</h1>

      <input
        className="border p-2 rounded"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="bg-purple-600 text-white p-2 rounded"
        onClick={handleLogin}
      >
        Send Login Link
      </button>
    </div>
  );
}
