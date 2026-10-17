// TutorProfile.jsx
// Read-only public page for one tutor: their info, rating, courses, and videos.
// Same pattern as AdminDashboard: loads its own data with useEffect + apiFetch.
//
// ASSUMPTIONS to check:
//  1. You use react-router-dom and this page's route has the tutor id in it,
//     e.g. <Route path="/tutors/:tutorId" element={<TutorProfile />} />
//  2. profileUrl(id) matches your Flask route and returns the JSON you pasted:
//     { tutor_info: {...}, tutor_videos: [...] }
//  3. Video pages live at /videos/:id.
//  4. apiFetch lives in "../api", returns parsed JSON, and throws on non-2xx.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import { PageLoader } from "./Spinner";

const profileUrl = (id) => `tutors/${id}`;

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const splitCourses = (courses = "") =>
  courses
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

// Same deterministic navy / pale-gold alternation the design system uses for course codes:
// the same code always gets the same color, so "SEN 305" looks identical everywhere.
const hashCode = (s) =>
  [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 0);

function CodePill({ code }) {
  const dark = hashCode(code) % 2 === 0;
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        dark ? "bg-navy text-cream" : "bg-pill text-navy"
      }`}
    >
      {code}
    </span>
  );
}

function StarRating({ rating = 0, size = 16 }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={
            n <= Math.round(rating)
              ? "fill-gold stroke-gold"
              : "fill-none stroke-gray-300"
          }
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
      Verified tutor
    </span>
  );
}

export default function TutorProfile() {
  const { tutorId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Re-runs when the tutor in the URL changes (tutorId) or when Retry is clicked (reloadKey).
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFetch(profileUrl(tutorId));
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Couldn't load this tutor.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tutorId, reloadKey]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream px-4 py-10">
        <PageLoader label="Loading tutor…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-danger">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-navy hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const { tutor_info: tutor, tutor_videos: videos = [] } = data;
  const courses = splitCourses(tutor.courses);

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy text-2xl font-semibold text-cream ring-4 ring-gold/50">
              {initials(tutor.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-navy">
                  {tutor.name}
                </h1>
                {tutor.is_approved && <VerifiedBadge />}
              </div>
              <p className="mt-1 text-gray-500">
                {tutor.department} · {tutor.level} level
              </p>
              <div className="mt-2 flex items-center gap-2">
                {tutor.total_reviews > 0 ? (
                  <>
                    <StarRating rating={tutor.avg_rating} />
                    <span className="text-sm text-gray-500">
                      {tutor.avg_rating.toFixed(1)} · {tutor.total_reviews}{" "}
                      {tutor.total_reviews === 1 ? "review" : "reviews"}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No reviews yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5 border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-sm font-medium text-navy">Teaches</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {courses.map((c) => (
                  <CodePill key={c} code={c} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-navy">About</h2>
              <p className="mt-2 break-words text-gray-500">{tutor.bio}</p>
            </div>
          </div>
        </section>

        {/* Videos */}
        <section>
          <h2 className="text-lg font-bold tracking-tight text-navy">
            Videos{" "}
            <span className="font-normal text-gray-400">({videos.length})</span>
          </h2>

          {videos.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <p className="text-gray-500">No videos yet. Check back soon.</p>
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {videos.map((v) => (
                <li key={v.id}>
                  <Link
                    to={`/videos/show_video/${v.id}`}
                    className="block h-full rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  >
                    <CodePill code={v.course_code} />
                    <p className="mt-4 font-bold tracking-tight text-navy">
                      {v.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
