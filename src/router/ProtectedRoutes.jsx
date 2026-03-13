import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useProfile } from "../hooks";
import Loader from "../components/Loader";
export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { profile, loading: profileLoading } = useProfile();

  if (profileLoading) return <Loader />; // or loader

  if (!user) return <Navigate to="/login" />;

  if (!profile?.profileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  if (!profile?.verified) {
    return <Navigate to="/email-verify" />;
  }

  return children;
}
