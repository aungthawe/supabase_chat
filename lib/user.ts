import { Profile } from "@/types/db";
import { supabase } from "./supabaseClient";

export const timeAgo = (timestamp: string) => {
  const now = Date.now(); // current time in milliseconds
  const lastActiveDate = new Date(timestamp).getTime(); // convert to milliseconds
  const diffInSeconds = Math.floor((now - lastActiveDate) / 1000);

  let timeString = "active";

  if (diffInSeconds < 30) {
    // timeString = `${diffInSeconds} seconds ago`;
    timeString = `Online`;
  } else if (diffInSeconds < 60) {
    timeString += ` ${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeString += ` ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeString += ` ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2 * 86400) {
    const days = Math.floor(diffInSeconds / 86400);
    timeString += ` ${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    timeString += " long time ago";
  }

  return `${timeString}`;
};

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw error;
  return data as Profile[];
}
