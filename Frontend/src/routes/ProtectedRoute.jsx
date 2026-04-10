import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. If not logged in, kick to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but wrong role (e.g., patient trying to see admin dashboard)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the page appropriate for their ACTUAL role
    if (user.role === "doctor")
      return <Navigate to="/doctordashboard" replace />;
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // 3. Authorized! Render the page
  return children;
};

export default ProtectedRoute;
