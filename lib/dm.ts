// /lib/dm.ts
"use client";
import { supabase } from "./supabaseClient";
import { DM, DMMessage } from "../types/db";

/** Create or return existing DM by ensuring a deterministic pair order */
export async function createOrGetDM(userA: string, userB: string) {
  // ensure order so user_a < user_b for uniqueness
  const [a, b] = userA < userB ? [userA, userB] : [userB, userA];

  // try to find existing
  const { data: existing } = await supabase
    .from("dms")
    .select("*")
    .eq("user_a", a)
    .eq("user_b", b)
    .limit(1)
    .single();

  if (existing) return existing;

  // create
  const { data, error } = await supabase
    .from("dms")
    .insert({ user_a: a, user_b: b })
    .select()
    .single();
  if (error) throw error;
  return data as DM;
}

/** send DM message */
export async function sendDMMessage(
  dm_id: number,
  sender: string,
  content: string,
  metadata = {}
) {
  console.log("senting message");
  const { data, error } = await supabase
    .from("dm_messages")
    .insert({ dm_id, sender, content, metadata })
    .select()
    .single();

  if (error) throw error;
  return data as DMMessage;
}

/** fetch message history for a DM (paginated/simple) */
export async function fetchDMMessages(dm_id: number, limit = 100) {
  const { data, error } = await supabase
    .from("dm_messages")
    .select("*")
    .eq("dm_id", dm_id)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data as DMMessage[];
}

/** subscribe to insert events on dm_messages for a dm_id */
export function subscribeToDM(
  dm_id: number,
  callback: (msg: DMMessage) => void
) {
  const channel = supabase
    .channel(`dm:${dm_id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "dm_messages",
        filter: `dm_id=eq.${dm_id}`,
      },
      (payload) => {
        callback(payload.new as DMMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}


export function subscribeTyping(dmId: number, callback: (data: any) => void) {
  const channel = supabase.channel(`dm-${dmId}-typing`);

  channel.on("broadcast", { event: "typing" }, (payload) => {
    callback(payload);
  });

  channel.subscribe();

  return channel;
}

export function sendTyping(channel: any, userId: string, isTyping: boolean) {
  channel.send({
    type: "broadcast",
    event: "typing",
    payload: { userId, isTyping },
  });
}
