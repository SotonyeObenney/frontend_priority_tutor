import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
const TutorOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for session check to complete
  if (loading) return <div>Loading...</div>;

  // 2. Redirect unauthenticated users to login
  if (!user?.is_tutor)
    return <Navigate state={{ from: location }} to="/tutors/apply" replace />;

  // 3. Render page if logged in
  return children;
};

export default TutorOnlyRoute;

// create a loading component for line 7.
