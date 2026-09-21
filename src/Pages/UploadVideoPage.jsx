import { useState } from "react";
import { CheckCircle2, XCircle, Eye, User } from "lucide-react";
import {
  hashCode,
  parseCourseCode,
  formatNaira,
  extractYouTubeId,
} from "../components/videoUtils";

/**
 * UploadVideoPage — tutor-side video upload form with a live preview.
 * ------------------------------------------------------------
 * Two previews, on purpose:
 * 1. The actual YouTube embed, so a tutor can confirm they pasted the
 *    right link before submitting (catches copy-paste mistakes early).
 * 2. A miniature of the exact feed card students will see (same
 *    thumbnail hash, same level badge, same free/price badge logic as
 *    VideosPage) — showing "this is what you're about to publish" is
 *    worth the extra real estate on an upload form.
 *
 * API quirks this form works around (see chat for the fuller reasoning):
 * - `is_free` is sent to your backend as the *string* "True"/"False",
 *   not a real boolean. Internal state here is a proper boolean; it's
 *   only converted at the point of building the submit payload.
 * - Price is disabled (and zeroed) whenever "free" is on, since a paid
 *   price on a free video doesn't mean anything, even though your
 *   sample payload had exactly that combination.
 *
 * Props:
 *   tutorName: string           — for the feed-card preview
 *   onSubmit: (payload) => void — payload matches your API shape exactly
 *   onCancel: () => void
 */

function FeedCardPreview({ title, courseCode, tutorName, price, isFree }) {
  const code = courseCode || "COURSE";
  const isNavy = hashCode(code) % 2 === 0;
  const { level } = parseCourseCode(code);

  return (
    <div className="w-[220px] overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div
        className={`relative flex aspect-video w-full items-center justify-center ${isNavy ? "bg-navy" : "bg-pill"}`}
      >
        <span
          className={`text-lg font-bold tracking-tight ${isNavy ? "text-cream" : "text-navy"}`}
        >
          {code}
        </span>
        {level > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-navy">
            {level}L
          </span>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isFree ? "bg-success/15 text-success" : "bg-gold text-navy"
          }`}
        >
          {isFree ? "Free" : formatNaira(price)}
        </span>
      </div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-navy">
          {title || "Video title"}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{tutorName || "You"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Eye className="h-3.5 w-3.5" />
          <span>0 views</span>
        </div>
      </div>
    </div>
  );
}

export default function UploadVideoPage({
  tutorName = "",
  onSubmit = () => {},
  onCancel = () => {},
}) {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);

  const videoId = extractYouTubeId(youtubeUrl);
  const urlTouched = youtubeUrl.trim().length > 0;

  const canSubmit =
    title.trim() &&
    courseCode.trim() &&
    description.trim() &&
    videoId &&
    (isFree || Number(price) > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      course_code: courseCode.trim().toUpperCase(),
      description: description.trim(),
      youtube_url: youtubeUrl.trim(),
      price: isFree ? 0 : Number(price),
      is_free: isFree ? "True" : "False", // backend expects this exact string, not a real boolean
    });
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-navy">
          Upload a video
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Students will see this exactly as previewed on the right once it's
          published.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Test Video"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-navy outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Course code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="TST 101"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-navy outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="This is a test video for development purposes"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                YouTube link
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtu.be/njX2bu-_Vw4"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-navy outline-none focus:border-navy"
              />
              {urlTouched && (
                <p
                  className={`mt-1.5 flex items-center gap-1.5 text-xs ${videoId ? "text-success" : "text-danger"}`}
                >
                  {videoId ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {videoId
                    ? "Video found"
                    : "That doesn't look like a valid YouTube link"}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-navy">
                  Make this video free
                </p>
                <p className="text-xs text-gray-400">
                  Students won't be charged to watch it.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isFree}
                onClick={() => setIsFree((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  isFree ? "bg-success" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    isFree ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  &#8358;
                </span>
                <input
                  type="number"
                  min="0"
                  value={isFree ? "" : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  placeholder="2000"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-navy outline-none focus:border-navy disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-300 text-sm font-semibold text-navy hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-cream transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                Upload video
              </button>
            </div>
          </form>

          {/* Preview column */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Video preview
              </p>
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-navy">
                {videoId ? (
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Video preview"
                    allow="encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <span className="px-4 text-center text-xs text-cream/50">
                    Paste a YouTube link to preview it here
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feed card preview
              </p>
              <FeedCardPreview
                title={title}
                courseCode={courseCode}
                tutorName={tutorName}
                price={Number(price) || 0}
                isFree={isFree}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
