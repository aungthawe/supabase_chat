import { supabase } from "@lib/supabaseClient";
import { touchLastActive } from "./auth";

let interval: number | null = null;

export function startPresence(userId: string) {
  // update immediately
  touchLastActive(userId);

  // then every 30s
  interval = window.setInterval(() => {
    touchLastActive(userId);
  }, 30000);

  // update when tab becomes active
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) touchLastActive(userId);
  });
}

export function stopPresence() {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
}
