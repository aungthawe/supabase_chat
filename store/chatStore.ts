import { create } from "zustand";
import { Message } from "@/types/message";

interface ChatState {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  // addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  addMessage: (msg) =>
    set((state) => {
      // if message id already exists, skip
      if (state.messages.some((m) => m.id === msg.id)) return state;

      return { messages: [...state.messages, msg] };
    }),
}));
