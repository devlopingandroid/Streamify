/**
 * Formats duration in seconds to standard time format HH:MM:SS or MM:SS
 */
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => String(num).padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${mins}:${pad(secs)}`;
};

/**
 * Formats views counts to compact abbreviations (e.g. 1500 -> 1.5K, 2400000 -> 2.4M)
 */
export const formatViews = (views) => {
  if (views >= 1e9) {
    return `${(views / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (views >= 1e6) {
    return `${(views / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (views >= 1e3) {
    return `${(views / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(views || 0);
};

/**
 * Calculates and formats a relative time representation (e.g. "2 hours ago")
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};
