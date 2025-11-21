export interface DMRoom {
  id: number;
  user_a: string;
  user_b: string;
  created_at: string;
}

export interface DMMessage {
  id: number;
  dm_id: number;
  sender: string;
  content: string;
  created_at: string;
}
