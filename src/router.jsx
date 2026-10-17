// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import HomePage from "./Pages/HomePage.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import AdminPage from "./Pages/AdminPage.jsx";

import VideosPage from "./Pages/VideosPage.jsx";
import VideoPage from "./Pages/VideoPage.jsx";
import UserProfilePage from "./Pages/UserProfilePage.jsx";
import UploadVideoPage from "./Pages/UploadVideoPage.jsx";
import TutorDashboardPage from "./Pages/TutorDashboardPage.jsx";
import TutorApplyPage from "./Pages/TutorApplyPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TutorOnlyRoute from "./components/TutorOnlyRoute.jsx";
import AboutPage from "./Pages/AboutPage.jsx";
import AvatarManagerPage from "./Pages/AvatarManagerPage.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AdminOnlyRoute from "./components/AdminOnlyRoute.jsx";
import TutorProfile from "./Pages/TutorProfile.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />
      <Route path="auth/login" element={<AuthPage />} />
      <Route path="auth/register" element={<AuthPage />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="tutors/:tutorId" element={<TutorProfile />} />
        <Route
          path="tutors/apply"
          element={
            <ProtectedRoute>
              <TutorApplyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tutors/dashboard"
          element={
            <ProtectedRoute>
              <TutorOnlyRoute>
                <TutorDashboardPage />
              </TutorOnlyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="videos"
          element={
            <ProtectedRoute>
              <VideosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="videos/show_video/:video_id"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/upload_avatar"
          element={
            <ProtectedRoute>
              <AvatarManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="videos/upload"
          element={
            <ProtectedRoute>
              <TutorOnlyRoute>
                <UploadVideoPage />
              </TutorOnlyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/applications"
          element={
            <ProtectedRoute>
              <AdminOnlyRoute>
                <AdminDashboard />
              </AdminOnlyRoute>
            </ProtectedRoute>
          }
        />
        <Route path="users/profile" element={<UserProfilePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route errorElement={<NotFoundPage />} />
        <Route path="admin/application" element={<AdminPage />} />
      </Route>
    </>,
  ),
);
