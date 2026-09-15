import VideoUnlocked from "../components/VideoUnlocked";
import VideoLocked from "../components/VideoLocked";
import { useParams, useNavigate, data } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Eye } from "lucide-react";
import { apiFetch } from "../api";

export default function VideoPage() {
  const { video_id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getVideo() {
      try {
        const data = await apiFetch(`videos/show_video/${video_id}`, {
          method: "GET",
        });
        console.log("ran");
        setVideo(data?.video);
        console.log(data);
        console.log(data?.video);
      } catch (err) {
        setError(err.data);
        console.log(video);
        console.log(err.data.video);
      } finally {
        setLoading(false);
      }
    }
    getVideo();
  }, []);

  return (
    <>
      {video ? (
        <VideoUnlocked video={video} />
      ) : (
        <VideoLocked video={error?.video} />
      )}
    </>
  );
}
