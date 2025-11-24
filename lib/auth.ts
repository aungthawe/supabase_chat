// /lib/auth.ts
"use client";
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@/types/db";

/** send OTP magic link to email (Supabase: signInWithOtp) */
export async function signInWithEmailOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const user = supabase.auth.getUser
    ? (await supabase.auth.getUser()).data.user
    : null;
  if (!user) return null;
  // fetch profile row
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) return null;
  return data as Profile;
}

/** Upsert a profile row (id must be user's uuid) */
export async function upsertProfile(
  profile: Partial<Profile> & { id: string }
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile)
    .select()
    .single();
  return { data, error };
}

/** keep last_active timestamp (string ISO) on the profile */
export async function touchLastActive(id: string) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id, last_active: now, updated_at: now })
    .select();
  return { data, error };
}

export async function signInWithEmail(email: string) {
  return await supabase.auth.signInWithOtp({
    email,
    shouldCreateUser: true,
  });
}

export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return data as Profile | null;
}

export async function createProfile(id: string, username: string) {
  console.log("creating profile for user!!");
  await supabase.from("profiles").insert({
    id,
    username,
    updated_at: new Date().toISOString(),
  });
}

export async function createFirstProfile(id: string) {
  console.log("creating profile with no name just id;");
  await supabase.from("profiles").insert({
    id,
    updated_at: new Date().toLocaleDateString(),
  });
}
