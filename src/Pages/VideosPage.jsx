import { useRef } from "react";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";

// Brand tokens — move these into tailwind.config.js as named colors
// (navy, gold, cream) once this lives in the real Vite project.
const COLORS = {
  navy: "#1B2A4A",
  gold: "#C9A34E",
  cream: "#FDF6D8",
};

// Placeholder data — the real /videos/ endpoint doesn't return a
// university field yet. This mocks what it should look like once
// the backend joins tutor -> user -> university_id into the response.
const DUMMY_VIDEOS = [
  {
    id: 1,
    course_code: "COS 202",
    title: "Java Programming",
    tutor_name: "David Jolly",
    price: 1000,
    is_free: false,
    view_count: 1,
    university: "University of Port Harcourt",
  },
  {
    id: 2,
    course_code: "COS 202",
    title: "How to make fried foods",
    tutor_name: "Emeka Jakes",
    price: 0,
    is_free: false,
    view_count: 0,
    university: "University of Port Harcourt",
  },
  {
    id: 24,
    course_code: "COS 202",
    title: "C language",
    tutor_name: "Ifeoluwa",
    price: 7000,
    is_free: false,
    view_count: 0,
    university: "University of Port Harcourt",
  },
  {
    id: 25,
    course_code: "COS 202",
    title: "JavaScript",
    tutor_name: "Ifeoluwa",
    price: 1000,
    is_free: false,
    view_count: 0,
    university: "University of Port Harcourt",
  },
  {
    id: 20,
    course_code: "MTH 202",
    title: "Essence of Integration",
    tutor_name: "Ifeoluwa",
    price: 8900,
    is_free: false,
    view_count: 9,
    university: "University of Port Harcourt",
  },
  {
    id: 22,
    course_code: "MTH 202",
    title: "Jesus loves me",
    tutor_name: "Tutor 1",
    price: 1000,
    is_free: true,
    view_count: 2,
    university: "University of Port Harcourt",
  },
  {
    id: 15,
    course_code: "CHM 202",
    title: "The quick brown fox",
    tutor_name: "a",
    price: 5000,
    is_free: false,
    view_count: 3,
    university: "University of Lagos",
  },
  {
    id: 16,
    course_code: "GET 299",
    title: "Jesus",
    tutor_name: "a",
    price: 10000,
    is_free: false,
    view_count: 2,
    university: "University of Lagos",
  },
  {
    id: 17,
    course_code: "HRT 101",
    title: "Forever You Will Be",
    tutor_name: "a",
    price: 2500,
    is_free: false,
    view_count: 2,
    university: "University of Lagos",
  },
  {
    id: 18,
    course_code: "JSH 101",
    title: "All in All",
    tutor_name: "Josh Garrels",
    price: 1500,
    is_free: true,
    view_count: 3,
    university: "University of Lagos",
  },
  {
    id: 14,
    course_code: "PUP 101",
    title: "Purpose",
    tutor_name: "Tutor 1",
    price: 500,
    is_free: false,
    view_count: 3,
    university: "Obafemi Awolowo University",
  },
  {
    id: 27,
    course_code: "TST 101",
    title: "Test Video",
    tutor_name: "Ifeoluwa",
    price: 2000,
    is_free: false,
    view_count: 1,
    university: "Obafemi Awolowo University",
  },
  {
    id: 28,
    course_code: "TST 101",
    title: "Test Video",
    tutor_name: "Ifeoluwa",
    price: 0,
    is_free: true,
    view_count: 0,
    university: "Obafemi Awolowo University",
  },
];

// Deterministic navy/gold assignment per course code, echoing the
// scattered-pill treatment from the auth screens for visual consistency.
function codeStyle(courseCode) {
  let hash = 0;
  for (let i = 0; i < courseCode.length; i++) {
    hash = courseCode.charCodeAt(i) + ((hash << 5) - hash);
  }
  const useNavy = Math.abs(hash) % 2 === 0;
  return useNavy
    ? { background: COLORS.navy, color: COLORS.cream }
    : { background: "#EDE0A0", color: COLORS.navy };
}

function UniversityRow({ university, videos }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: COLORS.navy }}
          >
            {university}
          </h2>
          <p className="text-xs text-gray-400">{videos.length} videos</p>
        </div>

        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${university} videos left`}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.navy}
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${university} videos right`}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.navy}
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}

export default function VideosPage() {
  const universities = [...new Set(DUMMY_VIDEOS.map((v) => v.university))];

  return (
    <div className="min-h-screen" style={{ background: COLORS.cream }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: COLORS.navy }}
          >
            Browse videos
          </h1>
          <p className="text-sm text-gray-500">
            Course tutorials from students at your university and others.
          </p>
        </header>

        {universities.map((uni) => (
          <UniversityRow
            key={uni}
            university={uni}
            videos={DUMMY_VIDEOS.filter((v) => v.university === uni)}
          />
        ))}
      </div>
    </div>
  );
}
