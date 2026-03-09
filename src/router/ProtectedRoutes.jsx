import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useContext(AuthContext);

  if (loading) return null; // or loader

  if (!user) {
    return <Navigate to="/register" />;
  }

  if (user && !profile?.profileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  return children;
}
