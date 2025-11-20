"use client";
import { useState } from "react";
import { supabase } from "@lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert(error.message);
    alert("Check your email for the magic link!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
      />
      <button onClick={handleLogin}>Send Magic Link</button>
    </div>
  );
}
