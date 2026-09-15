import { Lock, User, Eye, ArrowLeft } from "lucide-react";
import { ReviewsSection } from "./ReviewsSection";

/**
 * VideoLocked — same page, pre-purchase state
 * ------------------------------------------------------------
 * - No iframe is rendered at all — the video is genuinely gated, not
 *   just visually hidden while the embed still loads in the background.
 * - Reviews are still readable (social proof helps conversion) but the
 *   write-form is gated by ReviewsSection's !hasPurchased branch, which
 *   surfaces its own "Unlock video" CTA.
 * - This page leans on gold the most of anything so far: the price, the
 *   lock badge, and the main CTA are all gold. That's deliberate — this
 *   is the single highest-stakes action on the platform (a purchase),
 *   so it gets the boldest, most attention-grabbing color you have,
 *   same logic as "one navy button per screen" but the accent is now
 *   allowed to be the one that wins that slot when the action is a sale.
 *
 * Props:
 *   video: same shape as VideoAccessUnlocked, minus VIDEO_ID being usable
 *   onBack: () => void
 *   onUnlock: () => void   — kick off payment flow
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
    name: "Bala Ahmed",
    rating: 5,
    comment: "Explained the recursion part way better than my lecturer did.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Chidinma Okafor",
    rating: 4,
    comment: "Good pace, wish the audio was a bit louder in the second half.",
    date: "1 week ago",
  },
];

export default function VideoLocked({
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
  onUnlock = () => {},
}) {
  // const handlePurchase(id){

  // }
  const reviews = video?.reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Locked banner — gold, not success-green: this is a prompt, not a confirmation */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3.5 sm:items-center">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-navy sm:mt-0" />
          <p className="text-sm font-semibold text-navy">
            Unlock this video to watch it, ask questions, and leave a review.
          </p>
        </div>

        {/* Locked video card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="relative flex aspect-video w-full items-center justify-center bg-navy">
            {/* scatter-pill motif reused as texture behind the lock, at low opacity */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 overflow-hidden opacity-10">
              {["PHY 101", "MTH 202", "CHM 102", "ACC 201", "STA 111"].map(
                (c) => (
                  <span
                    key={c}
                    className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-navy"
                  >
                    {c}
                  </span>
                ),
              )}
            </div>

            <div className="relative flex flex-col items-center gap-3 px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold">
                <Lock className="h-6 w-6 text-navy" />
              </span>
              <p className="text-sm font-medium text-cream/80">
                Purchase to unlock full access
              </p>
              <p className="text-2xl font-bold text-cream">
                {formatNaira(video.price)}
              </p>
              <button
                onClick={onUnlock}
                className="mt-1 flex h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-bold text-navy transition-transform hover:scale-[1.03]"
              >
                Unlock this video
              </button>
            </div>
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

        {/* Reviews — readable pre-purchase, writing is gated */}
        <ReviewsSection
          reviews={reviews}
          averageRating={averageRating}
          isOwner={video.is_owner}
          hasPurchased={false}
          onGoToPurchase={onUnlock}
        />

        <div className="mt-6">
          <button
            onClick={onBack}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
