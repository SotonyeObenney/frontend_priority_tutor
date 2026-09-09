import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import HomePage from "./Pages/HomePage.jsx";
import AuthPage, { loginLoader } from "./Pages/AuthPage.jsx"; // Imported loginLoader
import AdminPage from "./Pages/AdminPage.jsx";
import TutorsPage from "./Pages/TutorsPage.jsx";
import VideosPage from "./Pages/VideosPage.jsx";
import VideoPage from "./Pages/VideoPage.jsx";
import UserProfilePage from "./Pages/UserProfilePage.jsx";
import UploadVideoPage from "./Pages/UploadVideoPage.jsx";
import TutorDashboardPage from "./Pages/TutorDashboardPage.jsx";
import TutorApplyPage from "./Pages/TutorApplyPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />

      <Route path="auth/login" loader={loginLoader} element={<AuthPage />} />
      <Route path="auth/register" element={<AuthPage />} />

      <Route path="tutors/:tutorUserId" element={<TutorsPage />} />
      <Route path="tutors/apply" element={<TutorApplyPage />} />
      <Route path="tutors/dashboard" element={<TutorDashboardPage />} />

      <Route path="videos" element={<VideosPage />} />
      <Route path="videos/show_video/:videoId" element={<VideoPage />} />
      <Route path="videos/upload" element={<UploadVideoPage />} />

      <Route path="users/profile" element={<UserProfilePage />} />

      <Route path="admin/application" element={<AdminPage />} />
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
