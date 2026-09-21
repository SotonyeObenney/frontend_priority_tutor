import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * FormLoader — "writing" loading state for form submissions
 * ------------------------------------------------------------
 * Your static palette (navy / gold / cream / pill) is intentionally flat —
 * no gradients, no glow, per DESIGN_SYSTEM.md. That's right for content
 * surfaces, but a loading state is motion, not chrome: it's on screen for
 * a second or two and nothing else competes with it. So this uses a
 * *vibrant variant* of your two brand hues, only here, only while
 * something is animating:
 *
 *   --navy   #1B2A4A  ->  --navy-vivid   #3D5AFE   (electric indigo)
 *   --gold   #C9A34E  ->  --gold-vivid   #FFC94D   (saturated amber)
 *
 * Same hue families as navy/gold (so it still reads as "your" app), just
 * pushed to full saturation the way a muted editorial palette gets
 * "poppy" versions for a splash screen or a progress state. The rest of
 * your app — cards, buttons, inputs — should stay exactly as flat as the
 * doc specifies. Don't reuse navy-vivid/gold-vivid outside loading states.
 *
 * Two exports:
 *  - <FormLoader />        full-size, drop into/over a form while it submits
 *  - <ButtonSpinner />     compact, drop inside a disabled submit button
 */

const loadingMessages = ["Submitting", "Almost there", "Just a moment"];

export function FormLoader({ label }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (label) return;
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [label]);

  const text = label ?? loadingMessages[messageIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <style>{`
        @keyframes pt-ink-draw {
          0%   { stroke-dashoffset: 340; }
          60%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -340; }
        }
        @keyframes pt-cursor-blink {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pt-letter-in {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pt-ink-path {
          stroke-dasharray: 170 170;
          animation: pt-ink-draw 1.6s ease-in-out infinite;
        }
        .pt-cursor {
          animation: pt-cursor-blink 1s step-end infinite;
        }
        .pt-letter {
          display: inline-block;
          opacity: 0;
          animation: pt-letter-in 0.35s ease-out forwards;
        }
      `}</style>

      {/* the "pen line" — a wavy stroke drawn in a loop, like ink laying down */}
      <svg
        width="140"
        height="48"
        viewBox="0 0 140 48"
        fill="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="pt-ink-gradient" x1="0" y1="0" x2="140" y2="0">
            <stop offset="0%" stopColor="#3D5AFE" />
            <stop offset="100%" stopColor="#FFC94D" />
          </linearGradient>
        </defs>
        <path
          d="M4 30 C 20 10, 34 10, 46 26 C 58 42, 72 42, 84 22 C 94 6, 106 6, 118 24 C 124 32, 130 32, 136 24"
          stroke="url(#pt-ink-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          className="pt-ink-path"
        />
      </svg>

      {/* status text, letter-in reveal + blinking cursor */}
      <p
        className="flex items-center text-sm font-medium tracking-tight text-navy"
        key={text}
        aria-live="polite"
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="pt-letter"
            style={{ animationDelay: `${i * 0.035}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <span
          className="pt-cursor ml-0.5 inline-block h-4 w-[2px] bg-navy"
          aria-hidden="true"
        />
      </p>
    </div>
  );
}

/** Compact inline version for use inside a disabled submit button:
 *    <button disabled className="... flex items-center gap-2">
 *      <ButtonSpinner /> Creating account...
 *    </button>
 */
export function ButtonSpinner({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <style>{`
        @keyframes pt-dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .pt-dot { animation: pt-dot-pulse 1s ease-in-out infinite; }
      `}</style>
      {["#3D5AFE", "#7C6FE0", "#FFC94D"].map((color, i) => (
        <span
          key={color}
          className="pt-dot h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function PageSpinner({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 bg-cream px-4">
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
      <p className="text-sm font-medium text-navy">{message}</p>
    </div>
  );
}

/* --- Demo shell (remove — just here so the preview shows both) --- */
export default function LoaderDemo() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-10 bg-cream">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6">
        <FormLoader />
      </div>
      <button
        disabled
        className="flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-cream opacity-80"
      >
        <ButtonSpinner />
        Creating account...
      </button>
    </div>
  );
}
