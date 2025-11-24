// /lib/user.ts
"use client";
import { supabase } from "./supabaseClient";
import { Profile } from "../types/db";

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("username", { ascending: true });
  if (error) throw error;
  return data as Profile[];
}

/** listen for realtime profile inserts/updates */
export function subscribeProfiles(cb: (p: Profile) => void) {
  const channel = supabase
    .channel("profiles")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "profiles" },
      (payload) => {
        cb(payload.new as Profile);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
