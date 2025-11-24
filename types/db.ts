// /types/db.ts
export type UUID = string;

export interface Profile {
  id: UUID; // auth.users.id
  username?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
  // optional helper field if you want to track last_active timestamp
  last_active?: string | null;
}

export interface DM {
  id: number;
  user_a: UUID;
  user_b: UUID;
  created_at?: string | null;
}

export interface DMMessage {
  id: number;
  dm_id?: number | null;
  sender: UUID;
  content: string;
  metadata?: Record<string, any>;
  created_at?: string | null;
}

export interface Message {
  id: number;
  room_id?: number | null;
  user_id: UUID;
  content: string;
  metadata?: Record<string, any>;
  created_at?: string | null;
}
