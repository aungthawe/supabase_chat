import { supabase } from "@lib/supabaseClient";
import { touchLastActive } from "./auth";

let interval: NodeJS.Timer | null = null;

export function startPresence(userId: string) {
  // update immediately
  touchLastActive(userId);

  // then every 15-20s
  interval = setInterval(() => {
    touchLastActive(userId);
  }, 15000);

  // update when tab becomes active
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) touchLastActive(userId);
  });
}

export function stopPresence() {
  if (interval) clearInterval(interval);
}
