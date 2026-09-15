import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for session check to complete
  if (loading) return <div>Loading...</div>;

  // 2. Redirect unauthenticated users to login
  if (!user)
    return <Navigate state={{ from: location }} to="/auth/login" replace />;

  // 3. Render page if logged in
  return children;
};

export default ProtectedRoute;

// create a loading component for line 7.
