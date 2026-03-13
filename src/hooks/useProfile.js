import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../db/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function useProfile() {
  const { user } = useContext(AuthContext);

  const cached = localStorage.getItem("profile");

  const [profile, setProfile] = useState(cached ? JSON.parse(cached) : null);
  const [loading, setLoading] = useState(true); // if cache exists, no loading

  useEffect(() => {
    if (!user) {
      // setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };

        setProfile(data);

        localStorage.setItem("profile", JSON.stringify(data));
      }

      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return { profile, loading };
}