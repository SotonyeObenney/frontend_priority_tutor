import { CheckCircle2, User, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { ReviewsSection } from "./ReviewsSection";

/**
 * VideoAccessUnlocked — post-payment video view, Ink and Sun palette
 * ------------------------------------------------------------
 * Changes in this version:
 * - View count added next to the tutor line (Eye icon, neutral gray —
 *   this one stays informational rather than accented, so gold doesn't
 *   get diluted by putting it on everything).
 * - Reviews section added below the video card, gated per your rule:
 *   owners can't review their own video, non-purchasers can't write one
 *   either (but can still read others' — see ReviewsSection.jsx).
 * - Gold now appears as real fill, not just text/rings: the average-
 *   rating stars and the "Post review" button. That's the fix for
 *   "majorly blue and white" — gold was previously only a thin ring and
 *   a text link, which barely registers as a color at all.
 *
 * Props:
 *   video: the `video` object from your payload, extended with
 *     view_count (number) and reviews (array of {id, user, rating, comment, date})
 *   onBack, onNext: nav handlers (same as before)
 *   onSubmitReview({ rating, comment })
 */

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function CourseBadge({ code }) {
  const isNavy = hashCode(code) % 2 === 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
        isNavy ? "bg-navy text-cream" : "bg-pill text-navy"
      }`}
    >
      {code}
    </span>
  );
}

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatViews(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

const demoReviews = [
  {
    id: 1,
    user: "Bala Ahmed",
    rating: 5,
    comment: "Explained the recursion part way better than my lecturer did.",
    date: "2 days ago",
  },
  {
    id: 2,
    user: "Chidinma Okafor",
    rating: 4,
    comment: "Good pace, wish the audio was a bit louder in the second half.",
    date: "1 week ago",
  },
];

export default function VideoUnlocked({
  video = {
    VIDEO_ID: "njX2bu-_Vw4",
    course_code: "TST 101",
    description: "This is a test video for development purposes",
    id: 27,
    is_owner: false,
    price: 2000.0,
    title: "Test Video",
    tutor: "Ifeoluwa",
    view_count: 1204,
    reviews: demoReviews,
  },
  onBack = () => {},
  onNext = null,
  onSubmitReview = () => {},
}) {
  const reviews = video.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3.5 sm:items-center">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success sm:mt-0" />
          <div>
            <p className="text-sm font-semibold text-success">
              Payment successful &bull; Access granted
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              You paid {formatNaira(video.price)} for this video &mdash; it's
              yours to watch anytime.
            </p>
          </div>
        </div>

        {/* Video card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="relative aspect-video w-full bg-navy">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${video.VIDEO_ID}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <CourseBadge code={video.course_code} />

            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Tutor: {video.tutor}</span>
              </div>
              {typeof video.view_count === "number" && (
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(video.view_count)} views</span>
                </div>
              )}
            </div>

            <p className="border-t border-gray-100 pt-4 text-[15px] leading-relaxed text-gray-600">
              {video.description}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection
          reviews={reviews}
          averageRating={averageRating}
          isOwner={video.is_owner}
          hasPurchased={true}
          onSubmitReview={onSubmitReview}
        />

        {/* Navigation */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onBack}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course dashboard
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]"
            >
              Next lesson
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
