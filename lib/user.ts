export const timeAgo = (timestamp: string) => {
  const now = Date.now(); // current time in milliseconds
  const lastActiveDate = new Date(timestamp).getTime(); // convert to milliseconds
  const diffInSeconds = Math.floor((now - lastActiveDate) / 1000);

  let timeString = "active";

  if (diffInSeconds < 14) {
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
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    timeString += ` ${days} day${days > 1 ? "s" : ""} ago`;
  }

  return `${timeString}`;
};


