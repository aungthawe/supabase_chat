// /lib/dm.ts
"use client";
import { supabase } from "./supabaseClient";
import { DM, DMMessage } from "../types/db";

export async function createOrGetDM(userA: string, userB: string) {
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

export async function sendDMMessage(
  dm_id: number,
  sender: string,
  content: string,
  metadata = {}
) {
  const { data, error } = await supabase
    .from("dm_messages")
    .insert({ dm_id, sender, content, metadata })
    .select()
    .single();

  if (error) throw error;

  console.log("senting message is completed");
  return data as DMMessage;
}

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
