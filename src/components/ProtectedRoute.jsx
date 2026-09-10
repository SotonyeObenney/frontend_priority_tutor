import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Wait for session check to complete
  if (loading) return <div>Loading...</div>;

  // 2. Redirect unauthenticated users to login
  if (!user) return <Navigate to="/login" replace />;

  // 3. Render page if logged in
  return children;
};

export default ProtectedRoute;
