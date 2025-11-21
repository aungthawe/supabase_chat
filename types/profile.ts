import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  updated_at: Timestamp;
}
