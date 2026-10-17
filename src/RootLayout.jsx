// src/layouts/RootLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
        onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("auth/register")}
        onLogout={() => {
          logout();
          navigate("/auth/login");
        }}
        onApply={() => navigate("tutors/apply")}
      />
      <main className="w-full min-h-screen bg-cream p-4">
        <Outlet />
      </main>
    </>
  );
}
