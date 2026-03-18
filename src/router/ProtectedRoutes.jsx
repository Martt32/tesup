import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useProfile } from "../hooks";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile?.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!profile?.verified) {
    return <Navigate to="/email-verify" replace />;
  }

  return children;
}
