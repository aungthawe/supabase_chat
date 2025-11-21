import { DMRoom, DMMessage } from "./dm";
import { Profile } from "./profile";
import { Message } from "./message";

export interface ChatState {
  currentUser: Profile | null;

  onlineUsers: Profile[];
  messages: Message[]; // group chat (you haven't defined group msg type)
  dmMessages: DMMessage[];

  selectedUser: Profile | null;
  activeDM: DMRoom | null;
}

export interface ChatActions {
  setCurrentUser: (user: Profile) => void;

  setOnlineUsers: (users: Profile[]) => void;

  selectUserForDM: (user: Profile) => Promise<void>;

  loadDMMessages: (dm_id: number) => Promise<void>;

  subscribeDM: (dm_id: number) => void;

  addMessage: (msg: Message) => void;
}

export type ChatStore = ChatState & ChatActions;
// ⭐ ADD THIS ⭐
