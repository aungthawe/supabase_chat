import { supabase } from "./supabaseClient";

export async function getOrCreateDM(userA: string, userB: string) {
  const sorted = [userA, userB].sort();

  const { data: found } = await supabase
    .from("dms")
    .select("*")
    .or(`user_a.eq.${sorted[0]},user_b.eq.${sorted[1]}`)
    .maybeSingle();

  if (found) return found;

  const { data: created, error } = await supabase
    .from("dms")
    .insert({
      user_a: sorted[0],
      user_b: sorted[1],
    })
    .select()
    .single();

  return created;
  
}

export async function sendDM(dm_id: number, sender: string, text: string) {
  return await supabase.from("dm_messages").insert({
    dm_id,
    sender,
    content: text,
  });
}
