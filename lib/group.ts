"use client";

import { UUID } from "crypto";
import { supabase } from "./supabaseClient";
import { Message, Profile, Room } from "@/types/db";

export async function createGroup(
  title: string,
  createdBy: string,
  members: Profile[]
) {
  const { data: group, error } = await supabase
    .from("rooms")
    .insert({ title: title, created_by: createdBy })
    .select()
    .single();

  if (error) throw error;

  const rows = members.map((id) => ({
    room_id: group.id,
    user_id: id,
  }));

  await supabase.from("room_members").insert(rows);

  return group;
}

export async function fetchUserGroups(userId: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from("room_members")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
  console.log(
    "Fetched data for userId:_" + userId.trim(),
    "Data length:",
    data ? data.length : "undefined"
  );
  const roomIds: number[] = data ? data.map((row) => Number(row.room_id)) : [];

  const rooms = await fetchFullRoomDetails(roomIds);
  return rooms;
}

export async function sendGroupMessage(
  groupId: number,
  senderId: string,
  content: string
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ group_id: groupId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeGroup(
  groupId: number,
  callback: (msg: Message) => void
) {
  const channel = supabase.channel(`group-${groupId}`);

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `room_id=eq.${groupId}`,
    },
    (payload) => {
      callback(payload.new as Message);
    }
  );

  channel.subscribe();

  return channel;
}

const fetchFullRoomDetails = async (roomIds: number[]): Promise<Room[]> => {
  const { data } = await supabase.from("rooms").select("*").in("id", roomIds);
  return data || [];
};
