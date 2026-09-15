import { Star } from "lucide-react";

/**
 * StarRating — read-only display, gold-filled stars.
 * StarRatingInput — interactive 1-5 picker for the review form.
 *
 * This is the first place gold gets used as a genuine fill rather than
 * text/ring — stars are a case where the old "no gold fill" rule never
 * should have applied anyway; rating stars are gold in basically every
 * product that has them, it's a strong, expected signal.
 */
export function StarRating({ rating = 0, size = 16, className = "" }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={
            i <= Math.round(rating)
              ? "fill-gold text-gold"
              : "fill-none text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export function StarRatingInput({ value = 0, onChange = () => {}, size = 24 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            width={size}
            height={size}
            className={
              i <= value ? "fill-gold text-gold" : "fill-none text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
