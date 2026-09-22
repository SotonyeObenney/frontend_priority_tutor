import { useMemo, useState, useRef } from "react";
import { Eye, User, ChevronLeft, ChevronRight, X } from "lucide-react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * VideosPage — feed / carousel view, Ink and Sun palette
 * ------------------------------------------------------------
 * Data assumptions (see chat for full reasoning):
 * - `department` and `level` are derived from `course_code` when the
 *   video object doesn't already have them. Parses e.g. "COS 202" into
 *   department "COS", level 200 (hundreds digit). Pass real
 *   `video.department` / `video.level` once your backend has them and
 *   this stops guessing.
 * - A video counts as free if `is_free` OR `price === 0` — covers the
 *   current backend inconsistency where some free-priced videos still
 *   have `is_free: false`.
 * - No thumbnail field exists (and per your design system, we don't want
 *   fake stock thumbnails anyway) — the course-code badge IS the
 *   thumbnail, same pattern as the video-card convention already in
 *   DESIGN_SYSTEM.md.
 *
 * Behavior:
 * - Default view: horizontal shelves — "Most watched" first (real data,
 *   just re-sorted), then one shelf per department+level combo.
 * - Department chips + a level select filter the whole page. Once any
 *   filter is active, shelves collapse into a single flat grid (a
 *   filtered result set doesn't benefit from being chopped into rows).
 * - Every card shows its level as a small badge, per your ask to always
 *   be able to see what level a video belongs to while browsing.
 *
 * Props:
 *   videos: array of { id, course_code, title, tutor_name, price,
 *            is_free, view_count, department?, level? }
 *   onSelectVideo: (id) => void
 */

// useEffect(() => {

//   async function getVideos() {

//     try
//     {const data = await apiFetch("videos/", { method: "GET" })}
//   }

//   return () => {
//     second;
//   };
// }, [third]);

function parseCourseCode(code = "") {
  const match = code.match(/^([A-Za-z]+)\s*0*(\d+)/);
  if (!match) return { department: code || "General", level: 0 };
  const [, letters, digits] = match;
  const level = Math.floor(Number(digits) / 100) * 100;
  return { department: letters.toUpperCase(), level: level || 0 };
}

function withDerivedFields(video) {
  const parsed = parseCourseCode(video.course_code);
  return {
    ...video,
    department: video.department ?? parsed.department,
    level: video.level ?? parsed.level,
    isFree: Boolean(video.is_free || video.price === 0),
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatViews(n) {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

function VideoCard({ video, onSelectVideo }) {
  const isNavyThumb = hashCode(video.course_code) % 2 === 0;

  return (
    <button
      onClick={() => onSelectVideo(video.id)}
      className="group w-50 shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-shadow hover:shadow-md sm:w-[220px]"
    >
      {/* "thumbnail" — course code as the visual, per design system */}
      <div
        className={`relative flex aspect-video w-full items-center justify-center ${
          isNavyThumb ? "bg-navy" : "bg-pill"
        }`}
      >
        <span
          className={`text-lg font-bold tracking-tight ${
            isNavyThumb ? "text-cream" : "text-navy"
          }`}
        >
          {video.course_code}
        </span>

        {video.level > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-navy">
            {video.level}L
          </span>
        )}

        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            video.isFree ? "bg-success/15 text-success" : "bg-gold text-navy"
          }`}
        >
          {video.isFree ? "Free" : formatNaira(video.price)}
        </span>
      </div>

      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-navy">
          {video.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{video.tutor_name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Eye className="h-3.5 w-3.5" />
          <span>{formatViews(video.view_count)} views</span>
        </div>
      </div>
    </button>
  );
}

function Shelf({ title, videos, onSelectVideo, id }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy sm:text-lg">{title}</h2>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-navy hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-navy hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onSelectVideo={onSelectVideo} />
        ))}
      </div>
    </section>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function getVideos() {
      try {
        const data = await apiFetch("videos/", { method: "GET" });
        setVideos(data?.videos);
      } catch (err) {
        setError(err.data);
      } finally {
        setLoading(false);
      }
    }
    getVideos();
  }, []);
  const handleSelectVideo = (video_id) => {
    navigate(`/videos/show_video/${video_id}`);
  };

  const enriched = useMemo(() => videos.map(withDerivedFields), [videos]);

  const [department, setDepartment] = useState("all");
  const [level, setLevel] = useState("all");

  const departments = useMemo(
    () => [...new Set(enriched.map((v) => v.department))].sort(),
    [enriched],
  );
  const levels = useMemo(
    () =>
      [...new Set(enriched.map((v) => v.level))]
        .filter((l) => l > 0)
        .sort((a, b) => a - b),
    [enriched],
  );

  const filtersActive = department !== "all" || level !== "all";

  const filtered = useMemo(
    () =>
      enriched.filter(
        (v) =>
          (department === "all" || v.department === department) &&
          (level === "all" || v.level === level),
      ),
    [enriched, department, level],
  );

  const mostWatched = useMemo(
    () =>
      [...enriched]
        .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
        .slice(0, 10),
    [enriched],
  );

  const shelves = useMemo(() => {
    const groups = new Map();
    for (const v of enriched) {
      const key = `${v.department}-${v.level}`;
      if (!groups.has(key))
        groups.set(key, {
          department: v.department,
          level: v.level,
          videos: [],
        });
      groups.get(key).videos.push(v);
    }
    return [...groups.values()].sort(
      (a, b) => a.department.localeCompare(b.department) || a.level - b.level,
    );
  }, [enriched]);

  return (
    <div className="min-h-screen bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-navy">
          Videos
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDepartment("all")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              department === "all"
                ? "bg-navy text-cream"
                : "border border-gray-300 text-gray-500 hover:bg-white"
            }`}
          >
            All departments
          </button>
          {departments.map((d) => (
            <a
              key={d}
              href={department === "all" ? `#dept-${d}` : undefined}
              onClick={() => setDepartment(d === department ? "all" : d)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                department === d
                  ? "bg-navy text-cream"
                  : "border border-gray-300 text-gray-500 hover:bg-white"
              }`}
            >
              {d}
            </a>
          ))}

          <select
            value={level}
            onChange={(e) =>
              setLevel(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="ml-auto h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-navy outline-none focus:border-navy"
          >
            <option value="all">All levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l} level
              </option>
            ))}
          </select>

          {filtersActive && (
            <button
              onClick={() => {
                setDepartment("all");
                setLevel("all");
              }}
              className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-gray-500 hover:text-navy"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Filtered flat grid vs. shelves */}
        {filtersActive ? (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {filtered.length} result{filtered.length !== 1 && "s"}
            </p>
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-400">
                No videos match those filters yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filtered.map((v) => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    onSelectVideo={handleSelectVideo}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <Shelf
              title="Most watched"
              videos={mostWatched}
              onSelectVideo={handleSelectVideo}
            />
            {shelves.map((s) => (
              <Shelf
                key={`${s.department}-${s.level}`}
                id={`dept-${s.department}`}
                title={`${s.department} \u2022 ${s.level > 0 ? `${s.level} level` : "General"}`}
                videos={s.videos}
                onSelectVideo={handleSelectVideo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
