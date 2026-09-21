/**
 * Shared helpers — pulled out of VideoCard/VideosPage/VideoAccessUnlocked/
 * VideoLocked, which all had their own copies of these. Import from here
 * in all of them going forward instead of re-defining locally.
 */

export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function parseCourseCode(code = "") {
  const match = code.match(/^([A-Za-z]+)\s*0*(\d+)/);
  if (!match) return { department: code || "General", level: 0 };
  const [, letters, digits] = match;
  const level = Math.floor(Number(digits) / 100) * 100;
  return { department: letters.toUpperCase(), level: level || 0 };
}

export function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatViews(n) {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

/** Pulls the 11-char video ID out of youtu.be, watch?v=, or /embed/ links. */
export function extractYouTubeId(url = "") {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
