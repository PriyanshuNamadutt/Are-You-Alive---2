import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Blocks access unless logged in. */
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/** Blocks access unless logged in AND onboarding details are complete. */
export const RequireDetails = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.detailsCompleted) return <Navigate to="/details" replace />;
  return children;
};
