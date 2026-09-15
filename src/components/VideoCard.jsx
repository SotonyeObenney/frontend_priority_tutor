import { formatNaira } from "./tools";

const COLORS = {
  navy: "#1B2A4A",
  gold: "#C9A34E",
  cream: "#FDF6D8",
  pill: "#EDE0A0",
};
// export default function VideoCard({ video }) {
//   return (
//     <div className="shrink-0 w-64 sm:w-72 snap-start rounded-2xl border border-gray-200 bg-white overflow-hidden cursor-pointer transition-shadow hover:shadow-md">
//       <div className="p-4 pb-3">
//         <span
//           className="inline-block text-xs font-medium px-3 py-1 rounded-full"
//           style={{ background: COLORS.navy, color: COLORS.cream }}
//         >
//           {video.course_code}
//         </span>
//       </div>

//       <div className="px-4 pb-4">
//         <h3
//           className="text-sm font-medium leading-snug line-clamp-2 mb-1"
//           style={{ color: COLORS.navy }}
//         >
//           {video.title}
//         </h3>
//         <p className="text-xs text-gray-500 mb-3">{video.tutor_name}</p>

//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-400 flex items-center gap-1">
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//               <circle cx="12" cy="12" r="3" />
//             </svg>
//             {video.view_count}
//           </span>

//           {video.is_free ? (
//             <span className="flex items-center gap-2">
//               <span className="text-xs text-gray-400 line-through">
//                 {formatNaira(0)}
//               </span>
//               <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
//                 Free
//               </span>
//             </span>
//           ) : (
//             <span
//               className="text-sm font-semibold"
//               style={{ color: COLORS.navy }}
//             >
//               {formatNaira(video.price)}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function VideoCard({ video, onSelectVideo }) {
  const isNavyThumb = hashCode(video.course_code) % 2 === 0;

  return (
    <button
      onClick={() => onSelectVideo(video.id)}
      className="group w-[200px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-shadow hover:shadow-md sm:w-[220px]"
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
