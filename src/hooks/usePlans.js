import { useEffect, useState } from "react";
import { db } from "../db/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function usePlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const q = query(
          collection(db, "plans"),
          orderBy("createdAt", "asc") // earliest first
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans", err);
      }
    };

    fetchPlans();
  }, []);

  return plans;
}