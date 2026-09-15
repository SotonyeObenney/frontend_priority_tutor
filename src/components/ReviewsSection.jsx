import { useState } from "react";
import { StarRating, StarRatingInput } from "./StarRating";

/**
 * ReviewsSection — shared between the unlocked and locked video pages.
 *
 * Gating logic (per your spec):
 *   - isOwner        -> can never write a review on their own video
 *   - !hasPurchased  -> can't write a review, but CAN still read others'
 *                       reviews (social proof pre-purchase is good UX,
 *                       and your spec only restricted *writing*)
 *   - hasPurchased && !isOwner -> full review form
 *
 * onGoToPurchase is only used in the !hasPurchased branch — wire it to
 * the same handler as your main "Unlock" CTA.
 */
export function ReviewsSection({
  reviews = [],
  averageRating = 0,
  reviewCount = reviews.length,
  isOwner = false,
  hasPurchased = false,
  onSubmitReview = () => {},
  onGoToPurchase = () => {},
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-navy">Reviews</h2>
        <div className="flex items-center gap-2">
          <StarRating rating={averageRating} />
          <span className="text-sm font-semibold text-navy">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">({reviewCount})</span>
        </div>
      </div>

      {/* Gated write-review area */}
      <div className="mt-5 rounded-lg border border-gray-200 bg-cream/60 p-4">
        {isOwner ? (
          <p className="text-sm text-gray-500">
            This is your own video &mdash; you can't leave a review on it.
          </p>
        ) : !hasPurchased ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Purchase this video to leave a review.
            </p>
            <button
              onClick={onGoToPurchase}
              className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-gold px-4 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
            >
              Unlock video
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-navy">Your rating</span>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of this video?"
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
            />
            <button
              type="submit"
              disabled={!rating}
              className="flex h-9 items-center justify-center rounded-lg bg-gold px-4 text-sm font-semibold text-navy transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              Post review
            </button>
          </form>
        )}
      </div>

      {/* Review list */}
      <div className="mt-5 divide-y divide-gray-100">
        {reviews.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No reviews yet &mdash; be the first.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-cream">
                    {r.full_name}
                  </span>
                  <span className="text-sm font-medium text-navy">
                    {r.user}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <StarRating rating={r.rating} size={13} className="mt-1.5" />
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
