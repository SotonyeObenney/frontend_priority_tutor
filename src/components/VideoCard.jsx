import { formatNaira } from "./tools";

const COLORS = {
  navy: "#1B2A4A",
  gold: "#C9A34E",
  cream: "#FDF6D8",
  pill: "#EDE0A0",
};
export default function VideoCard({ video }) {
  return (
    <div className="shrink-0 w-64 sm:w-72 snap-start rounded-2xl border border-gray-200 bg-white overflow-hidden cursor-pointer transition-shadow hover:shadow-md">
      <div className="p-4 pb-3">
        <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: COLORS.navy, color: COLORS.cream }}
        >
          {video.course_code}
        </span>
      </div>

      <div className="px-4 pb-4">
        <h3
          className="text-sm font-medium leading-snug line-clamp-2 mb-1"
          style={{ color: COLORS.navy }}
        >
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{video.tutor_name}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {video.view_count}
          </span>

          {video.is_free ? (
            <span className="flex items-center gap-2">
              <span className="text-xs text-gray-400 line-through">
                {formatNaira(0)}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Free
              </span>
            </span>
          ) : (
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.navy }}
            >
              {formatNaira(video.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
