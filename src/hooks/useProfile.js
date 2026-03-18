import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../db/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function useProfile() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("profile");
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      localStorage.removeItem("profile");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProfile(data);
          localStorage.setItem("profile", JSON.stringify(data));
        } else {
          setProfile(null);
          localStorage.removeItem("profile");
        }

        setLoading(false);
      },
      (error) => {
        console.error("Profile snapshot error:", error);
        setProfile(null);
        localStorage.removeItem("profile");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  return { profile, loading };
}