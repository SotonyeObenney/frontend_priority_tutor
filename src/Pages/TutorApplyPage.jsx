import { useState } from "react";
import { Clock3, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { hashCode } from "../components/videoUtils";
import { apiFetch } from "../api";
import StatusBanner from "../components/StautsBanner";
import { useEffect } from "react";

StatusBanner;

// import { hashCode } from "./videoUtils";

/**
 * TutorApplicationPage — apply to become a tutor, then wait for approval.
 * ------------------------------------------------------------
 * Status color mapping established here (worth keeping consistent
 * everywhere else a review/approval flow shows up):
 *   pending  -> gold-tinted banner  (in progress, needs attention/patience)
 *   approved -> success-tinted banner (confirmed good outcome)
 *   rejected -> danger-tinted banner  (confirmed bad outcome)
 * Same logic as the locked-video banner (gold = prompt/in-progress) and
 * the payment-success banner (green = confirmed) from the video pages.
 *
 * The `courses` field in your API is a single string even though it's
 * named plural — this form lets a tutor type multiple comma-separated
 * codes (much better UX than a single-course limit) and joins them back
 * into one string on submit, matching your current backend. Course pills
 * preview live as they type, reusing the same hashed navy/pale-gold
 * badge logic as course codes everywhere else in the app.
 *
 * Props:
 *   status: "none" | "pending" | "approved" | "rejected"
 *   application: { bio, courses } — the already-submitted values, if any
 *   rejectionReason?: string
 *   onSubmit: ({ bio, courses }) => void   // courses is the joined string
 *   onGoToUpload: () => void               // approved state CTA
 *   onReapply: () => void                  // rejected state CTA
 */

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
    } catch (error) {
      setError(error);
    }
  }
  const [bio, setBio] = useState(application?.bio ?? "");
  const [error, setError] = useState();
  const [coursesInput, setCoursesInput] = useState(application?.courses ?? "");

  const parsedCourses = parseCourses(coursesInput);
  const canSubmit = bio.trim().length >= 10 && parsedCourses.length > 0;

  //Error handling useEffect
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

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

        <h1 className="mb-1 text-2xl font-bold tracking-tight text-navy">
          Become a tutor
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Tell us what you can teach. Every application is reviewed before you
          can upload videos.
        </p>
        {/* PENDING */}
        {/* <div className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
            <div>
              <p className="text-sm font-semibold text-navy">
                Application under review
              </p>
              <p className="mt-0.5 text-sm text-gray-600">
                We'll notify you as soon as an admin makes a decision. This
                usually takes a couple of days.
              </p>
            </div>
          </div>
        </div> */}
        {/* APPROVED AS TUTOR */}
        {/* <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3.5 sm:items-center">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success sm:mt-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-success">
              You're approved as a tutor
            </p>
            <p className="mt-0.5 text-sm text-gray-600">
              You can start uploading videos right away.
            </p>
          </div>
        </div> */}

        {/* Pending / approved / rejected: show a read-only recap of what was submitted */}

        {/* {status === "approved" && (
          <button
            onClick={onGoToUpload}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy text-sm font-semibold text-cream transition-transform hover:scale-[1.01]"
          >
            Upload your first video
            <ArrowRight className="h-4 w-4" />
          </button>
        )} */}

        {/* {status === "rejected" && (
          <button
            onClick={onReapply}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-semibold text-cream transition-transform hover:scale-[1.01]"
          >
            Apply again
          </button>
        )} */}

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
