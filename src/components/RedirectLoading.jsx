import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function RedirectLoading({ onComplete, delayMs = 2000 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar animation over the delay duration
    const interval = 50; // Update every 50ms
    const step = (interval / delayMs) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    // Main delay timer before executing completion/refresh
    const timeout = setTimeout(() => {
      onComplete();
    }, delayMs);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(timeout);
    };
  }, [delayMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream px-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold" />
          <ShieldCheck className="absolute h-5 w-5 text-navy" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-navy">Payment Received!</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            We are confirming your transaction with Paystack and unlocking your
            video content...
          </p>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-gold transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
