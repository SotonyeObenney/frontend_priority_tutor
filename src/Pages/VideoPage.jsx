import VideoUnlocked from "../components/VideoUnlocked";
import VideoLocked from "../components/VideoLocked";
import {
  useParams,
  useNavigate,
  data,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Eye } from "lucide-react";
import { apiFetch } from "../api";
import { ButtonSpinner, PageSpinner } from "../components/FormLoader";
import RedirectLoading from "../components/RedirectLoading";

export default function VideoPage() {
  const { video_id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  // Detect if returning from Paystack redirect
  const isPaymentReturn =
    searchParams.get("purchased") === "true" ||
    searchParams.get("reference") !== null ||
    searchParams.get("trxref") !== null;

  const handlePurchase = async () => {
    const data = await apiFetch(`videos/buy/${video_id}`);
    console.log(data);
    if (data?.auth_url) {
      // 2. Redirect to the external payment gateway URL securely
      window.location.href = data.auth_url;
    } else {
      alert("Failed to initiate payment gateway session.");
      // setIsLoading(false);
    }
  };

  const handleRedirectComplete = () => {
    // Perform a full page refresh directly to clean URL parameters
    window.location.href = `/videos/show_video/${video_id}`;
  };

  // useEffect(() => {
  //   async function loadVideoData() {
  //     try {
  //       const data = await apiFetch(`videos/show_video/${video_id}`, {
  //         method: "GET",
  //       });
  //       setVideo(data?.video);
  //     } catch (err) {
  //       setError(err.data);
  //       console.error(err.data.video);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   if (video_id) {
  //     loadVideoData();
  //   }
  // }, [video_id]);

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 4; // Poll up to 4 times (every 1.5 seconds)
    if (isPaymentReturn) return;

    async function loadVideoData() {
      try {
        const data = await apiFetch(`videos/show_video/${video_id}`);

        if (!isMounted) return;

        const userHasAccess = data.video.access;

        // If access is already granted OR we ran out of attempts, stop polling
        if (userHasAccess || attempts >= maxAttempts) {
          setVideo(data?.video);
          console.log("IS is here");
          setLoading(false);
        } else {
          // If access isn't granted yet, wait 1.5s and retry (waiting for Webhook)
          attempts += 1;
          setTimeout(loadVideoData, 1500);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.data);
          console.log(error.data);
          setLoading(false);
        }
      }
    }

    if (video_id) loadVideoData();

    return () => {
      isMounted = false;
    };
  }, [video_id, isPaymentReturn]);

  if (isPaymentReturn) {
    return (
      <RedirectLoading onComplete={handleRedirectComplete} delayMs={2000} />
    );
  }

  if (loading) {
    return <PageSpinner message="Loading video content..." />;
  }

  // 2. Error State Screen
  if (error) {
    console.log(error);
    console.log(error.video);
    if (error?.video.access === false) {
      return <VideoLocked video={error?.video} onUnlock={handlePurchase} />;
    } else
      return (
        // <ErrorState message={error} onRetry={() => window.location.reload()} />
        <div>Error</div>
      );
  }

  // 3. Fallback / Empty State
  if (!video) {
    return (
      <div className="p-8 text-center text-gray-500">Video not found.</div>
    );
  }

  return (
    <>
      {video ? (
        <VideoUnlocked video={video} />
      ) : (
        <VideoLocked video={error?.video} onUnlock={handlePurchase} />
      )}
    </>
  );
}
