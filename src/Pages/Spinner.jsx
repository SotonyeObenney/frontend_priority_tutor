// Spinner.jsx
//   <Spinner />                 the spinning ring (default: for light backgrounds)
//   <Spinner tone="light" />    use this INSIDE navy buttons, where the dark ring would vanish
//   <PageLoader />              centered spinner + label for "the whole page is loading"
//
// Styling follows the design system: navy ring on a gray-200 track, no gold, no shadow.

const TONES = {
  dark: "border-gray-200 border-t-navy",
  light: "border-cream/30 border-t-cream",
};

export function Spinner({ size = 20, tone = "dark", className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={`inline-block animate-spin rounded-full border-2 motion-reduce:animate-none ${TONES[tone]} ${className}`}
    />
  );
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner size={28} />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
