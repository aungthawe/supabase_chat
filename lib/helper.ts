import { supabase } from "@/lib/supabaseClient";

export async function ensureProfile() {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If exists → return it
  if (profile) return profile;

  // Otherwise create default profile
  const { data: newProfile, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      username: user.email?.split("@")[0] ?? "user",
      avatar_url: null,
      created_at: Date.now(),
    })
    .select()
    .single();

  if (error) console.error("Profile creation error:", error);
  return newProfile;
}
