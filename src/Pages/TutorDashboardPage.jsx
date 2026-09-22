import { useState, useMemo } from "react";
import {
  Wallet,
  Eye,
  Star,
  Video,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  hashCode,
  parseCourseCode,
  formatNaira,
  formatViews,
} from "../components/videoUtils";
import { useEffect } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * TutorDashboard — Ink and Sun palette
 * ------------------------------------------------------------
 * Data gaps this works around (fuller reasoning in chat):
 * - `amount_paid`'s meaning (revenue generated vs. already disbursed) is
 *   ambiguous, so the card is labeled with the exact field name rather
 *   than assuming "Total earned." The "Request payout" button is a
 *   suggested addition, not a confirmed-correct one — wire it up once
 *   the field's meaning and a real payout endpoint both exist.
 * - `tutor_videos` entries only have {id, title, course_code} — no
 *   per-video views/price/rating. Cards show only what's real; nothing
 *   is faked with a "—" placeholder that looks broken.
 *
 * Props:
 *   tutorName: string
 *   stats: { amount_paid, total_reviews, total_views }
 *   videos: [{ id, title, course_code }]
 *   onUploadVideo: () => void
 *   onEditVideo: (id) => void
 *   onDeleteVideo: (id) => void
 *   onRequestPayout: () => void
 */

function VideoThumb({ courseCode }) {
  const isNavy = hashCode(courseCode) % 2 === 0;
  const { level } = parseCourseCode(courseCode);
  return (
    <div
      className={`relative flex h-16 w-24 shrink-0 items-center justify-center rounded-lg ${isNavy ? "bg-navy" : "bg-pill"}`}
    >
      <span
        className={`text-xs font-bold ${isNavy ? "text-cream" : "text-navy"}`}
      >
        {courseCode}
      </span>
      {level > 0 && (
        <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-navy shadow-sm">
          {level}L
        </span>
      )}
    </div>
  );
}

function VideoRow({ video, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
      <VideoThumb courseCode={video.course_code} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">
          {video.title}
        </p>
        <p className="text-xs text-gray-400">{video.course_code}</p>
        <span className=" text-gray-400 flex items-center gap-1">
          <Eye className="h-2.5 w-2.5" />
          <p className="text-xs text-gray-400">{video.views}</p>
        </span>
      </div>

      {confirmingDelete ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs font-medium text-gray-500 sm:inline">
            Delete this video?
          </span>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="flex h-8 items-center justify-center rounded-lg border border-gray-300 px-3 text-xs font-semibold text-navy"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="flex h-8 items-center justify-center rounded-lg bg-danger px-3 text-xs font-semibold text-white"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(video.id)}
            aria-label="Edit video"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-cream hover:text-navy"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete video"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = false, action }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-gold/40 bg-gold/10" : "border-gray-200 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent ? "bg-gold" : "bg-cream"}`}
        >
          <Icon className={`h-4 w-4 ${accent ? "text-navy" : "text-navy"}`} />
        </span>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-navy">{value}</p>
      {action}
    </div>
  );
}

export default function TutorDashboardPage({
  onEditVideo = () => {},
  onDeleteVideo = () => {},
  onRequestPayout = () => {},
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tutorName = user?.full_name;
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    amount_paid: "",
    review_count: "",
    total_view_count: "",
    video_count: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  function onUploadVideo() {
    navigate("/videos/upload");
  }

  const PATH = "tutors/dashboard";
  useEffect(() => {
    async function getDashboardInfo() {
      try {
        const data = await apiFetch(PATH, { method: "GET" });
        console.log(data);
        setStats({
          amount_paid: data?.amount_paid,
          review_count: data?.review_count,
          total_view_count: data?.total_view_count,
          video_count: data?.video_count,
        });
        setVideos(data?.tutor_videos);
      } catch (err) {
        setError(err.data);
      } finally {
        setLoading(false);
      }
    }
    getDashboardInfo();
  }, []);

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.course_code.toLowerCase().includes(q),
    );
  }, [videos, query]);

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy">
              Welcome back, {tutorName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your videos and track how they're doing.
            </p>
          </div>
          <button
            onClick={onUploadVideo}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Upload video
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Wallet}
            label="Amount paid"
            value={formatNaira(stats.amount_paid)}
            accent
            action={
              <button
                onClick={onRequestPayout}
                className="mt-3 text-xs font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy"
              >
                Request payout
              </button>
            }
          />
          <StatCard
            icon={Eye}
            label="Total views"
            value={formatViews(stats.total_view_count)}
          />
          <StatCard
            icon={Star}
            label="Total reviews"
            value={stats.review_count}
          />

          {/* <StatCard
            icon={Video}
            label="Videos made"
            value={stats.video_count}
          /> */}
        </div>

        {/* Videos */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <Video className="h-4 w-4" />
            Your videos
            <span className="text-sm font-normal text-gray-400">
              ({videos.length})
            </span>
          </h2>
          {videos.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your videos..."
                className="h-9 w-full rounded-full border border-gray-300 bg-white pl-9 pr-8 text-sm text-navy placeholder:text-gray-400 outline-none focus:border-navy"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
            <Video className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="mb-1 text-sm font-semibold text-navy">
              No videos yet
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Upload your first video to start earning.
            </p>
            <button
              onClick={onUploadVideo}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-cream"
            >
              <Plus className="h-4 w-4" />
              Upload a video
            </button>
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            No videos match "{query}".
          </p>
        ) : (
          <div className="space-y-3">
            {filteredVideos.map((v) => (
              <VideoRow
                key={v.id}
                video={v}
                onEdit={onEditVideo}
                onDelete={onDeleteVideo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
