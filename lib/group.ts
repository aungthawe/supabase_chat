"use client";

import { supabase } from "./supabaseClient";
import { Message, Profile } from "@/types/db";

export async function createGroup(title: string, members: Profile[]) {
  const { data: group, error } = await supabase
    .from("rooms")
    .insert({ title })
    .select()
    .single();

  if (error) throw error;

  const rows = members.map((id) => ({
    group_id: group.id,
    user_id: id,
  }));

  await supabase.from("group_members").insert(rows);

  return group;
}

export async function fetchUserGroups(userId: string) {
  const { data } = await supabase
    .from("group_members")
    .select("group_chats(*)")
    .eq("user_id", userId);

  return data?.map((row) => row.group_chats) || [];
}


export async function sendGroupMessage(
  groupId: number,
  senderId: string,
  content: string
) {
  const { data, error } = await supabase
    .from("group_messages")
    .insert({ group_id: groupId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeGroup(groupId: number, callback: (msg: Message) => void) {
  const channel = supabase.channel(`group-${groupId}`);

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "group_messages",
      filter: `group_id=eq.${groupId}`,
    },
    (payload) => {
      callback(payload.new as Message);
    }
  );

  channel.subscribe();

  return channel;
}
