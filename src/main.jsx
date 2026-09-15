import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./index.css";
import HomePage from "./Pages/HomePage.jsx";
import AuthPage from "./Pages/AuthPage.jsx"; // Imported loginLoader
import AdminPage from "./Pages/AdminPage.jsx";
import TutorsPage from "./Pages/TutorsPage.jsx";
import VideosPage from "./Pages/VideosPage.jsx";
import VideoPage from "./Pages/VideoPage.jsx";
import UserProfilePage from "./Pages/UserProfilePage.jsx";
import UploadVideoPage from "./Pages/UploadVideoPage.jsx";
import TutorDashboardPage from "./Pages/TutorDashboardPage.jsx";
import TutorApplyPage from "./Pages/TutorApplyPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

function RootLayout() {
  // const navigate = useNavigate();
  // const location = useLocation();

  // // Simulated Auth logic (Replace with your actual Auth system/Context)
  // const isAuthenticated = true;
  // const user = { name: "Alex Smith" };
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get your auth state (Replace with your actual auth logic/context)
  const { isAuthenticated, user, logout } = useAuth();

  // 2. Define handler actions
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLoginClick = () => {
    navigate("/login"); // or trigger a login modal state: setIsLoginOpen(true)
  };

  return (
    <>
      {console.log(isAuthenticated)}
      {/* The Navbar lives here globally and handles its own props automatically */}
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
        onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
        onLogin={() => navigate("/login")}
        onRegister={() => {
          navigate("auth/register");
        }}
        onLogout={() => {
          logout();
          navigate("/auth/login");
        }}
      />
      {/* This renders whatever specific page/route you are currently visiting */}
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </>
  );
}
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />

      <Route path="auth/login" element={<AuthPage />} />
      <Route path="auth/register" element={<AuthPage />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="tutors/:tutorUserId" element={<TutorsPage />} />
        <Route path="tutors/apply" element={<TutorApplyPage />} />
        <Route path="tutors/dashboard" element={<TutorDashboardPage />} />

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
          path="videos/upload"
          element={
            <ProtectedRoute>
              <UploadVideoPage />
            </ProtectedRoute>
          }
        />

        <Route path="users/profile" element={<UserProfilePage />} />
        <Route errorElement={<NotFoundPage />} />

        <Route path="admin/application" element={<AdminPage />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
