import { useState } from "react";
import { Clock3, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { hashCode } from "../components/videoUtils";
import { apiFetch } from "../api";
import StatusBanner from "../components/StautsBanner";
import { useEffect } from "react";

StatusBanner;

// import { hashCode } from "./videoUtils";

const PATH = "tutors/apply";

function CoursePill({ code }) {
  const isNavy = hashCode(code) % 2 === 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isNavy ? "bg-navy text-cream" : "bg-pill text-navy"
      }`}
    >
      {code}
    </span>
  );
}

function parseCourses(raw) {
  return raw
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

//Error handling useEffect

export default function TutorApplyPage({ application }) {
  async function onSubmit(data) {
    try {
      const response = await apiFetch(PATH, {
        method: "POST",
        body: data,
      });
      setAlert("Application submitted");
      setCoursesInput("");
      setBio("");
    } catch (error) {
      setError(error);
    }
  }
  const [bio, setBio] = useState(application?.bio ?? "");
  const [error, setError] = useState();
  const [coursesInput, setCoursesInput] = useState(application?.courses ?? "");
  const [alert, setAlert] = useState("");

  const parsedCourses = parseCourses(coursesInput);
  const canSubmit = bio.trim().length >= 10 && parsedCourses.length > 0;

  //Error handling useEffect
  useEffect(() => {
    if (error || alert) {
      const timer = setTimeout(() => {
        setError("");
        setAlert("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, alert]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ bio: bio.trim(), courses: parsedCourses.join(", ") });
  };

  return (
    <div className="min-h-screen w-full bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {error && (
          <StatusBanner
            positive={false}
            errorType={"Application"}
            errorMessage={error?.message}
          />
        )}
        {alert && <StatusBanner positive={true} successMessage={alert} />}

        <h1 className="mb-1 text-2xl font-bold tracking-tight text-navy">
          Become a tutor
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Tell us what you can teach. Every application is reviewed before you
          can upload videos.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
        >
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-navy">
              About you
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="I love teaching..."
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
            />
          </div>

          <div className="mb-2">
            <label className="mb-1.5 block text-sm font-medium text-navy">
              Courses you can teach
            </label>
            <input
              type="text"
              value={coursesInput}
              onChange={(e) => setCoursesInput(e.target.value)}
              placeholder="e.g. PHY 102, MTH 201"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-navy outline-none focus:border-navy"
            />
            <p className="mt-1 text-xs text-gray-400">
              Separate multiple courses with commas.
            </p>
          </div>

          {parsedCourses.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {parsedCourses.map((c) => (
                <CoursePill key={c} code={c} />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-semibold text-cream transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            Submit application
          </button>
        </form>
      </div>
    </div>
  );
}
