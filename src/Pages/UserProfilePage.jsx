// UserProfile.jsx
// Assumes tailwind.config has colors: navy #14213D, gold #FFB627, cream #FAFAF7, pill #FFE9B8
// Usage: <UserProfile profile={data} />  (data = the JSON from your profile endpoint)
import { useEffect } from "react";
import { apiFetch } from "../api";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { avatarUrl } from "../components/tools";
import { useNavigate } from "react-router-dom";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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

function Pill({ children }) {
  return (
    <span className="rounded-full bg-pill px-3 py-1.5 text-sm font-medium text-navy">
      {children}
    </span>
  );
}

const PATH = "users/profile";
export default function UserProfilePage() {
  const [profile, setProfile] = useState({});
  const {
    name,
    university,
    faculty,
    department,
    level,
    reviews = [],
  } = profile;
  const previewUrl = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  function handleManageAvatar() {
    navigate("/users/upload_avatar");
  }
  const count = reviews.length;
  const average = count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  useEffect(() => {
    async function getUserInfo() {
      try {
        const data = await apiFetch(PATH, { method: "GET" });
        console.log(data);
        setProfile(data);
        console.log(profile);
        // setVideos(data?.tutor_videos);
      } catch (err) {
        console.log(err);
        // setError(err.data);
      } finally {
        // setLoading(false);
      }
    }
    getUserInfo();
  }, []);
  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-navy ring-2 ring-gold/50">
              {/* <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy text-2xl font-semibold text-cream ring-4 ring-gold/50"> */}
              {user?.avatar_filename ? (
                <img
                  src={`${avatarUrl}/${user.avatar_filename}`}
                  alt={user.full_name || "User Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-cream">
                  {initials(name)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-navy">
                {cap(name)}
              </h1>
              <p className="mt-1 text-gray-500">{university}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>{cap(faculty)} faculty</Pill>
            <Pill>{cap(department)} department</Pill>
            <Pill>{level} level</Pill>
            <span className="rounded-full bg-gold px-3 py-1.5 text-sm font-medium text-navy">
              <button onClick={handleManageAvatar}>Manage Avatar</button>
            </span>
          </div>
        </section>

        {/* Reviews */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold tracking-tight text-navy">
              Reviews written
            </h2>
            {count > 0 && (
              <div className="flex items-center gap-2">
                {/* <StarRating rating={average} /> */}
                <span className="text-sm text-gray-500">
                  {count} {count === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}
          </div>

          {count === 0 ? (
            <p className="mt-6 text-gray-500">
              No reviews yet. Unlock a video and rate it to see your reviews
              here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {reviews.map((r) => (
                <li key={r.review_id} className="py-5 first:pt-2 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`/videos/${r.video_id}`}
                      className="font-medium text-gold"
                    >
                      {r.video_title}
                    </a>
                    <time
                      dateTime={r.created_at}
                      className="text-sm text-gray-400"
                    >
                      {formatDate(r.created_at)}
                    </time>
                  </div>
                  <div className="mt-2">
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <p className="mt-2 text-gray-500">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
