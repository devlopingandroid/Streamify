import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes dynamically with priority resolution.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string into a human-readable format.
 */
export function formatDate(dateInput, format = "standard") {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  if (format === "compact") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats numbers into shorthand annotations (e.g., 1.2M, 4.5K).
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  }
  
  return String(num);
}

/**
 * Truncates text length with an ellipsis.
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
